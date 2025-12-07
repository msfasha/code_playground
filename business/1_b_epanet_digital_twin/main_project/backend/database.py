"""
Database connection and session management.

Uses SQLAlchemy with async support for PostgreSQL (TimescaleDB).
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from models import Base

# Database connection string
# Format: postgresql+asyncpg://user:password@host:port/database
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/rtdwms"

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    future=True,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    """
    Dependency function to get database session.
    
    Use this in FastAPI route dependencies to get a database session.
    The session is automatically closed after the request.
    
    Example:
        @app.get("/items")
        async def get_items(db: AsyncSession = Depends(get_db)):
            result = await db.execute(select(Item))
            return result.scalars().all()
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """
    Initialize database by creating all tables.
    
    This should be called once at application startup.
    Creates all tables defined in models.py if they don't exist.
    """
    async with engine.begin() as conn:
        def create_tables(sync_conn):
            Base.metadata.create_all(bind=sync_conn)
        await conn.run_sync(create_tables)

async def close_db():
    """
    Close database connections.
    
    This should be called at application shutdown.
    """
    await engine.dispose()

