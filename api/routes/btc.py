from fastapi import APIRouter, HTTPException, Query
from datetime import date
from pydantic import ValidationError
import httpx

from api.models.schemas import CalculateRequest, CalculateResponse, PriceResponse
from api.services.coingecko import get_current_btc_price, get_historical_btc_price

router = APIRouter(prefix="/api/btc", tags=["Bitcoin Analytics"])

@router.get("/current", response_model=PriceResponse)
async def current_price():
    """Get the current Bitcoin price in USD."""
    try:
        price = await get_current_btc_price()
        return PriceResponse(price_usd=price, date=date.today())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/historical", response_model=PriceResponse)
async def historical_price(target_date: date = Query(..., description="Date in YYYY-MM-DD format")):
    """Get the historical Bitcoin price in USD for a specific date."""
    try:
        price = await get_historical_btc_price(target_date)
        return PriceResponse(price_usd=price, date=target_date)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Data not found for the given date")
        raise HTTPException(status_code=500, detail="External API error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate", response_model=CalculateResponse)
async def calculate_impact(request: CalculateRequest):
    """
    Calculate the impact of holding USD vs BTC since a historical date.
    
    Inputs:
    - usd_amount: The original value in USD
    - date: The date (YYYY-MM-DD) when the trade/pricing theoretically occurred
    
    Returns:
    - btc_then: How much BTC you could have bought then
    - btc_now: What that BTC is worth now in USD
    - difference_percent: The percentage change
    """
    try:
        historical_price = await get_historical_btc_price(request.date)
        current_price = await get_current_btc_price()
        
        # Calculate how much BTC was acquired initially
        btc_then = request.usd_amount / historical_price
        
        # Calculate current value of that BTC in USD
        # Wait, the output wants btc_then (amount. Maybe it's literal amount of BTC or the USD value?).
        # Output: "btc_then: number, btc_now: number"
        # It's usually better if btc_now means "value in USD now" or "it's the same amount of BTC".
        # Prompt says:
        # - btc_then: number (implied: Amount of BTC acquired at that date)
        # - btc_now: number (implied: Equivalent USD value today of that BTC)
        # Let's return BTC amount and USD value.
        usd_value_now = btc_then * current_price
        
        if request.usd_amount > 0:
            difference_percent = ((usd_value_now - request.usd_amount) / request.usd_amount) * 100
        else:
            difference_percent = 0.0
            
        return CalculateResponse(
            btc_then=btc_then,
            btc_now=usd_value_now,
            difference_percent=difference_percent
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
