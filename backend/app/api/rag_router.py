from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.rag.agents.synthesis_agent import SynthesisAgent

router = APIRouter()

# Khởi tạo agent dùng chung cho router, có thể chuyển llm_mock=False trong môi trường Production
synthesis_agent = SynthesisAgent(llm_mock=False)

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    query: str
    route_taken: str
    answer: str
    sources: List[str]
    quiz_data: Optional[dict] = None
    character_played: Optional[str] = None

@router.post("/chat", response_model=QueryResponse)
async def chat_with_agent(request: QueryRequest):
    """
    Endpoint chính để trò chuyện với Lumos History Bot.
    """
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
            
        result = synthesis_agent.process_query(request.query)
        
        return QueryResponse(
            query=result["query"],
            route_taken=result["route_taken"],
            answer=result["answer"],
            sources=result["sources"],
            quiz_data=result.get("quiz_data"),
            character_played=result.get("character_played")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
