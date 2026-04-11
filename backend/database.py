import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# Render provides postgres:// but SQLAlchemy requires postgresql://
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {
    "connect_timeout": 5,
    "timeout": 5
}

# Intentar conexión a PostgreSQL, fallback a SQLite
try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args=connect_args,
        poolclass=NullPool if not SQLALCHEMY_DATABASE_URL.startswith("sqlite") else None,
        echo=False,
        pool_pre_ping=True
    )
    # Test connection
    with engine.connect() as conn:
        conn.execute("SELECT 1")
    print(f"✅ Connected to {SQLALCHEMY_DATABASE_URL[:30]}...")
except Exception as e:
    print(f"❌ PostgreSQL failed: {e}")
    print("⚠️  Falling back to SQLite")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
