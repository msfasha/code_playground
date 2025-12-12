"""
Main FastAPI application.

Sets up the FastAPI app with database connection, CORS, and routers.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import close_db, init_db
from routers import monitoring_router, network_management_router, scada_simulator_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    
    Initializes database on startup and closes connections on shutdown.
    """
    # Startup
    logger.info("Starting application...")
    try:
        await init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}", exc_info=True)
        raise

    yield

    # Shutdown
    logger.info("Shutting down application...")
    try:
        await close_db()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database: {e}", exc_info=True)


# Create FastAPI app
app = FastAPI(
    title="SCADA Simulator API",
    description="API for SCADA simulator and monitoring system",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative frontend port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(network_management_router.router)
app.include_router(scada_simulator_router.router)
app.include_router(monitoring_router.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "SCADA Simulator API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    """Simple health check endpoint."""
    return {"status": "ok"}

