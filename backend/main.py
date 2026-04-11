from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
from database import engine, Base
from routers import auth as auth_router
from routers import contact as contact_router
from routers import payments as payments_router
from routers import leads as leads_router
from routers import email_cron as email_cron_router
from routers import applications as applications_router
from routers import telegram_bot as telegram_bot_router
from routers import admin as admin_router

load_dotenv()

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://claude-fo.vercel.app", "https://claudefo.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(contact_router.router)
app.include_router(payments_router.router)
app.include_router(leads_router.router)
app.include_router(email_cron_router.router)
app.include_router(applications_router.router)
app.include_router(telegram_bot_router.router)
app.include_router(admin_router.router)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}
