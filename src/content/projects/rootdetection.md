---
title: Device Integrity Core
summary: A reusable Android device-integrity library combining root detection, the Play Integrity API and hardware-backed Key Attestation, with a demo app and verification backend.
category: android-security
tags: [Kotlin, Java, Jetpack Compose, Play Integrity, Key Attestation]
start: 2025-08
end: 2025-10
repo: leemikepop/rootdetection
visibility: private
---

<!-- TODO: explain how this relates to TamperProbe (predecessor? baseline?) -->

## What's inside

- **Core library `device-integrity-core`**
  - Root detection built on and extending RootBeer.
  - Integration with Google's Play Integrity API.
  - Android Key Attestation for TEE-backed hardware key proofs.
  - A session and token mechanism built on the three checks.
  - A unified high-level API that works well from both Kotlin and Java (`@JvmXXX` interop).
- **Demo app** — Kotlin + Jetpack Compose (Material 3) showing all three checks, verified against the backend in real time.
- **Backend** — issues nonces and verifies results server-side.
