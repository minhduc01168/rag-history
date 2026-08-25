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

## 🛠️ 2. Khởi Động Bằng Docker (Khuyên Dùng)

Hệ thống đã tách biệt cấu hình cho 2 môi trường:

### 2.1. Chạy Môi trường Phát triển Local (Live Reload / HMR)
Dành cho lập trình viên phát triển tính năng, sửa code phản hồi ngay lập tức:
```bash
# 1. Cấu hình biến môi trường dev
cp .env.local.example backend/.env

# 2. Khởi động Docker Local
docker compose -f docker-compose.local.yml up --build -d

# 3. Truy cập:
# - Frontend: http://localhost:3000
# - Backend Docs: http://localhost:8000/docs
```

### 2.2. Triển khai Môi trường Production (Deploy Server)
Dành cho chạy chính thức trên máy chủ với Nginx hiệu năng cao, healthcheck, và restart policies:
```bash
# 1. Cấu hình biến môi trường prod
cp .env.prod.example backend/.env

# 2. Khởi động Docker Production
docker compose -f docker-compose.prod.yml up --build -d

# 3. Kiểm tra:
docker compose -f docker-compose.prod.yml ps
# Truy cập: http://localhost (Port 80)
```
*Chi tiết cấu hình nâng cao xem tại: [docs/DEPLOYMENT_GUIDE.md](file:///home/mypc/rag-history/docs/DEPLOYMENT_GUIDE.md)*


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
