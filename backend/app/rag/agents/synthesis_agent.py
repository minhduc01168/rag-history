from typing import Dict, Any, List
from app.rag.agents.router import RouterAgent
from app.rag.agents.knowledge_agent import KnowledgeAgent
from app.rag.agents.llm_generator import LLMGenerator
from app.rag.agents.roleplay_agent import RoleplayAgent
from app.rag.agents.quiz_agent import QuizAgent
from app.rag.guardrails import ChildSafetyGuardrail

class SynthesisAgent:
    """
    Master Orchestrator cho Lumos History Bot:
    1. Kiểm tra an toàn đầu vào (Guardrails)
    2. Định tuyến ý định (RouterAgent -> knowledge | roleplay | quiz)
    3. Điều phối Agent chuyên trách xử lý
    4. Tổng hợp câu trả lời theo persona Cụ Rùa Thông Thái và làm sạch đầu ra
    """
    def __init__(self, knowledge_agent: KnowledgeAgent = None, llm_mock: bool = False):
        self.router = RouterAgent()
        self.knowledge_agent = knowledge_agent or KnowledgeAgent()
        self.llm = LLMGenerator(mock=llm_mock)
        self.roleplay_agent = RoleplayAgent(knowledge_agent=self.knowledge_agent, llm_generator=self.llm)
        self.quiz_agent = QuizAgent(knowledge_agent=self.knowledge_agent, llm_generator=self.llm)

    def process_query(self, query: str) -> Dict[str, Any]:
        """
        Xử lý truy vấn lịch sử end-to-end cho học sinh tiểu học.
        """
        # 1. Kiểm tra an toàn đầu vào (Guardrails)
        is_safe, fallback_msg = ChildSafetyGuardrail.check_input(query)
        if not is_safe:
            return {
                "query": query,
                "route_taken": "guardrail_blocked",
                "answer": fallback_msg,
                "sources": [],
                "quiz_data": None,
                "character_played": "Cụ Rùa Thông Thái"
            }

        # 2. Routing
        routing_info = self.router.route_query(query)
        route = routing_info.get("route", "knowledge")
        character = routing_info.get("character")

        quiz_data = None
        character_played = "Cụ Rùa Thông Thái"

        # 3. Xử lý theo từng luồng
        if route == "roleplay":
            res = self.roleplay_agent.process(query, target_character=character)
            answer = res["answer"]
            sources = res["sources"]
            character_played = res["character_played"]

        elif route == "quiz":
            res = self.quiz_agent.generate_quiz(query)
            answer = res["answer"]
            sources = res["sources"]
            quiz_data = res["quiz_data"]

        else:  # "knowledge"
            res = self.knowledge_agent.answer_query(query)
            context = res.get("answer", "")
            sources = res.get("sources", [])

            # Synthesize với persona Cụ Rùa Thông Thái
            storyteller_prompt = (
                f"Bạn là **Cụ Rùa Thông Thái**, một vị thần hiền từ, điềm đạm và am hiểu sâu sắc nghìn năm lịch sử Việt Nam.\n"
                f"Nhiệm vụ của bạn là trả lời câu hỏi của một học sinh Tiểu học (Lớp 4 hoặc Lớp 5) dựa trên kiến thức Sách giáo khoa dưới đây.\n\n"
                f"**Kiến thức SGK Lịch sử:**\n{context}\n\n"
                f"**Câu hỏi của cháu:** \"{query}\"\n\n"
                f"**QUY TẮC TRẢ LỜI NGHIÊM NGẶT:**\n"
                f"1. Xưng là 'Cụ Rùa' và gọi bé là 'cháu' hoặc 'nhà sử học nhí'.\n"
                f"2. Giọng điệu ấm áp, sinh động, tự hào dân tộc, như đang kể một câu chuyện truyền cảm hứng.\n"
                f"3. Giới hạn độ dài: Ngắn gọn, dưới 180 từ, chia làm 2-3 đoạn ngắn.\n"
                f"4. Bám sát dữ liệu SGK được cung cấp, không bịa đặt sử sách.\n"
                f"5. LUÔN kết thúc câu trả lời bằng 1 câu hỏi gợi mở trí tò mò để khuyến khích bé khám phá tiếp."
            )
            try:
                answer = self.llm._call_gemini(storyteller_prompt)
            except Exception as e:
                print(f"[SynthesisAgent] LLM Error: {e}")
                answer = f"🐢 **Cụ Rùa Thông Thái:** Khà khà, câu hỏi \"{query}\" của cháu rất hay! Theo sách sử, {context[:200]}... Cháu muốn tìm hiểu thêm về nhân vật nào nữa không?"

        # 4. Kiểm tra an toàn đầu ra (Guardrails)
        safe_answer = ChildSafetyGuardrail.sanitize_output(answer)

        return {
            "query": query,
            "route_taken": route,
            "answer": safe_answer,
            "sources": sources,
            "quiz_data": quiz_data,
            "character_played": character_played
        }
