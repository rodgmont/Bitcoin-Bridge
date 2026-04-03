# API Documentation

The Bitcoin Bridge API is built using [FastAPI](https://fastapi.tiangolo.com/).
Base URL: `http://localhost:8000/api`

An interactive Swagger UI is available at `http://localhost:8000/docs`.

## 1. Get Current Bitcoin Price

* **Endpoint**: `/btc/current`
* **Method**: `GET`
* **Description**: Returns the most recent Bitcoin price in USD.

**Response**:
```json
{
  "price_usd": 65000.50,
  "date": "2026-04-02"
}
```

## 2. Get Historical Bitcoin Price

* **Endpoint**: `/btc/historical`
* **Method**: `GET`
* **Parameters**:
  * `target_date` (query string, required): Date in format `YYYY-MM-DD`
* **Description**: Returns the Bitcoin price in USD at the given historical date.

**Response**:
```json
{
  "price_usd": 15000.00,
  "date": "2023-01-01"
}
```

## 3. Calculate Pricing Impact

* **Endpoint**: `/btc/calculate`
* **Method**: `POST`
* **Description**: Calculates the difference if a merchant had held BTC instead of USD since a given date.

**Request Body**:
```json
{
  "usd_amount": 100,
  "date": "2023-01-01"
}
```

**Response**:
```json
{
  "btc_then": 0.006666,
  "btc_now": 433.33,
  "difference_percent": 333.33
}
```
