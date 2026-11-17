---
title: Parallel Entropy Anomaly Detection
summary: Sliding-window Shannon entropy and chi-square scan for finding encrypted or packed regions in disk images, accelerated from a sequential baseline with MPI, parallel MPI-IO and CUDA, up to 14.8x faster on a 1.4 GB image.
category: coursework
tags: [C++, MPI, OpenMP, CUDA, MPI-IO, nvprof, Nsight Systems]
start: 2025-12
end: 2025-12
role: 2-person team project
featured: false
order: 10
---

<!-- TODO: add demo plot of entropy / chi-square along one test image, and the numbers for the 5–18 GB cases once they are exported -->

## Problem

Ransomware often encrypts only part of a file, and malware hides encrypted payloads inside otherwise ordinary files. Both show up as regions where the byte distribution suddenly becomes close to uniform. This project scans a whole file with a sliding window and reports two statistics for every window:

- **Shannon entropy** (0–8 bits per byte). Near 8 means the window looks random: encrypted or compressed.
- **Chi-square** against a uniform byte distribution. A sudden drop means the bytes are unusually evenly spread, which is the other signature of encrypted data. Plain text scores high.

With a 1 KB window and a 256 B step, the work is $O(N \times W)$ for a file of $N$ bytes. A sequential run takes about four minutes for a 10 GB image, so the scan is worth parallelising.

## Versions I compared

Every version computes identical results; only how the work and the I/O are distributed changes.

| Version | Compute | I/O |
| --- | --- | --- |
| Sequential | 1 thread | rank 0 reads and writes everything |
| MPI-CPU | windows split across processes, OpenMP inside each | one process reads, then `MPI_Gatherv` to rank 0 |
| MPI-CPU + parallel I/O | same | every rank `MPI_File_read_at` / `MPI_File_write_at` its own range |
| CUDA | one block per window, 256 threads, parallel reduction | host read and write |
| CUDA + MPI-IO | same kernel, two ranks share one GPU | parallel read and write, whichever rank finishes first writes first |

For CUDA, each block handles one window. Its 256 threads each take 4 bytes of the window, build the byte histogram, and merge entropy and chi-square with a parallel reduction. I also tried a shared-memory histogram variant and profiled occupancy, global memory throughput and SM efficiency with `nvprof`, and checked API timelines with Nsight Systems.

## Results

Test data are generated disk images that mix text, executable and encrypted blocks (241 MB to 18 GB). The figures below use the 1434 MB image. The darker part of each bar is the I/O time.

<div class="bars" role="img" aria-label="Elapsed time on the 1434 MB image: sequential 33.52 s, MPI-CPU 16.84 s, CUDA 12.26 s, MPI-CPU parallel I/O on 1 node 6.20 s, CUDA with MPI-IO 5.54 s, MPI-CPU parallel I/O on 4 nodes 2.27 s">
<style>
  .bars { display: grid; gap: 0.55rem; margin: 1.25rem 0 0.5rem; font-family: var(--mono); font-size: 0.78rem; }
  .bars .row { display: grid; grid-template-columns: 11.5rem 1fr 4.2rem; align-items: center; gap: 0.75rem; }
  .bars .lab { color: var(--text-dim); }
  .bars .track { background: var(--surface-2); border-radius: 4px; height: 1.1rem; overflow: hidden; }
  .bars .fill { height: 100%; background: var(--accent); border-radius: 4px; position: relative; }
  .bars .io { position: absolute; left: 0; top: 0; bottom: 0; background: rgba(0, 0, 0, 0.35); border-radius: 4px 0 0 4px; }
  .bars .val { text-align: right; color: var(--text); }
  @media (max-width: 40rem) { .bars .row { grid-template-columns: 1fr 4.2rem; } .bars .lab { grid-column: 1 / -1; } }
</style>
<div class="row"><span class="lab">Sequential</span><div class="track"><div class="fill" style="width:100%"><div class="io" style="width:48.6%"></div></div></div><span class="val">33.52 s</span></div>
<div class="row"><span class="lab">MPI-CPU (rank 0 I/O)</span><div class="track"><div class="fill" style="width:50.2%"><div class="io" style="width:93.4%"></div></div></div><span class="val">16.84 s</span></div>
<div class="row"><span class="lab">CUDA, 1 GPU</span><div class="track"><div class="fill" style="width:36.6%"><div class="io" style="width:88.4%"></div></div></div><span class="val">12.26 s</span></div>
<div class="row"><span class="lab">MPI-IO, 1 node</span><div class="track"><div class="fill" style="width:18.5%"><div class="io" style="width:16.5%"></div></div></div><span class="val">6.20 s</span></div>
<div class="row"><span class="lab">CUDA + MPI-IO</span><div class="track"><div class="fill" style="width:16.5%"><div class="io" style="width:34.7%"></div></div></div><span class="val">5.54 s</span></div>
<div class="row"><span class="lab">MPI-IO, 4 nodes</span><div class="track"><div class="fill" style="width:6.8%"><div class="io" style="width:27.8%"></div></div></div><span class="val">2.27 s</span></div>
</div>

Elapsed time (s) across input sizes:

| Version | 241 MB | 503 MB | 739 MB | 1005 MB | 1434 MB |
| --- | --- | --- | --- | --- | --- |
| Sequential | 5.67 | 11.59 | 17.19 | 23.40 | 33.52 |
| MPI-CPU, rank 0 I/O (4 nodes) | 3.06 | 5.92 | 8.59 | 11.29 | 16.84 |
| MPI-IO (4 nodes, 8 ranks × 6 threads) | 0.72 | 1.08 | 1.47 | 1.70 | 2.27 |
| MPI-IO (1 node, 2 ranks × 6 threads) | 1.34 | 2.37 | 3.43 | 4.61 | 6.20 |
| CUDA, 1 GPU | 2.27 | 4.67 | 6.18 | 9.31 | 12.26 |
| CUDA + MPI-IO (1 GPU, 2 ranks) | 1.03 | 2.19 | 3.00 | 4.05 | 5.54 |

## What I learned

- **I/O, not compute, was the bottleneck.** After parallelising the compute, MPI-CPU spent 93% of its time on I/O (15.73 of 16.84 s) and was only 2x faster than sequential. Switching to parallel MPI-IO moved the same hardware from 2x to 14.8x.
- **Per-process load was badly unbalanced** until every rank read and wrote its own byte range. Once ranges were assigned up front, rank times lined up.
- **A fast kernel does not help if the host path is slow.** CUDA alone spent 88% of its time on I/O. Two MPI ranks sharing one GPU hid that latency and cut the time to 5.54 s (6.1x over sequential). That is a fair comparison against the 1-node, 2-rank CPU run, which took 6.20 s with the same two cores doing I/O.
- **Measure before guessing.** `time` for end-to-end, `MPI_Wtime` or `chrono` for I/O, `nvprof` for occupancy and memory throughput, and Nsight Systems for API timelines pointed at the real bottleneck each round.

## Notes

This was a course final project for Parallel Programming (NTHU CS542200, Fall 2025), run on the course's Origo CPU cluster and GPU nodes. The source code is not published.
