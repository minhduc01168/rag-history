from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from app.rag.agents.synthesis_agent import SynthesisAgent
from app.db.session import get_db
from app.models.chat import ChatSession, ChatMessage

router = APIRouter()

# Khởi tạo agent được chuyển sang app.state trong main.py

class QueryRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    query: str
    route_taken: str
    answer: str
    sources: List[str]
    quiz_data: Optional[dict] = None
    character_played: Optional[str] = None

@router.post("/chat", response_model=QueryResponse)
def chat_with_agent(request: QueryRequest, req: Request, db: Session = Depends(get_db)):
    """
    Endpoint chính để trò chuyện với Lumos History Bot.
    """
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
            
        synthesis_agent = req.app.state.synthesis_agent
        
        db_history = []
        if request.session_id:
            # Lấy hoặc tạo session
            chat_session = db.query(ChatSession).filter(ChatSession.id == request.session_id).first()
            if not chat_session:
                chat_session = ChatSession(id=request.session_id)
                db.add(chat_session)
                db.commit()
            else:
                # Lấy 10 tin nhắn gần nhất
                recent_msgs = db.query(ChatMessage).filter(ChatMessage.session_id == request.session_id).order_by(ChatMessage.created_at.desc()).limit(10).all()
                # Phải đảo ngược lại vì chúng ta lấy desc
                for msg in reversed(recent_msgs):
                    db_history.append({"role": msg.role, "content": msg.content})
                    
            # Lưu câu hỏi user vào db
            user_msg = ChatMessage(session_id=request.session_id, role="user", content=request.query)
            db.add(user_msg)
            db.commit()

        result = synthesis_agent.process_query(request.query, history=db_history)
        
        if request.session_id:
            # Lưu câu trả lời bot vào db
            bot_msg = ChatMessage(session_id=request.session_id, role="bot", content=result.get("answer", ""))
            db.add(bot_msg)
            db.commit()
        
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
