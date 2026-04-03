# Bitcoin Bridge 🌉

**Temporal Impact and Adoption Analytics for Local Commerce in El Salvador.**

## 📖 Overview

Bitcoin Bridge is a simple, lightweight analytics calculator developed for the **CUBO+ Build Sprint 2026**.
It helps local merchants understand volatility, pricing impact, and Bitcoin adoption patterns by comparing historical USD vs BTC pricing.

## ✨ Features

- **Price Comparison Calculator**: See the BTC equivalent for a USD amount over a specific timeframe.
- **Historical Analysis**: Uses CoinGecko data to fetch accurate historical prices.
- **Rich Dashboard UI**: Built with a sleek glassmorphism dark theme using HTML, Tailwind CSS, and Vanilla JS.
- **FastAPI Backend**: Super-fast async Python backend serving the frontend via clean REST endpoints.

## 🚀 Quick Start

Ensure you have Docker and Docker Compose installed.

```bash
docker-compose up --build
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📁 Project Structure

```
/bitcoin-bridge
├── backend/          # FastAPI Python Backend
├── frontend/         # Vanilla JS + HTML + Tailwind CSS Frontend
├── docs/             # Additional Documentation
├── docker-compose.yml
└── README.md
```

## 📋 Documentation

- [API Reference](./docs/API.md)
- [Setup & Dev Instructions](./docs/SETUP.md)
