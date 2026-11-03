# LicenseCheck — Professional & Business Verification API

A production-ready full-stack compliance application to verify and continuously monitor official licenses and registrations for professionals and businesses. Built for the **TinyFish Agentic App Bounty**.

## System Architecture

* **Frontend**: Next.js App Router, React, Tailwind CSS.
* **Backend**: Next.js Serverless API Route Handlers (Vercel-ready).
* **Database**: MongoDB Atlas.
* **Automation Engine**: TinyFish (Agent, Fetch, Monitor).

## Features & Supported Registries

* Verify Records securely with Ambiguity Handling (Multiple Matches vs. No Matches).
* Real-time monitoring of professional pages using TinyFish Webhooks.
* Comprehensive Verification History & Dashboard Alerting.
* **Registries Supported out-of-the-box**:
  * Nepal Medical Council
  * UK General Medical Council
  * New Zealand Companies Register

## Setup & Deployment Instructions

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Go to Database Access -> Create a user and password.
3. Go to Network Access -> Allow IP `0.0.0.0/0`.
4. Get your connection string and add it to `.env`.

### 2. Environment Variables
Copy `.env.example` to `.env` and fill it out: