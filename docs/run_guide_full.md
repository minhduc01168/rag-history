# Hướng Dẫn Vận Hành & Khởi Chạy Toàn Diện — Lumos History Bot

Tài liệu này cung cấp hướng dẫn từng bước để cài đặt, khởi chạy, kiểm thử và vận hành hệ thống **Lumos History Bot** (Trợ lý AI Lịch sử & Địa lý Tiểu học) trong cả môi trường Docker, Local Development và môi trường Kiểm thử tự động.

---

## 🐳 1. Khởi Chạy Bằng Docker Compose (Khuyên Dùng Cho Production / Demo)

Phương pháp này tự động tạo mạng nội bộ, khởi tạo Backend FastAPI, Frontend React Vite và các dịch vụ bổ trợ.

### Bước 1: Chuẩn bị biến môi trường
Tạo file `.env` tại thư mục gốc của dự án (nếu cần cấu hình API Key cho LLM):
```env
# Cấu hình LLM (Gemini / OpenAI / Groq - Tùy chọn, nếu không có hệ thống dùng mock fallback)
GEMINI_API_KEY=your_gemini_api_key_here
CHROMA_HOST=localhost
CHROMA_PORT=8000
```

### Bước 2: Build và khởi chạy container
Mở terminal tại thư mục gốc `rag-history/` và chạy lệnh:
```bash
docker-compose up --build -d
```

### Bước 3: Kiểm tra trạng thái dịch vụ
```bash
docker-compose ps
```
- **Frontend (Lumos History Playground):** Truy cập tại [http://localhost:5173](http://localhost:5173)
- **Backend API Docs (Swagger UI):** Truy cập tại [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💻 2. Khởi Chạy Môi Trường Local (Cho Lập Trình Viên)

### 2.1. Cài đặt & Khởi chạy Backend (FastAPI)
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Tạo và kích hoạt môi trường ảo (Virtual Environment):
   ```bash
   # Trên macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate

   # Trên Windows:
   python -m venv venv
   venv\Scripts\activate
   ```
3. Cài đặt các thư viện phụ thuộc:
   ```bash
   pip install -r requirements.txt
   ```
4. Khởi chạy máy chủ phát triển Uvicorn:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 2.2. Cài đặt & Khởi chạy Frontend (React + Vite)
1. Di chuyển vào thư mục frontend (mở terminal mới):
   ```bash
   cd frontend
   ```
2. Cài đặt các gói npm:
   ```bash
   npm install
   ```
3. Khởi chạy máy chủ Vite dev:
   ```bash
   npm run dev
   ```
   - Giao diện sẽ tự động mở tại [http://localhost:5173](http://localhost:5173).

---

## 🧪 3. Hướng Dẫn Chạy Kiểm Thử Tự Động (Automated Testing)

Hệ thống được thiết kế với cơ chế **Word-Hashing Offline Fallback**, cho phép bạn chạy bộ test tự động (`pytest`) thành công 100% ngay cả khi không có mạng internet, không có API Key hay không khởi chạy máy chủ embedding.

### Chạy bộ kiểm thử Backend:
```bash
cd backend
# Kích hoạt venv trước
source venv/bin/activate
pytest -v
```
**Kết quả chuẩn kỳ vọng:**
```text
================== 33 passed, 3 skipped in ~26s ==================
```

### Kiểm tra Frontend Build (Type-Check & Bundle):
```bash
cd frontend
npm run build
```
**Kết quả chuẩn kỳ vọng:**
```text
vite v5.x.x building for production...
✓ built in x.xx s
```

---

## 🛠️ 4. Xử Lý Sự Cố Thường Gặp (Troubleshooting)

| Lỗi / Triệu chứng | Nguyên nhân | Cách khắc phục |
|---|---|---|
| **Lỗi 404 khi gọi `/api/v1/gis` hoặc `/api/v1/weather`** | Các module thiên tai cũ đã được xóa hoàn toàn trong Lumos History Bot | Sử dụng các endpoint mới: `/api/v1/chat`, `/api/v1/kb`, `/api/v1/auth`. |
| **Lỗi Connection Refused tới `localhost:8002` trong log** | Máy chủ embedding microservice không chạy | **Không sao cả!** Hệ thống tự động chuyển sang chế độ *Word-Hashing Fallback*, tra cứu ngữ nghĩa vẫn hoạt động bình thường. |
| **Cổng 8000 hoặc 5173 bị chiếm dụng** | Có tiến trình khác đang chạy trên cổng này | Trên macOS/Linux: Chạy `lsof -i :8000` và `kill -9 <PID>`. |
| **ChromaDB báo lỗi khóa file (File lock) trên Windows** | Thư mục `.chroma` đang bị tiến trình python giữ | Tắt server Uvicorn/pytest, xóa thư mục `.chroma` nếu cần reset dữ liệu sạch. |
