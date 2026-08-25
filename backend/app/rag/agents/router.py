import re
from typing import Dict, Any


class RouterAgent:
    """
    Agent định tuyến câu hỏi của học sinh Tiểu học đến đúng bộ phận xử lý:
    1. knowledge: Tra cứu kiến thức sách giáo khoa lịch sử Lớp 4 & 5.
    2. roleplay: Yêu cầu đóng vai/trò chuyện với Cụ Rùa Thông Thái hoặc nhân vật lịch sử (Vua Hùng, Trần Hưng Đạo, Ngô Quyền...).
    3. quiz: Yêu cầu đố vui, kiểm tra kiến thức trắc nghiệm.

    Sử dụng Rule-based NLP thông minh để phân loại tức thì (<0.001s) không tốn quota LLM.
    """
    def __init__(self, llm_generator=None):
        self.llm = llm_generator

    def route_query(self, query: str) -> Dict[str, Any]:
        query_lower = query.lower().strip()

        # 1. Nhánh Quiz / Đố vui
        quiz_keywords = [
            "đố", "quiz", "trắc nghiệm", "thử thách", "kiểm tra", "câu hỏi ôn tập",
            "đố vui", "đố cháu", "thử tài"
        ]
        if any(kw in query_lower for kw in quiz_keywords):
            return {"route": "quiz", "character": None}

        # 2. Nhánh Roleplay / Nhập vai
        roleplay_keywords = [
            "đóng vai", "trò chuyện với", "nói chuyện với", "nhập vai",
            "chào cụ rùa", "cụ rùa ơi", "chào người", "ta là", "hãy đóng vai",
            "kể chuyện theo vai"
        ]
        is_roleplay = any(kw in query_lower for kw in roleplay_keywords)

        # Trích xuất nhân vật
        historical_characters = [
            "Vua Hùng", "Hai Bà Trưng", "Trưng Trắc", "Ngô Quyền",
            "Trần Hưng Đạo", "Trần Quốc Tuấn", "Đinh Bộ Lĩnh", "Đinh Tiên Hoàng",
            "Lý Thái Tổ", "Lý Công Uẩn", "Lê Lợi", "Quang Trung", "Nguyễn Huệ",
            "Võ Nguyên Giáp", "Bác Hồ", "Cụ Rùa Thông Thái"
        ]

        found_character = None
        for char in historical_characters:
            if char.lower() in query_lower:
                found_character = char
                break

        if is_roleplay or (found_character and any(w in query_lower for w in ["chào", "ơi", "bác", "ông", "ngài", "người"])):
            return {
                "route": "roleplay",
                "character": found_character or "Cụ Rùa Thông Thái"
            }

        # 3. Mặc định là tra cứu kiến thức SGK Lịch sử (Knowledge RAG)
        return {
            "route": "knowledge",
            "character": None
        }
