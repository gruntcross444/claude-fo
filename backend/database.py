import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

PRIMARY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# Render provides postgres:// but SQLAlchemy requires postgresql://
if PRIMARY_DATABASE_URL.startswith("postgres://"):
    PRIMARY_DATABASE_URL = PRIMARY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

FALLBACK_DATABASE_URL = "sqlite:///./app.db"

# Crear engine con fallback en runtime
current_db_url = PRIMARY_DATABASE_URL

def _create_engine(url: str):
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {
        "connect_timeout": 5,
        "timeout": 5
    }
    return create_engine(
        url,
        connect_args=connect_args,
        poolclass=NullPool if not url.startswith("sqlite") else None,
        echo=False,
        pool_pre_ping=True
    )

engine = _create_engine(PRIMARY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Test connection on first request
_db_tested = False

def ensure_db_connection():
    global engine, current_db_url, _db_tested
    if _db_tested:
        return
    
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        _db_tested = True
        print(f"✅ DB connected: {current_db_url[:40]}...")
    except Exception as e:
        print(f"❌ Primary DB failed: {e}")
        print("⚠️  Switching to SQLite fallback")
        current_db_url = FALLBACK_DATABASE_URL
        engine = _create_engine(FALLBACK_DATABASE_URL)
        SessionLocal.configure(bind=engine)
        _db_tested = True
