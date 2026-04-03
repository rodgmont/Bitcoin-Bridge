import httpx
from datetime import date
from src.utils.cache import cache

COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

async def get_current_btc_price() -> float:
    """Fetch the current Bitcoin price in USD."""
    cache_key = "current_btc_price"
    cached_price = cache.get(cache_key)
    if cached_price:
        return cached_price

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{COINGECKO_BASE_URL}/simple/price",
            params={"ids": "bitcoin", "vs_currencies": "usd"}
        )
        response.raise_for_status()
        data = response.json()
        price = data.get("bitcoin", {}).get("usd")
        if price:
            cache.set(cache_key, price)
            return price
        raise ValueError("Could not fetch current BTC price")

async def get_historical_btc_price(target_date: date) -> float:
    """Fetch the historical Bitcoin price in USD for a given date."""
    # CoinGecko expects dd-mm-yyyy format
    formatted_date = target_date.strftime("%d-%m-%Y")
    cache_key = f"btc_price_{formatted_date}"
    
    cached_price = cache.get(cache_key)
    if cached_price:
        return cached_price

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{COINGECKO_BASE_URL}/coins/bitcoin/history",
            params={"date": formatted_date}
        )
        response.raise_for_status()
        data = response.json()
        
        # Safe extraction of price
        market_data = data.get("market_data")
        if market_data:
            current_price = market_data.get("current_price")
            if current_price:
                price = current_price.get("usd")
                if price:
                    cache.set(cache_key, price)
                    return price
                    
        raise ValueError(f"Could not fetch historical BTC price for {formatted_date}")
