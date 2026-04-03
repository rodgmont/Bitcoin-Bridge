from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import btc

app = FastAPI(
    title="Bitcoin Bridge API",
    description="Temporal Impact and Adoption Analytics for Local Commerce in El Salvador",
    version="1.0.0"
)

# Configure CORS so the frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, this should be restricted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(btc.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bitcoin Bridge API. Visit /docs for the API documentation."}
