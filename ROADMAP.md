# Lộ Trình Phát Triển Chiến Lược (Strategic Roadmap) — Lumos History Bot
> **Tầm nhìn:** Trở thành nền tảng trợ lý học tập AI hàng đầu cho học sinh tiểu học Việt Nam, kết hợp phương pháp học qua chơi (Gamification), RAG chuẩn Sách Giáo Khoa và bảo vệ an toàn trẻ em tuyệt đối.

---

## 🏁 Giai Đoạn 1: Nền Tảng & Số Hóa Dữ Liệu SGK (Hoàn Thành ✅)
*Tập trung vào xây dựng bộ lõi RAG và chuẩn hóa nguồn kiến thức.*

- [x] **Xác định phạm vi dữ liệu:** Tập trung vào Sách Giáo Khoa Lịch sử & Địa lý Lớp 4 và Lớp 5 theo Chương trình Giáo dục Phổ thông mới.
- [x] **Xây dựng Ingestion Pipeline:** Ứng dụng Docling Parser và Semantic Chunking để chia nhỏ bài học theo mốc thời gian và sự kiện.
- [x] **Vector Database Setup:** Khởi tạo ChromaDB namespace `history_knowledge`, tách biệt hoàn toàn khỏi các bộ dữ liệu cũ.
- [x] **Word-Hashing Fallback:** Tích hợp thuật toán fallback offline trong `vector_store.py` giúp hệ thống và pytest chạy ổn định 100% không phụ thuộc internet.

---

## 🧠 Giai Đoạn 2: Kiến Trúc Đa Tác Tử AI & Bảo Vệ Trẻ Em (Hoàn Thành ✅)
*Xây dựng "bộ não" AI thông minh, an toàn và hấp dẫn với học sinh tiểu học.*

- [x] **Child Safety Guardrails (`guardrails.py`):** Lớp lọc tự động chặn từ khóa thô tục, bạo lực dã man, bảo vệ môi trường học tập an toàn.
- [x] **Router Agent (`router.py`):** Phân loại thông minh ý định người dùng thành 3 luồng: `knowledge` (tra cứu SGK), `roleplay` (nhập vai), `quiz` (đố vui).
- [x] **Roleplay Agent (`roleplay_agent.py`):** Cho phép học sinh trò chuyện trực tiếp với Vua Hùng, Hai Bà Trưng, Ngô Quyền...
- [x] **Quiz Agent (`quiz_agent.py`):** Tự động sinh câu hỏi trắc nghiệm A-B-C từ ngữ cảnh bài học.
- [x] **Persona Cụ Rùa Thông Thái (`synthesis_agent.py`):** Giọng văn đôn hậu, xưng Cụ Rùa - cháu/bạn nhỏ, luôn có câu hỏi gợi mở ở cuối.

---

## 🎨 Giai Đoạn 3: Sân Chơi Lịch Sử UI/UX Redesign (Hoàn Thành ✅)
*Lột xác giao diện thành một không gian học tập tương tác rực rỡ, thân thiện với trẻ em.*

- [x] **Dọn dẹp code cũ:** Xóa bỏ toàn bộ các module thiên tai, thời tiết, GIS, sơ tán cứu hộ của hệ thống trước đây.
- [x] **TimelineBar.tsx:** Thanh dòng thời gian lịch sử Việt Nam tương tác (Từ Văn Lang đến Nhà Trần).
- [x] **MascotWidget.tsx:** Linh vật Cụ Rùa Thông Thái phản ứng cảm xúc theo thời gian thực.
- [x] **HistoryCard.tsx:** Thẻ bài kiến thức Flashcard hỗ trợ hiệu ứng lật 3D trực quan.
- [x] **QuizWidget.tsx:** Khung làm bài đố vui trắc nghiệm trực tiếp với lời chúc mừng sinh động.
- [x] **HistoryChatWidget.tsx:** Giao diện trò chuyện bo tròn với màu vàng kim - xanh ngọc hoàng gia.

---

## 🔮 Giai Đoạn 4: Mở Rộng & Tích Hợp Trường Học (Kế Hoạch Tương Lai 🚀)
*Đưa hệ thống vào thực nghiệm giảng dạy và mở rộng tính năng đa phương tiện.*

- [ ] **Tích hợp Giọng nói AI (Voice AI / TTS):** Cho phép Cụ Rùa đọc kể chuyện bằng giọng nói truyền cảm, đôn hậu (Text-to-Speech) và học sinh có thể đặt câu hỏi bằng micro (Speech-to-Text).
- [ ] **Mở rộng Chương trình Lớp 6 - Lớp 9:** Tiếp tục số hóa dữ liệu SGK Lịch sử THCS vào Vector Database.
- [ ] **Bảng Vàng Thành Tích (Leaderboard & Badges):** Hệ thống huy hiệu thưởng (Ví dụ: *Huy hiệu Trạng Nguyên*, *Huy hiệu Sử Gia Nhí*) khi trẻ hoàn thành các bài trắc nghiệm.
- [ ] **Chế độ Lớp học cho Giáo viên (Teacher Dashboard):** Cho phép giáo viên giao bài tập trắc nghiệm và theo dõi tiến độ học tập lịch sử của từng học sinh trong lớp.
