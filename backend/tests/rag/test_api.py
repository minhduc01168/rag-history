from fastapi.testclient import TestClient
from app.api.rag_router import router
from fastapi import FastAPI
from app.db.session import get_db

app = FastAPI()
app.include_router(router)

class MockAgent:
    def process_query(self, query: str, history: list = None):
        if "chém giết dã man" in query.lower():
            return {
                "query": query,
                "route_taken": "guardrail_blocked",
                "answer": "Câu hỏi không phù hợp, Cụ Rùa xin từ chối.",
                "sources": []
            }
        return {
            "query": query,
            "route_taken": "knowledge",
            "answer": "Answer here",
            "sources": ["Source 1"]
        }

app.state.synthesis_agent = MockAgent()

def override_get_db():
    yield None

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_chat_endpoint_success():
    response = client.post("/chat", json={"query": "Chiến thắng Bạch Đằng năm 938 do ai chỉ huy?"})
    
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Chiến thắng Bạch Đằng năm 938 do ai chỉ huy?"
    assert data["route_taken"] in ["knowledge", "roleplay", "quiz"]
    assert len(data["answer"]) > 0

def test_chat_endpoint_empty_query():
    response = client.post("/chat", json={"query": ""})
    assert response.status_code == 400
    assert response.json()["detail"] == "Query cannot be empty"

def test_chat_endpoint_guardrail_blocked():
    response = client.post("/chat", json={"query": "chém giết dã man"})
    assert response.status_code == 200
    data = response.json()
    assert data["route_taken"] == "guardrail_blocked"
    assert "không phù hợp" in data["answer"] or "Cụ Rùa" in data["answer"]
