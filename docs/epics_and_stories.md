# Danh Sách Epics & User Stories — Lumos History Bot

Tài liệu này định nghĩa các cấu phần tính năng (Epics) và các câu chuyện người dùng (User Stories) để phát triển hệ thống trợ lý học tập Lịch sử & Địa lý tiểu học **Lumos History Bot** (chuyển đổi từ dự án TerraAlert RAG cũ).

---

## 🎯 EPIC 1: Nạp & Xử Lý Dữ Liệu Sách Giáo Khoa (SGK Ingestion & Vector Store)
**Mục tiêu:** Xây dựng kho tri thức lịch sử chính xác, chuẩn sư phạm tiểu học từ Sách Giáo Khoa Lớp 4 và Lớp 5, lưu trữ vào Vector Database ChromaDB.

- **Story 1.1 - Cấu hình Collection Lịch Sử:**
  - *Là* quản trị viên hệ thống,
  - *Tôi muốn* ChromaDB sử dụng collection riêng biệt mang tên `history_knowledge` thay vì các bộ dữ liệu thiên tai cũ,
  - *Để* đảm bảo dữ liệu lịch sử không bị pha trộn và tra cứu chính xác.
- **Story 1.2 - Chuẩn hóa & Tách đoạn ngữ nghĩa (Semantic Chunking):**
  - *Là* hệ thống RAG,
  - *Tôi muốn* cắt tài liệu sách giáo khoa thành các đoạn nhỏ theo ngữ nghĩa (từng bài học, từng sự kiện, từng mốc thời gian),
  - *Để* LLM dễ dàng trích xuất thông tin khi trả lời học sinh.
- **Story 1.3 - Word-Hashing Offline Fallback:**
  - *Là* lập trình viên phát triển/kiểm thử,
  - *Tôi muốn* hệ thống Vector Store có cơ chế tự động tạo mock embeddings bằng phương pháp Word-Hashing khi không có kết nối internet/máy chủ embedding,
  - *Để* bộ kiểm thử tự động (`pytest`) và môi trường local luôn hoạt động ổn định 100%.

---

## 🛡️ EPIC 2: Lớp Bảo Vệ An Toàn Cho Trẻ Em & Persona Cụ Rùa (Guardrails & Persona)
**Mục tiêu:** Đảm bảo môi trường giao tiếp lành mạnh, chuẩn sư phạm và hấp dẫn với học sinh Lớp 4 & 5.

- **Story 2.1 - Bộ lọc An toàn Trẻ em (Child Safety Guardrails):**
  - *Là* phụ huynh và giáo viên,
  - *Tôi muốn* hệ thống tự động phát hiện và chặn các từ khóa thô tục, bạo lực dã man hoặc nhạy cảm trong câu hỏi của trẻ,
  - *Để* bảo vệ trẻ khỏi nội dung xấu và nhẹ nhàng khuyên nhủ trẻ tập trung vào việc học.
- **Story 2.2 - System Prompt Cụ Rùa Thông Thái:**
  - *Là* học sinh tiểu học,
  - *Tôi muốn* AI trò chuyện với giọng điệu ấm áp, đôn hậu, xưng là "Cụ Rùa" và gọi tôi là "cháu/bạn nhỏ",
  - *Để* cảm thấy gần gũi, thích thú như đang nghe ông kể chuyện cổ tích lịch sử.
- **Story 2.3 - Gợi mở hội thoại sư phạm:**
  - *Là* học sinh tiểu học,
  - *Tôi muốn* mỗi câu trả lời của Cụ Rùa luôn kết thúc bằng một câu hỏi gợi mở hoặc một gợi ý nhỏ,
  - *Để* kích thích sự tò mò và tiếp tục khám phá bài học.

---

## 🧠 EPIC 3: Định Tuyến Đa Tác Tử & Nhập Vai Lịch Sử (Multi-Agent RAG Routing)
**Mục tiêu:** Xây dựng bộ não AI thông minh có khả năng phân loại ý định để trả lời kiến thức, cho phép đóng vai nhân vật hoặc đố vui.

- **Story 3.1 - Router Agent Định Tuyến Thông Minh:**
  - *Là* hệ thống AI,
  - *Tôi muốn* tự động phân loại truy vấn của học sinh vào 3 nhánh: `knowledge` (tra cứu SGK), `roleplay` (nhập vai), và `quiz` (đố vui),
  - *Để* kích hoạt Agent chuyên trách xử lý phù hợp nhất.
- **Story 3.2 - Roleplay Agent Nhập Vai Anh Hùng:**
  - *Là* học sinh tiểu học,
  - *Tôi muốn* nói chuyện trực tiếp với Vua Hùng, Hai Bà Trưng, Ngô Quyền, Đinh Bộ Lĩnh hay Trần Hưng Đạo,
  - *Để* hiểu rõ hơn về tinh thần yêu nước và hoàn cảnh lịch sử qua lời kể của chính nhân vật.
- **Story 3.3 - Quiz Agent Đố Vui Trắc Nghiệm:**
  - *Là* học sinh tiểu học,
  - *Tôi muốn* AI tự động tạo ra các câu hỏi trắc nghiệm A, B, C từ nội dung vừa học,
  - *Để* ôn tập kiến thức một cách vui vẻ và nhận lời khen ngợi khi trả lời đúng.

---

## 🎨 EPIC 4: Lột Xác Giao Diện Sân Chơi Lịch Sử (Lumos History Playground UI/UX)
**Mục tiêu:** Thiết kế giao diện hiện đại, rực rỡ, bo tròn thân thiện với trẻ em, loại bỏ hoàn toàn các thành phần hành chính/thiên tai cũ.

- **Story 4.1 - Thanh Dòng Thời Gian (TimelineBar):**
  - *Là* học sinh tiểu học,
  - *Tôi muốn* chạm vào các mốc thời gian trên dòng lịch sử Việt Nam (Từ Văn Lang đến Nhà Trần),
  - *Để* dễ dàng chọn giai đoạn muốn học và xem linh vật Cụ Rùa hào hứng phản hồi.
- **Story 4.2 - Thẻ Bài Flashcard Lật 3D (HistoryCard):**
  - *Là* học sinh tiểu học,
  - *Tôi muốn* nhấn vào thẻ bài lịch sử để lật mặt sau xem "Ghi nhớ nhanh",
  - *Để* thuộc bài nhanh chóng trước khi làm kiểm tra.
- **Story 4.3 - Khung Thử Thách Đố Vui (QuizWidget):**
  - *Là* học sinh tiểu học,
  - *Tôi muốn* làm bài trắc nghiệm ngay trên trang chủ với hiệu ứng chọn đáp án rõ ràng (Xanh đúng / Đỏ sai),
  - *Để* nhận lời giải thích chi tiết và tiếp tục thử thách mới.
- **Story 4.4 - Khung Chat Cụ Rùa (HistoryChatWidget):**
  - *Là* học sinh tiểu học,
  - *Tôi muốn* một khung chat bo tròn đẹp mắt, nút bấm hình con rùa 🐢 màu vàng kim dễ thương,
  - *Để* luôn có thể trò chuyện với Cụ Rùa bất cứ lúc nào trong khi đang xem các thẻ bài.
