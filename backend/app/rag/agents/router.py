import json
from app.rag.agents.llm_generator import LLMGenerator

class RouterAgent:
    """
    Agent định tuyến câu hỏi của học sinh Tiểu học đến đúng bộ phận xử lý:
    1. knowledge: Tra cứu kiến thức sách giáo khoa lịch sử Lớp 4 & 5.
    2. roleplay: Yêu cầu đóng vai/trò chuyện với Cụ Rùa Thông Thái hoặc nhân vật lịch sử (Vua Hùng, Trần Hưng Đạo, Ngô Quyền...).
    3. quiz: Yêu cầu đố vui, kiểm tra kiến thức trắc nghiệm.
    """
    def __init__(self, llm_generator: LLMGenerator = None):
        self.llm = llm_generator or LLMGenerator(mock=False)

    def route_query(self, query: str) -> dict:
        """
        Xác định ý định câu hỏi của trẻ em.
        Trả về JSON dict:
        {
            "route": "knowledge" | "roleplay" | "quiz",
            "character": "Tên nhân vật lịch sử muốn đóng vai" | null
        }
        """
        query_lower = query.lower()
        
        # Heuristic nhanh cho trẻ em: Nếu có từ khóa đố vui -> vào thẳng quiz
        if any(kw in query_lower for kw in ["đố", "quiz", "trắc nghiệm", "câu hỏi", "thử thách", "kiểm tra"]):
            return {"route": "quiz", "character": None}
            
        # Heuristic nhanh cho đóng vai
        if any(kw in query_lower for kw in ["đóng vai", "trò chuyện với", "nói chuyện với", "nhập vai", "cụ rùa ơi", "ta là"]):
            # Tìm nhân vật
            character = "Cụ Rùa Thông Thái"
            for char in ["Vua Hùng", "Hai Bà Trưng", "Ngô Quyền", "Trần Hưng Đạo", "Đinh Bộ Lĩnh", "Lý Thái Tổ"]:
                if char.lower() in query_lower:
                    character = char
                    break
            return {"route": "roleplay", "character": character}

        prompt = f"""Bạn là một hệ thống phân loại câu hỏi (Router) cho ứng dụng học lịch sử tiểu học (Đại Việt Kids AI).
Nhiệm vụ của bạn là đọc câu hỏi của học sinh và trả về một JSON HỢP LỆ (chỉ có JSON, không có text nào khác) với 2 trường:
- "route": Chọn 1 trong 3 giá trị:
  - "quiz": Nếu học sinh yêu cầu đố vui, làm bài tập trắc nghiệm, hoặc muốn được hỏi thử thách kiến thức.
  - "roleplay": Nếu học sinh muốn trò chuyện, chào hỏi, tâm sự hoặc nói chuyện trực tiếp với Cụ Rùa hoặc một nhân vật lịch sử.
  - "knowledge": Nếu học sinh hỏi thông tin, sự kiện, năm tháng, nguyên nhân, kết quả của các triều đại hoặc chiến thắng lịch sử.
- "character": Trích xuất tên nhân vật lịch sử hoặc Cụ Rùa mà bé muốn đóng vai/nói chuyện. Nếu không có, hãy để là null.

Câu hỏi: "{query}"

JSON:"""
        try:
            response = self.llm.model.generate_content(prompt)
            print(f"[RouterAgent] LLM RAW: {response.text}")
            text = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(text)
            
            if result.get("route") not in ["knowledge", "roleplay", "quiz"]:
                result["route"] = "knowledge"
                
            return result
        except Exception as e:
            print(f"[RouterAgent] Error: {e}. Fallback to knowledge.")
            return {"route": "knowledge", "character": None}
