from app.rag.agents.router import RouterAgent
from app.rag.agents.synthesis_agent import SynthesisAgent
from app.rag.guardrails import ChildSafetyGuardrail

def test_guardrails():
    is_safe, msg = ChildSafetyGuardrail.check_input("Ai là người chiến thắng Bạch Đằng?")
    assert is_safe is True
    
    is_safe_bad, msg_bad = ChildSafetyGuardrail.check_input("làm sao để giết người")
    assert is_safe_bad is False
    assert "Cụ Rùa" in msg_bad or "không phù hợp" in msg_bad

def test_router_agent():
    router = RouterAgent()
    
    res_quiz = router.route_query("cho cháu câu hỏi đố vui trắc nghiệm")
    assert res_quiz["route"] == "quiz"
    
    res_roleplay = router.route_query("Cụ rùa ơi hãy trò chuyện với cháu")
    assert res_roleplay["route"] == "roleplay"
    
    res_knowledge = router.route_query("Chiến thắng Bạch Đằng diễn ra năm nào?")
    assert res_knowledge["route"] == "knowledge"

def test_synthesis_agent_routing():
    agent = SynthesisAgent(llm_mock=True)
    
    res_quiz = agent.process_query("đố vui lịch sử")
    assert res_quiz["route_taken"] == "quiz"
    assert res_quiz["quiz_data"] is not None
    
    res_guardrail = agent.process_query("khủng bố và bạo lực")
    assert res_guardrail["route_taken"] == "guardrail_blocked"
    assert "Cụ Rùa" in res_guardrail["answer"]
