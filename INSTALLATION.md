# Hướng Dẫn Cài Đặt Chi Tiết — Lumos History Bot

Tài liệu này hướng dẫn cài đặt và thiết lập môi trường phát triển cho **Lumos History Bot** — Trợ lý AI Lịch sử & Địa lý Tiểu học (Lớp 4 & Lớp 5).

---

## 📋 1. Yêu Cầu Hệ Thống (Prerequisites)

Để cài đặt và vận hành hệ thống, máy tính của bạn cần đáp ứng các yêu cầu sau:
- **Hệ điều hành:** macOS (Khuyên dùng), Linux (Ubuntu 20.04+), hoặc Windows 11 (với WSL2).
- **Docker & Docker Compose:** Phiên bản 24.0+ (Nếu muốn chạy bằng Docker).
- **Python:** Phiên bản 3.10 đến 3.13 (Khuyên dùng Python 3.13 cho FastAPI Backend).
- **Node.js & npm:** Node.js v18.0+ và npm v9.0+ (Cho React Vite Frontend).
- **Git:** Để quản lý mã nguồn.

---

## 🛠️ 2. Cài Đặt Bằng Docker Compose (Nhanh Nhất)

Đây là cách dễ dàng nhất để chạy toàn bộ hệ thống (Backend, Frontend, Vector DB) chỉ với 1 lệnh:

1. **Clone mã nguồn về máy:**
   ```bash
   git clone https://github.com/your-repo/rag-history.git
   cd rag-history
   ```
2. **Tạo file cấu hình môi trường `.env` (Tại thư mục gốc):**
   ```bash
   # Tạo file .env
   cat <<EOF > .env
   GEMINI_API_KEY=your_api_key_here_if_any
   CHROMA_HOST=localhost
   CHROMA_PORT=8000
   EOF
   ```
3. **Khởi chạy Docker Compose:**
   ```bash
   docker-compose up --build -d
   ```
4. **Kiểm tra ứng dụng:**
   - Sân chơi Lịch sử (Frontend): [http://localhost:5173](http://localhost:5173)
   - Tài liệu API Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💻 3. Cài Đặt Môi Trường Thủ Công (Local Development)

### 3.1. Thiết Lập Backend (FastAPI + ChromaDB)
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Tạo môi trường ảo (Virtual Environment):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Trên Windows dùng: venv\Scripts\activate
   ```
3. Cài đặt các thư viện Python:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
4. Kiểm tra cài đặt bằng cách chạy test tự động:
   ```bash
   pytest -v
   ```
   *(Hệ thống sử dụng cơ chế Word-Hashing Fallback nên test sẽ pass 100% ngay cả khi không có kết nối LLM hay mạng internet)*.

### 3.2. Thiết Lập Frontend (React 18 + Vite + TailwindCSS)
1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các gói phụ thuộc (Dependencies):
   ```bash
   npm install
   ```
3. Kiểm tra build dự án:
   ```bash
   npm run build
   ```
4. Khởi chạy máy chủ phát triển (Dev Server):
   ```bash
   npm run dev
   ```

---

## 🗄️ 4. Nạp Dữ Liệu Sách Giáo Khoa (Data Ingestion)

Khi muốn nạp thêm bài học Lịch sử Lớp 4 hoặc Lớp 5 mới vào Vector Database (`ChromaDB` collection `history_knowledge`):
1. Đặt các file tài liệu định dạng Markdown (`.md`), PDF hoặc Word vào thư mục `markdowns/` hoặc `backend/data/`.
2. Chạy script Ingestion (hoặc API Endpoint nạp dữ liệu):
   ```bash
   cd backend
   source venv/bin/activate
   python -m app.rag.ingestion.docling_parser
   ```
3. Dữ liệu sẽ được tự động phân mảnh ngữ nghĩa (Semantic Chunking) và lưu vào `.chroma/` với namespace `history_knowledge`.
