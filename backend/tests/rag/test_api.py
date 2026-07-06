from fastapi.testclient import TestClient
from app.api.rag_router import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)

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
