---
title: Android Mobile Threat Defense (MTD)
summary: An enterprise Android mobile threat defense prototype that captures traffic via VpnService to block malicious domains, inspect TLS certificates, assess exit-network risk and score device risk in real time.
category: android-security
tags: [Kotlin, Jetpack Compose, C++, JNI, Python, mitmproxy, FastAPI, VpnService, DPM]
start: 2025-09
end: 2026-01
role: NTHU InfoSec Lab · overall architecture lead
repo: leemikepop/MTD
visibility: private
featured: true
order: 2
---

<!-- TODO: architecture diagram, blocking results or test data, demo screenshots -->

## Overview

MTD consists of an Android app and a set of backend services. The app uses Jetpack Compose for the UI and captures device-wide traffic through `VpnService` with a JNI native packet-capture loop. It embeds a Chaquopy Python runtime to run mitmproxy for TLS inspection. The backend (FastAPI behind nginx) serves domain and IP reputation lookups.

## Features

- **DNS protection** — UDP/53 takes a native fast path; decisions go allowlist → local Bloom filter → backend confirmation, and only confirmed-malicious domains are blocked.
- **TLS / SSL inspection** — checks certificate chain, hostname and revocation status, and can actively block suspicious connections.
- **Exit-point analysis** — the backend combines GeoLite2, FireHOL anonymous and IPsum lists to rate the risk of the current egress IP.
- **Adaptive risk scoring** — aggregates Wi-Fi, egress, DNS and TLS signals into the real-time risk snapshot shown on the home screen.
- **Enterprise control** — Device Policy Management enforces Always-on VPN lockdown so traffic cannot bypass protection.

## Architecture principles

The code is split into three layers: `feature` (UI), `core` (control plane and shared domain) and `infra` (platform integration and execution). Native code always sits behind a `NativeBridge`: Kotlin decides policy, native code only handles packets and forwarding.
