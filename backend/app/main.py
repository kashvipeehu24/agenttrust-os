from fastapi import FastAPI
from app.modules.underwriting.api.routes import router as underwriting_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AgentTrust OS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(underwriting_router)

@app.get("/")
def home():
    return {
        "message": "AgentTrust OS Backend Running"
    }