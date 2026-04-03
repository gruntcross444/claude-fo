from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import engine, Base
from routers import auth as auth_router
from routers import contact as contact_router
from routers import payments as payments_router
from routers import leads as leads_router
from routers import email_cron as email_cron_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://claude-fo.vercel.app", "https://claudefo.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(contact_router.router)
app.include_router(payments_router.router)
app.include_router(leads_router.router)
app.include_router(email_cron_router.router)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}
