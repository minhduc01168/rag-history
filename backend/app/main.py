from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.router import api_router

settings = get_settings()

from contextlib import asynccontextmanager
from concurrent.futures import ThreadPoolExecutor
from app.db.session import engine, Base, SessionLocal
from app.models.user import UserRole
from app.crud.crud_user import get_user_by_email, create_user
from app.schemas.user import UserCreate
from app.rag.retrieval.reranker import Reranker

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── 0. Warm-up Reranker (background thread, không block event loop) ──
    reranker = Reranker()
    executor = ThreadPoolExecutor(max_workers=1)
    loop = __import__('asyncio').get_event_loop()
    loop.run_in_executor(executor, reranker.preload)
    # Lưu vào app.state để các router có thể dùng nếu cần
    app.state.reranker = reranker
    print("[Startup] Reranker warm-up đã được khởi động (background thread).")

    # ── 1. Initialize DB tables ──
    Base.metadata.create_all(bind=engine)
    
    # Seed Admin User
    db = SessionLocal()
    try:
        admin_email = "admin@daivietkids.edu.vn"
        admin_user = get_user_by_email(db, email=admin_email)
        if not admin_user:
            print("Seeding default admin user...")
            admin_in = UserCreate(
                email=admin_email,
                password="admin", # Default password, will be hashed
                full_name="Quản Trị Viên Đại Việt Kids",
                phone="0900000000",
                location="Hà Nội"
            )
            create_user(db, user=admin_in, role=UserRole.ADMIN)
            print("Admin user created successfully.")
    finally:
        db.close()
    
    yield
    # Cleanup on shutdown if needed

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
