from pydantic import BaseModel, ConfigDict
from datetime import date

class CalculateRequest(BaseModel):
    usd_amount: float
    date: date
    
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "usd_amount": 1000.0,
            "date": "2023-01-01"
        }
    })

class CalculateResponse(BaseModel):
    btc_then: float
    btc_now: float
    difference_percent: float

class PriceResponse(BaseModel):
    price_usd: float
    date: date
