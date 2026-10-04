# 🛡️ ScamShield

### AI-Powered Investment Scam Detection & Investor Safety Platform

ScamShield is an AI-powered investor-safety platform that helps users identify suspicious financial messages, screenshots, and URLs before they take unsafe actions.

Instead of providing investment advice, ScamShield focuses on **fraud awareness, risk explanation, and safe verification**.

---

## 🚨 Problem

Digital investment scams increasingly reach users through:

- WhatsApp and SMS messages
- Social media
- Suspicious investment links
- Fake financial institutions
- Guaranteed-return offers
- Urgent payment requests
- Requests for sensitive information

First-time investors and users with limited digital or financial literacy may find it difficult to recognize these warning signs.

---

## 💡 Solution

ScamShield allows users to:

1. Enter or paste a suspicious financial message
2. Upload a screenshot of a suspicious message
3. Enter a suspicious URL
4. Analyze the content for scam warning indicators
5. Understand why the content may be risky
6. Receive appropriate safety actions

The platform combines **rule-based detection with AI-powered analysis** to provide explainable investor-safety guidance.

---

## ✨ Key Features

### 💬 Message Analysis
Analyzes financial messages for indicators such as:

- Guaranteed or unrealistic returns
- Urgency and pressure
- Fake authority or impersonation
- Suspicious contact requests
- Payment requests
- Requests for sensitive information
- Secrecy or manipulation patterns

### 📸 Screenshot Analysis

Users can upload screenshots of suspicious messages.

ScamShield uses **OCR with Tesseract.js** to extract text from the screenshot and analyze it for scam indicators.

### 🔗 URL Analysis

Users can submit a suspicious URL.

ScamShield analyzes URL characteristics such as:

- Missing HTTPS
- Raw IP addresses
- Suspicious keywords
- Excessively long URLs
- Multiple subdomains

The destination website is **not opened** during URL analysis.

### 🤖 AI Analysis

Google Gemini AI provides:

- Risk indicators
- Simple explanations
- Evidence from the analyzed message
- English, Hindi and Hinglish understanding

### 🛡️ Risk-Based Safety Actions

ScamShield classifies messages as:

- 🟢 **Low Risk**
- 🟠 **Medium Risk**
- 🔴 **High Risk**

Safety guidance changes according to the detected risk level.

### 🇮🇳 Bharat-First Support

The system supports:

- English
- Hindi
- Hinglish

This helps make scam-awareness tools more accessible to users across India.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                 Message / Screenshot / URL
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │  Vite + Tailwind    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      REST API       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │ Rule-Based │   │ Gemini AI  │   │ URL        │
       │ Detection  │   │ Analysis   │   │ Analysis   │
       └────────────┘   └────────────┘   └────────────┘
              │                │
              └────────┬───────┘
                       ▼
              ┌──────────────────┐
              │ Risk + Explanation│
              │ + Safe Actions    │
              └──────────────────┘
