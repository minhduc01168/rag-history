import os
import time
import google.generativeai as genai


class LLMGenerator:
    """
    Sử dụng Google Gemini để tổng hợp thông tin (context) và sinh ra câu trả lời tự nhiên.
    Chuyên phục vụ Đại Việt Kids AI — Lịch sử Tiểu học Lớp 4 & 5.
    Hỗ trợ multi-model fallback và retry thông minh khi gặp rate limit.
    """
    def __init__(self, model_name: str = "gemini-flash-latest", mock: bool = False):
        self.mock = mock
        self.model_name = model_name
        self.candidate_models = ["gemini-flash-latest", "gemini-3.7-flash", "gemini-3.5-flash", "gemini-2.5-flash"]
        if not self.mock:
            api_key = os.environ.get("GEMINI_API_KEY", "")
            if not api_key:
                print("Cảnh báo: Không tìm thấy GEMINI_API_KEY trong environment variables.")
            genai.configure(api_key=api_key)

    def _call_gemini(self, prompt: str) -> str:
        """
        Gọi Gemini với cơ chế fallback qua danh sách model khả dụng.
        """
        if self.mock:
            return f"[MOCK] {prompt[:120]}..."

        last_err = None
        for m_name in self.candidate_models:
            try:
                model = genai.GenerativeModel(m_name)
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                last_err = e
                print(f"[LLMGenerator] Model {m_name} failed: {e}. Trying next fallback...")
                continue

        raise RuntimeError(f"All Gemini models failed: {last_err}")

    def generate_answer(self, query: str, context: str) -> str:
        """
        Sinh câu trả lời Lịch sử Lớp 4 & 5 dựa trên context từ SGK.
        """
        if self.mock:
            return f"[MOCK_LLM_RESPONSE] Câu trả lời cho '{query}': {context[:200]}"

        prompt = f"""Bạn là Cụ Rùa Thông Thái — trợ lý AI Lịch sử Việt Nam chuyên dành cho học sinh Tiểu học Lớp 4 & 5.
Nhiệm vụ của bạn là trả lời câu hỏi CHỈ DỰA VÀO kiến thức SGK Lịch sử được cung cấp bên dưới.
Nếu Context không đủ thông tin, hãy thành thật nói rằng sách giáo khoa chưa đề cập chi tiết về điều đó.
TUYỆT ĐỐI không bịa đặt thông tin lịch sử.

**Câu hỏi của học sinh:** {query}

**Kiến thức SGK Lịch sử Lớp 4 & 5:**
{context}

**Hướng dẫn trả lời:**
- Xưng là "Cụ Rùa", gọi học sinh là "cháu"
- Ngôn ngữ ấm áp, sinh động, dễ hiểu cho lứa tuổi lớp 4-5
- Ngắn gọn, dưới 150 từ
- Kết thúc bằng một câu hỏi gợi mở

**Câu trả lời của Cụ Rùa:**"""

        return self._call_gemini(prompt)
