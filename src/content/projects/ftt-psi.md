---
title: Predicting Fabric Hand Feel from Images (FTT / PSI)
summary: Capstone project with ITRI — predicting textile sensory indices from fabric images with CNNs and Vision Transformers, comparing seven architectures. Won First Place and the Industry Potential Award.
category: ai
tags: [Python, PyTorch, ResNet, ViT, MAE, Swin Transformer, Streamlit]
start: 2023-03
end: 2023-12
role: Team lead
repo: leemikepop/FTT_PSI
visibility: private
links:
  - label: Streamlit demo
    url: https://fttpsi-demo.streamlit.app/
---

## Background

The tactile properties of fabrics (Primary Sensory Indices, PSI) are normally measured with a dedicated instrument, the Fabric Touch Tester (FTT). This project asks: can we regress those values from fabric images alone?

## Approach

- Compared seven architectures: MSNet, ResNet50, FFC-ResNet50, and self-supervised pre-training with Masked Autoencoder + ViT and SimMIM + Swin Transformer.
- Compared two routes: predicting PSI directly, or predicting FTT measurements first and converting them to PSI with a formula. Direct PSI prediction worked better, since the FTT data distribution is more complex.
- Published the curated fabric image and measurement dataset and deployed an online demo with Streamlit.

## Outcome

- **First Place** (Intelligent Systems track) and **Industry Potential Award** at the capstone project competition (2023).
