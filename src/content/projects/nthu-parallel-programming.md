---
title: Parallel Programming (NTHU CS542200) Course Overview
summary: One semester of hands-on parallel programming, from MPI and OpenMP to CUDA kernels, FlashAttention and the UCX communication stack, all measured and profiled on a real cluster.
category: coursework
tags: [MPI, OpenMP, Pthreads, CUDA, HIP, OpenACC, UCX, Nsight, SIMD]
start: 2025-09
end: 2025-12
role: Student
featured: true
order: 3
---

## Overview

Fall 2025 course at National Tsing Hua University. Every assignment was graded on correctness and measured speed on the course cluster (Apollo Origo: 2 × 6-core Xeon X5670 per node, 40 Gb/s InfiniBand, BeeGFS) and on its GPU nodes, so each one was an exercise in measuring first and then optimising. The course ended with a team project, [Parallel Entropy Anomaly Detection](/projects/anomaly-detection-hpc/).

## Assignments

| # | Topic | What I built | Main lesson |
| --- | --- | --- | --- |
| HW1 | Odd-even sort, MPI | Distributed sort with parallel file I/O, local sort by `spreadsort`, and a two-step exchange that swaps only boundary elements first | Skip communication that is not needed before optimising the communication that is |
| HW2 | Mandelbrot set, Pthreads and MPI hybrid | Row-based thread pool, SSE2 vectorisation that computes two pixels at once, lane refill, and several MPI row-distribution strategies | Removing redundant data transfer mattered more than balancing load; vectorisation only pays off with lane refill on irregular work |
| HW3 | All-pairs shortest path | Blocked Floyd-Warshall on CPU threads, one GPU and multiple GPUs (CUDA, plus HIP for AMD) | Blocking factor and memory access pattern decide GPU speed |
| HW4 | FlashAttention forward pass | CUDA kernel with tiled Q, K, V in shared memory, online softmax, fixed 256 threads per block, profiled with `nvprof` | Tiling to shared memory and bank-conflict control, checked with profiler metrics |
| HW5 | UCX | Modified and rebuilt UCX to print the configured and actually used transports | How MPI actually picks a transport underneath |
| Final | Entropy anomaly detection | Sequential, MPI, MPI-IO, CUDA and CUDA + MPI-IO versions | I/O was the bottleneck, not compute; see the [project page](/projects/anomaly-detection-hpc/) |

## HW2 in numbers

The best hybrid version used static interleaved rows, `MPI_Gatherv` and SIMD. On 4 nodes × 12 processes (48 cores) it took 6.16 s. From 1 node (13.17 s) to 2 nodes (8.05 s) scaled at 82% efficiency, but 4 nodes reached only 53.5%, and per-process CPU use was far below the ideal, so the processes spent much of their time waiting on MPI and synchronisation. Dynamic load balancing cost more than it saved on fine-grained tasks.

## Labs

- **Lab 1: MPI.** Platform tour and first MPI programs.
- **Lab 2: Pthreads and OpenMP.** Approximate pixels, then thread and hybrid versions.
- **Lab 3: OpenACC and CUDA.** MNIST with OpenACC and a Sobel filter in CUDA.
- **Lab 4: CUDA advanced.** Optimising the Sobel kernel.
- **Lab 6: FlashAttention benchmarking.** Sweeps over batch size, sequence length and embedding size against PyTorch.
- **Lab 7: UCX.** Reading the UCX code base to learn how its layers fit together.

## Topics covered

1. Parallel decomposition, speedup, efficiency and Amdahl's law
2. Message passing with MPI: point-to-point, collectives, MPI-IO
3. Shared memory with Pthreads and OpenMP, SIMD
4. GPU architecture, CUDA programming model and optimisation (shared memory, occupancy, coalescing, bank conflicts)
5. Profiling with `time`, `nvprof`, Nsight Systems and Nsight Compute
6. Communication frameworks: UCX
7. Distributed computing for deep learning

## Scoreboard rankings

Ranks on the course scoreboard (by total time plus penalty, ~95–120 entries per board). "Passed" is test cases passed.

| Board | Rank | Passed |
| --- | --- | --- |
| HW3-1 (CPU threads) | 21 | 21 / 21 |
| HW3-2 (single GPU, NVIDIA) | 31 | 42 / 51 |
| HW3-2 (single GPU, AMD) | 12 | 32 / 51 |
| HW3-3 (multi-GPU) | 40 | 7 / 7 |
| HW4 (FlashAttention, NVIDIA) | 21 | 30 / 30 |
| HW4 (FlashAttention, AMD) | 23 | 30 / 30 |
| Lab 3 MNIST (OpenACC) | 7 | 2 / 2 |
| Lab 4 Sobel (CUDA, optimised) | 16 | 3 / 3 |
| HW5 (UCX) | n/a | 2 / 2 (all passing entries tie) |
