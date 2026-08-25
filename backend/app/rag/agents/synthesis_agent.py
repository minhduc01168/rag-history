from typing import Dict, Any, List
from app.rag.agents.router import RouterAgent
from app.rag.agents.knowledge_agent import KnowledgeAgent
from app.rag.agents.llm_generator import LLMGenerator
from app.rag.agents.roleplay_agent import RoleplayAgent
from app.rag.agents.quiz_agent import QuizAgent
from app.rag.guardrails import ChildSafetyGuardrail


class SynthesisAgent:
    """
    Master Orchestrator cho Đại Việt Kids AI:
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

    def process_query(self, query: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
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
            res = self.roleplay_agent.process(query, target_character=character, history=history)
            answer = res["answer"]
            sources = res["sources"]
            character_played = res["character_played"]

        elif route == "quiz":
            res = self.quiz_agent.generate_quiz(query, history=history)
            answer = res["answer"]
            sources = res["sources"]
            quiz_data = res["quiz_data"]

        else:  # "knowledge"
            res = self.knowledge_agent.answer_query(query)
            context = res.get("answer", "")
            sources = res.get("sources", [])

            # Kiểm tra context có đủ nội dung để trả lời không
            if not context or len(context.strip()) < 30:
                answer = (
                    "🐢 **Cụ Rùa Thông Thái:** Khà khà, cháu ơi! Câu hỏi này rất thú vị, "
                    "nhưng Cụ Rùa chưa tìm thấy thông tin trong sách giáo khoa Lịch sử Lớp 4 & 5 của chúng ta. "
                    "Cháu thử hỏi về các bài học như Vua Hùng, Hai Bà Trưng, "
                    "Ngô Quyền hay Chiến thắng Điện Biên Phủ xem sao nhé! 📚"
                )
            else:
                history_str = ""
                if history:
                    history_str = "**Lịch sử trò chuyện gần đây:**\n"
                    for h in history:
                        r = "Học sinh" if h.get("role") == "user" else "Cụ Rùa"
                        history_str += f"- {r}: {h.get('content')}\n"
                    history_str += "\n"

                # Synthesize với persona Cụ Rùa Thông Thái
                storyteller_prompt = (
                    f"Bạn là **Cụ Rùa Thông Thái**, một vị thần hiền từ, điềm đạm và am hiểu sâu sắc "
                    f"nghìn năm Lịch sử Việt Nam.\n"
                    f"Nhiệm vụ: Trả lời câu hỏi của học sinh Tiểu học (Lớp 4 hoặc Lớp 5) "
                    f"dựa HOÀN TOÀN vào kiến thức SGK Lịch sử dưới đây.\n\n"
                    f"{history_str}"
                    f"**Kiến thức SGK Lịch sử Lớp 4 & 5 liên quan:**\n{context}\n\n"
                    f"**Câu hỏi của học sinh:** \"{query}\"\n\n"
                    f"**QUY TẮC TRẢ LỜI BẮT BUỘC:**\n"
                    f"1. Xưng là 'Cụ Rùa' và gọi học sinh là 'cháu' hoặc 'nhà sử học nhí'.\n"
                    f"2. Trả lời ĐI THẲNG vào câu hỏi — không mở đầu bằng lời khen ngợi câu hỏi quá dài.\n"
                    f"3. Giọng điệu: Ấm áp, sinh động, tự hào dân tộc, như đang kể một câu chuyện cho trẻ em.\n"
                    f"4. Độ dài: Ngắn gọn, dưới 150 từ, chia làm 2-3 đoạn ngắn.\n"
                    f"5. Bám sát CHÍNH XÁC nội dung SGK được cung cấp ở trên. Không bịa đặt.\n"
                    f"6. Nếu câu hỏi về Địa lý hoặc môn khác: Giải thích nhẹ nhàng rằng Cụ Rùa chuyên "
                    f"về Lịch sử Lớp 4-5 và mời bé hỏi về các sự kiện, nhân vật lịch sử.\n"
                    f"7. Kết thúc bằng đúng 1 câu hỏi gợi mở khuyến khích bé suy nghĩ thêm về bài học lịch sử.\n\n"
                    f"**Câu trả lời của Cụ Rùa:**"
                )
                try:
                    answer = self.llm._call_gemini(storyteller_prompt)
                except Exception as e:
                    print(f"[SynthesisAgent] LLM Error: {e}")
                    # Fallback thông minh: làm sạch ký hiệu markdown (#, *, -) và lấy đoạn văn có nghĩa
                    import re
                    clean_ctx = re.sub(r'[#*\-_`]', '', context)
                    clean_ctx = ' '.join(clean_ctx.split())
                    context_short = " ".join(clean_ctx.split()[:50]).strip()
                    answer = (
                        f"Chào cháu nhà sử học nhí! Theo sách giáo khoa Lịch sử: {context_short}... "
                        f"Cháu muốn Cụ Rùa kể tiếp câu chuyện này không?"
                    )

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
