# Bản Yêu Cầu Hệ Thống (System Requirements Document - SRD)
**Dự án:** Lumos History Bot — Trợ lý AI Lịch sử & Địa lý cho học sinh tiểu học (Lớp 4 & Lớp 5).
*(Bản cập nhật hoàn toàn chuyển đổi từ hệ thống cảnh báo thiên tai sang chatbot giáo dục RAG chuyên biệt cho trẻ em)*

---

## 1. Mục Tiêu & Phạm Vi Dự Án

### 1.1. Mục tiêu chung
Xây dựng một nền tảng học tập lịch sử tương tác, trực quan và an toàn tuyệt đối cho học sinh tiểu học (đặc biệt là Lớp 4 và Lớp 5), ứng dụng công nghệ **Advanced Agentic RAG** và hình tượng nhân vật linh vật **"Cụ Rùa Thông Thái"**.

### 1.2. Phạm vi dữ liệu (Nguồn kiến thức chuẩn)
- **Dữ liệu cốt lõi:** Chương trình Sách Giáo Khoa (SGK) Lịch sử & Địa lý Lớp 4 và Lớp 5 của Bộ Giáo dục và Đào tạo (Các bộ sách: Kết nối tri thức, Chân trời sáng tạo, Cánh diều).
- **Định dạng dữ liệu:** Các file tài liệu số hóa dạng Markdown (`.md`), PDF, Word được chia nhỏ theo chuẩn ngữ nghĩa (Semantic Chunking) và nạp vào cơ sở dữ liệu vector ChromaDB.
- **Các giai đoạn lịch sử trọng tâm:**
  1. Thời Hùng Vương - Văn Lang (700 TCN).
  2. Khởi nghĩa Hai Bà Trưng (Năm 40).
  3. Chiến thắng Bạch Đằng của Ngô Quyền (Năm 938).
  4. Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, lập nước Đại Cồ Việt (Năm 968).
  5. Vua Lý Thái Tổ dời đô về Thăng Long (Năm 1010).
  6. Hào khí Đông A - Ba lần kháng chiến chống quân Nguyên Mông thời Trần (Năm 1288).

---

## 2. Yêu Cầu Chức Năng (Functional Requirements)

### 2.1. Nhóm Chức Năng Tương Tác Sân Chơi Lịch Sử (Lumos History Playground)
- **F-01: Dòng Thời Gian Lịch Sử (TimelineBar):**
  - Hiển thị thanh trục thời gian ngang với các mốc sự kiện lớn trong chương trình tiểu học.
  - Cho phép học sinh chạm/nhấn vào từng mốc để lọc nội dung học tập tương ứng.
- **F-02: Thẻ Bài Kiến Thức Flashcard (HistoryCard):**
  - Hiển thị trực quan tóm tắt sự kiện dưới dạng thẻ bài mang tính thẩm mỹ cao.
  - Hỗ trợ hiệu ứng lật 3D (Front/Back) để học sinh xem "Ghi nhớ nhanh" (tóm tắt 2-3 câu trọng tâm của bài học).
- **F-03: Khung Đố Vui Trắc Nghiệm (QuizWidget):**
  - Cung cấp góc thử thách với các câu hỏi trắc nghiệm 3 lựa chọn (A, B, C).
  - Chấm điểm ngay lập tức, hiển thị hiệu ứng chúc mừng (hoặc khích lệ) và giải thích lý do đáp án đúng.
- **F-04: Linh Vật Phản Ứng Cảm Xúc (MascotWidget):**
  - Hiển thị linh vật Cụ Rùa Thông Thái kèm bong bóng lời thoại chào mừng, khen ngợi hoặc hướng dẫn học tập theo thời gian thực.

### 2.2. Nhóm Chức Năng Trợ Lý Trò Chuyện AI (HistoryChatWidget)
- **F-05: Tra Cứu Kiến Thức Chuẩn SGK (Knowledge Query):**
  - Trả lời các câu hỏi về lịch sử, địa lý của trẻ dựa trên dữ liệu RAG trích xuất từ Sách Giáo Khoa.
  - Ngôn ngữ ngắn gọn, dễ hiểu (dưới 200 từ), xưng hô *"Cụ Rùa - cháu/bạn nhỏ"*.
- **F-06: Nhập Vai Nhân Vật Lịch Sử (Roleplay Mode):**
  - Cho phép trẻ trò chuyện trực tiếp với các vị vua, tướng lĩnh anh hùng (Vua Hùng, Hai Bà Trưng, Ngô Quyền...).
  - AI tự động điều chỉnh giọng văn hào hùng, tự hào nhưng gần gũi, giải đáp thắc mắc dưới góc nhìn của nhân vật lịch sử.
- **F-07: Đố Vui Tự Động (Auto Quiz Generation):**
  - Khi trẻ yêu cầu *"Đố vui đi Cụ Rùa"*, AI tự động tổng hợp ngữ cảnh lịch sử để sinh ra câu hỏi trắc nghiệm mới lạ, không trùng lặp.

### 2.3. Nhóm Chức Năng Bảo Vệ An Toàn Cho Trẻ Em (Child Safety Guardrails)
- **F-08: Bộ Lọc Từ Khóa & Ngôn Ngữ (Input Guardrail):**
  - Tự động phát hiện và ngăn chặn tuyệt đối các truy vấn chứa từ ngữ thô tục, bạo lực dã man, kích động hoặc không phù hợp với trẻ em tiểu học.
  - Trả về lời khuyên nhủ nhẹ nhàng từ Cụ Rùa, hướng học sinh quay trở lại chủ đề học tập lịch sử.
- **F-09: Kiểm Soát Nội Dung Đầu Ra (Output Guardrail):**
  - Đảm bảo câu trả lời của AI không chứa thông tin sai lệch lịch sử (Hallucination reduction) và luôn tuân thủ sư phạm tiểu học.

---

## 3. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

- **NF-01: Hiệu Năng & Độ Trễ (Performance & Latency):**
  - Thời gian phản hồi cho các thao tác giao diện (lật thẻ, chọn timeline, làm quiz): $< 100\text{ms}$.
  - Thời gian phản hồi của AI Chatbot (nhờ kiến trúc RAG tối ưu & Reranker): $< 3\text{-}5\text{s}$.
- **NF-02: Tính Khả Dụng Khi Mất Mạng (Offline / Test Resiliency):**
  - Bộ test tự động (`pytest`) và logic Vector Store phải tích hợp cơ chế **Word-Hashing Fallback**, đảm bảo hệ thống có thể chạy test và verify thành công 100% trong môi trường local không có kết nối internet hoặc API key bên ngoài.
- **NF-03: Giao Diện Thân Thiện Với Trẻ Em (Kid-Friendly UI/UX):**
  - Sử dụng bảng màu ấm áp, tươi sáng (Vàng kim hoàng gia, Xanh ngọc, Hổ phách).
  - Phông chữ rõ ràng, dễ đọc cho học sinh Lớp 4 & 5; các nút bấm lớn, bo tròn, giàu tính tương tác (hover effects, animations).
- **NF-04: Bảo Mật & Đa Ngôn Ngữ:**
  - Hỗ trợ chuyển đổi ngôn ngữ Việt - Anh (VI / EN) trên giao diện.
  - Phân quyền rõ ràng: Người dùng bình thường (Học sinh) và Quản trị viên (Admin - Quản lý dữ liệu SGK).