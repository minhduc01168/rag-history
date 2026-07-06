from typing import Dict, Any, List
from app.rag.agents.llm_generator import LLMGenerator
from app.rag.agents.knowledge_agent import KnowledgeAgent

class RoleplayAgent:
    """
    Agent chuyên trách chế độ Nhập vai (Roleplay):
    Cho phép học sinh trò chuyện trực tiếp với Cụ Rùa Thông Thái hoặc một nhân vật lịch sử cụ thể
    (ví dụ: Trần Hưng Đạo, Ngô Quyền, Hai Bà Trưng...).
    """
    def __init__(self, knowledge_agent: KnowledgeAgent = None, llm_generator: LLMGenerator = None):
        self.knowledge_agent = knowledge_agent or KnowledgeAgent()
        self.llm = llm_generator or LLMGenerator(mock=False)

    def process(self, query: str, target_character: str = None) -> Dict[str, Any]:
        """
        1. Tìm kiếm kiến thức lịch sử thực tế liên quan đến câu hỏi và nhân vật.
        2. Dùng LLM nhập vai nhân vật trả lời theo giọng điệu ngôi thứ nhất (Ta/Cụ Rùa - cháu/bạn nhỏ).
        """
        character = target_character if target_character else "Cụ Rùa Thông Thái"
        
        # 1. Tra cứu ngữ cảnh từ sách giáo khoa Lớp 4 & 5
        retrieval_query = f"{character} {query}" if target_character else query
        retrieval_result = self.knowledge_agent.answer_query(retrieval_query)
        context = retrieval_result.get("answer", "")
        sources = retrieval_result.get("sources", [])

        # 2. Xây dựng Prompt nhập vai chuyên sâu cho trẻ em
        roleplay_prompt = (
            f"Bạn đang đóng vai: **{character}** trong một cuộc trò chuyện lịch sử với học sinh Tiểu học (Lớp 4, Lớp 5).\n\n"
            f"**Ngữ cảnh lịch sử chính xác từ Sách giáo khoa:**\n{context}\n\n"
            f"**Câu hỏi của học sinh:** \"{query}\"\n\n"
            f"**QUY TẮC NHẬP VAI NGHIÊM NGẶT:**\n"
            f"1. Xưng hô: Nếu là Cụ Rùa Thông Thái, xưng là 'Cụ Rùa' và gọi học sinh là 'cháu' hoặc 'các nhà sử học nhí'. "
            f"Nếu là nhân vật lịch sử (như Vua Hùng, Trần Hưng Đạo, Ngô Quyền...), xưng là 'Ta' hoặc 'Trẫm' và gọi học sinh là 'cháu' hoặc 'các hậu sinh/bạn nhỏ'.\n"
            f"2. Giọng điệu: Tự hào, ấm áp, sinh động, giàu cảm xúc, như đang kể một câu chuyện hào hùng truyền cảm hứng.\n"
            f"3. Độ dài: Ngắn gọn, dưới 180 từ, chia làm 2-3 đoạn ngắn dễ đọc cho mắt trẻ em.\n"
            f"4. Độ chính xác: Dựa trên ngữ cảnh lịch sử được cung cấp, không bịa đặt sai lệch sử sách.\n"
            f"5. Kết thúc: Luôn kết thúc bằng một câu hỏi gợi mở hoặc lời chúc nhắn nhủ để khuyến khích các bé suy nghĩ thêm."
        )

        try:
            answer = self.llm._call_gemini(roleplay_prompt)
        except Exception as e:
            print(f"[RoleplayAgent] Lỗi gọi Gemini LLM: {e}. Sử dụng mock fallback.")
            answer = (
                f"🐢 **{character}:** Khà khà, chào cháu! Ngàn năm qua Cụ Rùa đã chứng kiến biết bao trang sử hào hùng. "
                f"Về câu hỏi \"{query}\", đó là một câu chuyện rất dài và ý nghĩa trong lịch sử nước Nam ta. "
                f"Cháu có muốn nghe Cụ kể chi tiết về trận chiến Bạch Đằng năm 938 không nào?"
            )

        return {
            "answer": answer,
            "sources": sources,
            "character_played": character
        }
