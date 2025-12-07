from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import documents

app = FastAPI(
    title="DocMiner API",
    description="Document indexing and retrieval system",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])

@app.get("/")
async def root():
    return {"message": "DocMiner API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

