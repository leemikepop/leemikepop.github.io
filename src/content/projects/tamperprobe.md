---
title: TamperProbe
summary: An Android root and runtime-tampering detection engine. One native detector engine ships two ways — as an SDK for apps you control, and as a RASP bundle injected into APKs without source.
category: android-security
tags: [Kotlin, C++, JNI, Android NDK, RASP, Docker, React]
start: 2025-11
ongoing: true
role: Master's research project · architecture and lead developer
repo: leemikepop/TamperProbe
visibility: private
featured: true
order: 1
---

<!-- TODO: motivation (which root-hiding techniques defeat existing checks), number of detectors, test devices and evaluation results -->

## The problem

FinTech and security-sensitive apps need to know whether they are running in a rooted or instrumented environment, but modern root solutions (KernelSU, Magisk plus hiding modules) make classic file-path checks nearly useless. TamperProbe collects evidence from lower layers and keeps a strict line between *what was observed* and *whether to block*.

## Architecture

The same native detector engine is delivered through two deployment boundaries:

| Mode | When to use | How it works |
| --- | --- | --- |
| Public SDK | The app team can change the source | Create a client with a package-bound license and call `scan()` explicitly |
| Standalone RASP | Only the APK is available | A backend service injects, repackages and re-signs the APK; at runtime it blocks based on configured thresholds |

Key points of the scan pipeline:

- **License verification** — every scan first checks the ECDSA signature, applicationId and expiry date.
- **Native engine** — detectors run against an immutable `DetectionContext` and return a wire envelope to the Kotlin layer.
- **Strict data contract** — the Kotlin core validates the wire schema, catalog version and every outcome/strength combination before producing the public `TamperProbeReport`.
- **Evidence separate from policy** — the SDK only reports observed evidence and its strength; scoring and blocking are decided by the app's own policy.

## Tooling around it

- **Sample app** — shows results from every stable and experimental detector and exports JSON reports for experiments.
- **RASP injection service** — an APK injection backend, worker and React/Vite portal, deployed together with Docker Compose.
