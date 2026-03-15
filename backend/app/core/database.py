import re
import ssl

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


def get_async_url(url: str) -> str:
    """Ensure DATABASE_URL uses asyncpg driver and strip unsupported params."""
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    url = re.sub(r"[&?]channel_binding=[^&]*", "", url)
    return url


db_url = get_async_url(settings.DATABASE_URL)

connect_args: dict = {}
if "sslmode=require" in settings.DATABASE_URL:
    connect_args["ssl"] = ssl.create_default_context()

engine = create_async_engine(
    db_url,
    echo=False,
    pool_size=5,
    max_overflow=5,
    connect_args=connect_args,
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
