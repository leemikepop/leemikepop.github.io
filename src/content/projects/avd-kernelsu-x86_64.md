---
title: KernelSU LKM for Android Studio AVDs
summary: Root stock Android Studio emulator images with KernelSU / KernelSU-Next in LKM mode by patching only the ramdisk — the kernel is never replaced. Supports Android 13 through 17.
category: systems
tags: [Python, Linux Kernel, GKI, KernelSU, GitHub Actions]
start: 2026-07
ongoing: true
repo: leemikepop/avd-kernelsu-x86_64
featured: true
order: 3
---

## Why

Root-detection research needs a test environment that is both truly rooted and quick to reset. x86_64 GKI kernels have no KMI stability guarantee, and the LKMs attached to upstream releases are built from the latest DDK source. On some AVD kernels they fail to load (Android 14) or trip kCFI and panic (Android 15).

## How

- For each AVD kernel, find the **exact** `kernel/common` revision named in its Android CI build manifest.
- Read the kernel's own config from `kernel-ranchu` (`CONFIG_IKCONFIG=y`) and build `kernelsu.ko` with the matching DDK clang.
- Patch only the system image's `ramdisk.img` so the module loads at boot; the stock kernel stays untouched.
- Build modules for every supported version automatically with GitHub Actions.

## Supported versions

Android 13 (API 33) through Android 17 (API 37, including 16 KB page-size images). The older approach that rebuilds the whole GKI kernel lives on the `legacy-gki-build` branch.
