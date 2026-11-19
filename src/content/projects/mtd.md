---
title: Android Mobile Threat Defense (MTD)
summary: An Android mobile threat defense prototype that monitors device traffic to flag malicious domains, risky TLS connections and risky networks, and turns those signals into a real-time device risk score.
category: android-security
tags: [Kotlin, Jetpack Compose, C++, JNI, Python, mitmproxy, FastAPI, VpnService, DPM]
start: 2025-09
end: 2026-01
role: University research lab · overall architecture lead
repo: leemikepop/MTD
visibility: private
featured: true
order: 2
---

## Overview

MTD is a research prototype made of an Android app and supporting backend services. The app routes device traffic through a local `VpnService` with native packet handling, inspects it, and combines what it sees into a risk picture of the device and its network. The backend provides reputation lookups for the app.

## What it covers

- **Malicious domains** — blocks DNS lookups for known-bad domains.
- **TLS inspection** — evaluates the certificates of the servers apps connect to and can block suspicious connections.
- **Network risk** — rates the risk of the current Wi-Fi and egress network.
- **Risk scoring** — aggregates these signals into a real-time risk view.
- **Enterprise control** — managed-device policies keep protection from being bypassed.

## My role

I led the overall architecture: a layered design that keeps UI, control logic and platform integration apart, with native code isolated behind a narrow bridge so Kotlin decides policy and native code only moves packets.

## Public follow-up

The MTD code is private. [TrustProbe](/projects/trustprobe/) is an open-source follow-up written from scratch with the same platform skills — a per-app `VpnService`, a native tunnel behind JNI, TLS on both sides of the handshake — aimed at a different question: does an app validate certificates at all?
