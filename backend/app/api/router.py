from fastapi import APIRouter

from app.api.rag_router import router as rag_router
from app.api.auth_router import router as auth_router
from app.api.admin_rag_router import router as admin_rag_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(rag_router, prefix="/rag", tags=["Agentic RAG History Bot"])
api_router.include_router(admin_rag_router, prefix="/admin/rag", tags=["Admin RAG Knowledge Base"])
