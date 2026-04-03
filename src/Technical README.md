# Technical Documentation (Tech Lead)

This folder (`/src`) contains the complete Python source code for the **Bitcoin Bridge** backend logic.

## Logic & Architecture
Our backend is structured as a modern API using **FastAPI**. 
The main components are:
*   `index.py`: The entry point that mounts our web app and connects CORS to allow the frontend to consume data.
*   `routes/btc.py`: Defines the endpoints (e.g., `/api/btc/calculate`). It calculates theoretical BTC-to-USD impacts by doing simple math using current and historical inputs.
*   `services/coingecko.py`: Contains the asynchronous wrapper logic (using `httpx`) to ping CoinGecko for live/historical pricing.
*   `utils/cache.py`: A lightweight caching system to avoid being rate-limited by CoinGecko.

## Local Installation (Python)

To verify the code functional logic on a local machine:

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
   ```

2. Install dependencies (declared in root `requirements.txt` for Vercel compatibility):
   ```bash
   pip install -r ../requirements.txt
   ```

3. Run the application:
   ```bash
   uvicorn src.index:app --reload
   ```

The Swagger documentation will then be available natively at `http://localhost:8000/docs`, allowing technical evaluation of the endpoints without needing the frontend.
