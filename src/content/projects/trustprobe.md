---
title: TrustProbe
summary: An Android app that tests, on the phone itself, whether another app really validates TLS certificates — no root, no installed CA, no external server.
category: android-security
tags: [Kotlin, Jetpack Compose, VpnService, TLS, JNI, Room, GitHub Actions]
start: 2026-11
end: 2026-11
role: Solo project · design, implementation and testing
repo: leemikepop/TrustProbe
visibility: public
featured: true
order: 2.5
---

A public follow-up to my [MTD](/projects/mtd/) work: MTD checks whether the *servers* a phone talks to can be trusted; TrustProbe flips it around and checks whether an *app* checks its servers at all. It is open source, so the code behind every claim on this page can be read.

<img src="/projects/trustprobe/demo.gif" alt="Demo: start a test on the testbed app, run it, read the report" width="360" />

*Recorded on an emulator against the in-repo testbed app: start a session, run its four HTTPS clients, stop, read the per-host verdicts with masked evidence.*

## The problem

Apps that validate TLS certificates wrongly — a `TrustManager` that accepts everything, a `HostnameVerifier` that always returns true (CWE-295) — let anyone on the same Wi-Fi read credentials and tokens. The Okara study ([arXiv 2601.22770](https://arxiv.org/abs/2601.22770)) analysed 37,349 Android apps and found 22.42% vulnerable to TLS man-in-the-middle attacks, about 41% of the vulnerabilities coming from third-party libraries. Earlier tools each needed something extra: root and instrumentation, a router you control, or an external server.

TrustProbe is one APK: pick an app on your own phone, start a time-boxed session, use the app for a few minutes, and get one verdict per host name with evidence.

## How it works

```text
app under test ──► per-app VpnService tun ──► hev-socks5-tunnel (native, JNI)
                                                     │ SOCKS5 + per-session credentials
                                                     ▼
                                  local SOCKS5 server (Kotlin, 127.0.0.1)
                                                     │
                     ┌───────────────────────────────┼──────────────────────────┐
              TLS, first time per host      host already tested            UDP 443 (QUIC)
                     ▼                                ▼                          ▼
     TlsProbe: present a bad certificate      forward untouched           drop → app falls
     (server-side SSLEngine), observe         to the real server          back to TCP
```

Two observations keep it small:

1. **Deciding "did it accept?" needs no decrypting proxy.** TrustProbe is the TLS server and presents a deliberately bad certificate. If the client completes the handshake *and sends data*, it accepted; an alert or a close means it rejected. The first request an accepting client sends is the (masked) evidence.
2. **No guessing which app a packet belongs to.** `addAllowedApplication()` routes only the app under test into the tunnel, so attribution is by construction.

## Design decisions

- **No mitmproxy, no Python.** Only the server side of one handshake is needed, so the decrypting proxy and its interpreter are gone; the native code is about 350 KB per ABI.
- **Adaptive, T2-first schedule.** Many correct apps give up after one refusal, so per host it first presents a certificate from an untrusted CA (closest to a real attacker). If rejected it tries a self-signed one on the next retry; if accepted it tries a wrong-host one to gauge severity. Then the host is forwarded so the app recovers.
- **Verdicts are a pure function of an event log.** The engine only appends events; live screen, saved report, history and exports are all recomputed from the same log, so they cannot disagree — and the verdict logic is tested without a network.
- **Masking by default, hardened local proxy.** Header and query values keep only 4 characters; unmasked content never leaves memory. The local SOCKS5 port requires per-session random credentials, because on Android every app shares 127.0.0.1.

## Engineering process

Built from a written design and a 15-task plan, each task implemented test-first and then independently reviewed. Reviews caught real false-negative bugs before release — for example, an HTTP/2-only client that got no ALPN protocol closed the connection itself and looked like a correct rejection, and tearing down the tunnel before the engine turned an in-flight probe into a fake rejection. Both are fixed and pinned by tests.

- `:core` is pure Kotlin/JVM (SOCKS5, ClientHello parser, certificate factory, TLS probe, scheduler, verdicts), about 130 unit tests that run without a device.
- A deliberately broken **testbed app** (correct client, trust-all, hostname-verifier-always-true, pinned) is the ground truth.
- **CI** builds and tests every push, and runs an end-to-end test on an Android emulator: a real session against the testbed must produce the four expected verdicts.

## Results

| | Emulator (API 37) | Pixel 7 (Android 17) |
|---|---|---|
| Testbed verdicts correct | 4/4 | 4/4 in 3 of 3 sessions |
| Testbed launch → all four hosts tested (median of 3) | 3.8 s | 3.1 s |
| Single probe, median | 9 ms | 15 ms |
| Forward-mode cost per fresh connection + request | not measurable (within emulator noise) | ≈ +85 ms |

Small samples; how each number was taken is in the repo's [measurements notes](https://github.com/leemikepop/TrustProbe/blob/main/docs/measurements.md).

## Limitations

Only TCP 443 is probed and QUIC is dropped; connections without SNI are inconclusive; a *trusted* certificate for the wrong host name (the hostname-only bug) needs a planned fourth test case. Ground truth today is the testbed, not real-world apps.
