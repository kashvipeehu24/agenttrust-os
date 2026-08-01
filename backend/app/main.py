from fastapi import FastAPI
from app.modules.underwriting.api.routes import router as underwriting_router

app = FastAPI(
    title="AgentTrust OS",
    version="1.0.0"
)

app.include_router(underwriting_router)

@app.get("/")
def home():
    return {
        "message": "AgentTrust OS Backend Running"
    }