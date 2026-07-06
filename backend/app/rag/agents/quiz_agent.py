import json
import re
from typing import Dict, Any, List
from app.rag.agents.llm_generator import LLMGenerator
from app.rag.agents.knowledge_agent import KnowledgeAgent

class QuizAgent:
    """
    Agent chuyên trách chế độ Đố vui (Quiz):
    Dựa trên ngữ cảnh lịch sử SGK Lớp 4 & 5 để tạo ra câu hỏi trắc nghiệm tương tác cho học sinh.
    """
    def __init__(self, knowledge_agent: KnowledgeAgent = None, llm_generator: LLMGenerator = None):
        self.knowledge_agent = knowledge_agent or KnowledgeAgent()
        self.llm = llm_generator or LLMGenerator(mock=False)

    def generate_quiz(self, topic_or_query: str) -> Dict[str, Any]:
        """
        Sinh ra 1 câu hỏi trắc nghiệm (3 đáp án A, B, C) kèm đáp án đúng và giải thích ngắn gọn.
        """
        # 1. Tra cứu ngữ cảnh liên quan đến chủ đề đố vui
        retrieval_result = self.knowledge_agent.answer_query(topic_or_query)
        context = retrieval_result.get("answer", "")
        sources = retrieval_result.get("sources", [])

        # 2. Prompt yêu cầu Gemini trả về JSON chuẩn
        quiz_prompt = (
            f"Bạn là Cụ Rùa Thông Thái đang đố vui lịch sử cho học sinh Tiểu học (Lớp 4, Lớp 5).\n\n"
            f"**Ngữ cảnh kiến thức SGK:**\n{context}\n\n"
            f"**Chủ đề yêu cầu:** \"{topic_or_query}\"\n\n"
            f"**NHIỆM VỤ:** Hãy tạo ra 1 câu hỏi trắc nghiệm lịch sử thú vị, dễ hiểu dành cho trẻ em.\n"
            f"BẮT BUỘC trả về ĐÚNG định dạng JSON hợp lệ với cấu trúc sau (không kèm văn bản nào khác ngoài JSON):\n"
            f"{{\n"
            f"  \"question\": \"Câu hỏi đố vui (bắt đầu bằng lời dẫn của Cụ Rùa, ví dụ: 🐢 Cụ Rùa đố cháu biết...)\",\n"
            f"  \"options\": [\"A. Đáp án 1\", \"B. Đáp án 2\", \"C. Đáp án 3\"],\n"
            f"  \"correct_answer\": \"A. Đáp án 1\",\n"
            f"  \"explanation\": \"Lời giải thích ngắn gọn, khen ngợi bé khi trả lời đúng.\"\n"
            f"}}"
        )

        try:
            raw_response = self.llm._call_gemini(quiz_prompt)
            # Làm sạch JSON string (xóa markdown code block nếu có)
            json_str = re.sub(r'```json\s*|\s*```', '', raw_response).strip()
            quiz_data = json.loads(json_str)
        except Exception as e:
            print(f"[QuizAgent] Lỗi sinh Quiz JSON: {e}. Dùng Quiz mẫu fallback.")
            quiz_data = {
                "question": "🐢 **Cụ Rùa đố cháu biết:** Ai là người đã chỉ huy chiến thắng Bạch Đằng vĩ đại năm 938 chấm dứt hơn 1000 năm Bắc thuộc?",
                "options": [
                    "A. Ngô Quyền",
                    "B. Đinh Bộ Lĩnh",
                    "C. Lý Thái Tổ"
                ],
                "correct_answer": "A. Ngô Quyền",
                "explanation": "Hoan hô cháu! Đúng rồi đấy! Năm 938, Ngô Quyền đã dùng kế cọc nhọn trên sông Bạch Đằng đánh tan quân Nam Hán, mở ra kỷ nguyên độc lập cho nước ta."
            }

        return {
            "answer": quiz_data["question"],
            "quiz_data": quiz_data,
            "sources": sources
        }
