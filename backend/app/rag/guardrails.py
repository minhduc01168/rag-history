import re
from typing import Dict, Any, Tuple

class ChildSafetyGuardrail:
    """
    Lớp lọc an toàn cho học sinh Tiểu học (Lớp 4 & Lớp 5, từ 9-11 tuổi).
    Kiểm tra cả đầu vào (User Query) và đầu ra (AI Response) để đảm bảo:
    1. Không có từ ngữ bạo lực, thù hận, tục tĩu, hoặc nhạy cảm.
    2. Ngôn ngữ thân thiện, chuẩn mực giáo dục Việt Nam.
    3. Ngăn chặn các câu hỏi cố tình bóp méo lịch sử hoặc gây tranh cãi không phù hợp lứa tuổi.
    """
    
    # Danh sách từ khóa/nhóm từ nhạy cảm cần chặn hoặc cảnh báo (tiếng Việt & tiếng Anh)
    BLOCKED_KEYWORDS = [
        "giết người", "chém giết dã man", "tự tử", "khủng bố", "ma túy", "súng đạn",
        "tình dục", "người lớn", "đánh bạc", "bạo lực", "chửi thề", "fuck", "shit",
        "thù hận", "phản động", "lật đổ", "bóp méo lịch sử"
    ]
    
    # Câu trả lời mặc định khi phát hiện nội dung không an toàn
    SAFE_FALLBACK_RESPONSE = (
        "🐢 **Cụ Rùa Thông Thái:** Ối chà, câu hỏi này có vẻ không phù hợp với không gian khám phá "
        "lịch sử tiểu học của chúng mình rồi! Cháu hãy hỏi Cụ Rùa về các vị vua Hùng, Hai Bà Trưng, "
        "hay các chiến thắng hào hùng của dân tộc ta nhé!"
    )

    @classmethod
    def check_input(cls, query: str) -> Tuple[bool, str]:
        """
        Kiểm tra câu hỏi của người dùng trước khi đưa vào RAG/LLM.
        Trả về: (is_safe: bool, reason_or_fallback: str)
        """
        if not query or not query.strip():
            return False, "🐢 **Cụ Rùa Thông Thái:** Cháu hình như chưa gõ câu hỏi nào cho Cụ Rùa đấy!"
            
        query_lower = query.lower()
        for keyword in cls.BLOCKED_KEYWORDS:
            if keyword in query_lower:
                print(f"[Guardrail] 🚫 Blocked unsafe input keyword: '{keyword}'")
                return False, cls.SAFE_FALLBACK_RESPONSE
                
        # Nếu an toàn
        return True, ""

    @classmethod
    def sanitize_output(cls, response_text: str) -> str:
        """
        Kiểm tra và làm sạch câu trả lời từ AI trước khi hiển thị cho trẻ em.
        """
        if not response_text:
            return cls.SAFE_FALLBACK_RESPONSE
            
        response_lower = response_text.lower()
        for keyword in cls.BLOCKED_KEYWORDS:
            if keyword in response_lower:
                print(f"[Guardrail] 🚫 Blocked unsafe AI output containing: '{keyword}'")
                return cls.SAFE_FALLBACK_RESPONSE
                
        # Đảm bảo câu trả lời có giọng điệu thân thiện của Cụ Rùa nếu chưa có
        if "Cụ Rùa" not in response_text and "cụ" not in response_lower and "cháu" not in response_lower:
            # Thêm phần mở đầu của Cụ Rùa nếu AI quên
            response_text = f"🐢 **Cụ Rùa Thông Thái:** {response_text}"
            
        return response_text
