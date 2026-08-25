# 📚 HƯỚNG DẪN TRIỂN KHAI & VẬN HÀNH HỆ THỐNG ĐẠI VIỆT KIDS AI

Tài liệu này cung cấp hướng dẫn đầy đủ từ chuẩn bị môi trường, cấu hình Docker cho phát triển cục bộ (**Local Development**), triển khai máy chủ (**Production Deployment**), kiểm thử tự động, đến giám sát và xử lý sự cố.

---

## 📑 Mục Lục
1. [Kiến Trúc & Yêu Cầu Hệ Thống](#1-kiến-trúc--yêu-cầu-hệ-thống)
2. [Bảng Đánh Giá Mức Độ Sẵn Sàng (Readiness Checklist)](#2-bảng-đánh-giá-mức-độ-sẵn-sàng-readiness-checklist)
3. [Môi Trường 1: Chạy Phát Triển Cục Bộ (Local Development)](#3-môi-trường-1-chạy-phát-triển-cục-bộ-local-development)
4. [Môi Trường 2: Triển Khai Máy Chủ Production (Deploy Server)](#4-môi-trường-2-triển-khai-máy-chủ-production-deploy-server)
5. [Quy Trình Kiểm Thử & Nghiệm Thu Hệ Thống (Verification)](#5-quy-trình-kiểm-thử--nghiệm-thu-hệ-thống-verification)
6. [Quản Lý & Sao Lưu Dữ Liệu (Backup & Recovery)](#6-quản-lý--sao-lưu-dữ-liệu-backup--recovery)
7. [Cẩm Nang Xử Lý Sự Cố Thường Gặp (Troubleshooting Runbook)](#7-cẩm-nang-xử-lý-sự-cố-thường-gặp-troubleshooting-runbook)

---

## 1. Kiến Trúc & Yêu Cầu Hệ Thống

### 1.1. Sơ đồ các dịch vụ Container
Hệ thống gồm **5 microservices** được liên kết qua mạng Docker Bridge riêng biệt (`daivietkids-network`):

```
                                      [ Internet / Client ]
                                                │
                                    ┌───────────┴───────────┐
                                    │     Port 80 / 3000    │
                                    ▼                       │
                             ┌──────────────┐               │
                             │   Frontend   │               │
                             │(React/Nginx) │               │
                             └──────┬───────┘               │
                                    │ /api                  │
                                    ▼                       ▼
                             ┌──────────────┐       ┌──────────────┐
                             │   Backend    │ <───> │ Gemini Cloud │
                             │  (FastAPI)   │       └──────────────┘
                             └──┬────┬────┬─┘
                                │    │    │
            ┌───────────────────┘    │    └───────────────────┐
            ▼                        ▼                        ▼
     ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
     │   Postgres   │         │   ChromaDB   │         │  Embedding   │
     │  (PostGIS)   │         │ (Vector DB)  │         │   Service    │
     │  Port: 5432  │         │  Port: 8000  │         │  Port: 8002  │
     └──────────────┘         └──────────────┘         └──────────────┘
```

### 1.2. Cấu hình phần cứng tối thiểu & khuyến nghị
| Thành phần | Môi trường Local (Dev) | Môi trường Production |
| :--- | :--- | :--- |
| **CPU** | 2 Cores | 4 Cores trở lên |
| **RAM** | 4 GB | 8 GB - 16 GB |
| **Ổ cứng** | 10 GB SSD | 30 GB SSD (NVMe khuyến nghị) |
| **Hệ điều hành** | Linux / macOS / Windows (WSL2) | Ubuntu 22.04 LTS / Debian 12 |
| **Docker** | Docker Engine 24+ & Compose v2 | Docker Engine 26+ & Compose v2 |

---

## 2. Bảng Đánh Giá Mức Độ Sẵn Sàng (Readiness Checklist)

Trước khi bấm lệnh deploy lên server production, hãy kiểm tra danh sách tiêu chí sau:

- [x] **Mã nguồn Frontend**: Đã test (`npm test`) đạt 100% và build static (`npm run build`) không có lỗi.
- [x] **Mã nguồn Backend**: Đã test (`pytest tests/`) đạt 33/33 test case passed.
- [x] **Bảo mật API Key**: Đã cấu hình `GEMINI_API_KEY` hợp lệ, không hardcode khóa bảo mật vào git.
- [x] **Cơ chế Healthcheck**: Tất cả service đều có healthcheck thăm dò trạng thái sẵn sàng.
- [x] **Tự động khởi động lại**: Container cấu hình `restart: unless-stopped` chống sập dịch vụ.
- [x] **Cô lập dữ liệu**: Sử dụng Docker Named Volumes (`postgres_prod_data`, `chroma_prod_data`, `hf_model_cache`).
- [x] **CORS & Domain**: Đã cấu hình `ALLOWED_ORIGINS` trỏ đúng domain production.

---

## 3. Môi Trường 1: Chạy Phát Triển Cục Bộ (Local Development)

Mục đích: Dành cho lập trình viên cần **Live Reload / HMR (Hot Module Replacement)** khi sửa code Frontend hoặc Backend mà không cần build lại image.

### Bước 1: Chuẩn bị file biến môi trường
```bash
# Tạo file .env cho backend
cp .env.local.example backend/.env
```
Mở `backend/.env` và điền `GEMINI_API_KEY` của bạn:
```env
GEMINI_API_KEY=AIzaSy...
```

### Bước 2: Khởi động các dịch vụ Local
```bash
# Khởi động bằng file compose local
docker compose -f docker-compose.local.yml up --build -d
```

### Bước 3: Truy cập kiểm tra
- 🎨 **Giao diện Frontend (Vite HMR)**: [http://localhost:3000](http://localhost:3000)
- 🚀 **Backend API Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🗄️ **ChromaDB Vector Store**: [http://localhost:8001](http://localhost:8001)
- 🧠 **Embedding Microservice**: [http://localhost:8002/health](http://localhost:8002/health)

### Bước 4: Tắt môi trường Local
```bash
docker compose -f docker-compose.local.yml down
```

---

## 4. Môi Trường 2: Triển Khai Máy Chủ Production (Deploy Server)

Mục đích: Chạy ổn định, đóng gói image độc lập, phục vụ frontend qua Nginx hiệu năng cao, bảo mật dữ liệu.

### Bước 1: Cấu hình biến môi trường Production
Tạo file `.env` trên máy chủ từ mẫu `.env.prod.example`:
```bash
cp .env.prod.example backend/.env
```
Chỉnh sửa các tham số quan trọng:
```env
# 1. Khóa bí mật JWT (tạo chuỗi ngẫu nhiên bằng lệnh: openssl rand -hex 32)
SECRET_KEY=c3b87a9e1d849b29cf...

# 2. Mật khẩu CSDL Postgres an toàn
POSTGRES_PASSWORD=MatKhauBaoMatCucManh_2026!

# 3. Gemini API Key chính thức của dự án
GEMINI_API_KEY=AIzaSyProductionKeyHere...

# 4. Domain hoặc IP máy chủ triển khai
ALLOWED_ORIGINS=["https://daivietkids.edu.vn","http://203.0.113.10"]
```

### Bước 2: Khởi động hệ thống Production
```bash
# Build và chạy ngầm toàn bộ 5 dịch vụ
docker compose -f docker-compose.prod.yml up --build -d
```

### Bước 3: Kiểm tra trạng thái sức khỏe các Container
```bash
docker compose -f docker-compose.prod.yml ps
```
*Tất cả các service phải ở trạng thái `healthy` hoặc `Up`:*
```
NAME                          IMAGE                           STATUS
daivietkids-frontend-prod     rag-history-frontend            Up (healthy)
daivietkids-backend-prod      rag-history-backend             Up (healthy)
daivietkids-postgres-prod     postgis/postgis:15-3.4-alpine   Up (healthy)
daivietkids-chroma-prod       chromadb/chroma:latest          Up (healthy)
daivietkids-embedding-prod    rag-history-embedding_service   Up (healthy)
```

### Bước 4: Cấu hình Nginx Reverse Proxy & SSL (HTTPS) cho Tên Miền
Nếu triển khai sau máy chủ Nginx Host hoặc Cloudflare:
```nginx
server {
    listen 80;
    server_name daivietkids.edu.vn;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name daivietkids.edu.vn;

    ssl_certificate /etc/letsencrypt/live/daivietkids.edu.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/daivietkids.edu.vn/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 5. Quy Trình Kiểm Thử & Nghiệm Thu Hệ Thống (Verification)

### 5.1. Chạy Unit Test Backend trong Container
```bash
docker compose -f docker-compose.prod.yml exec backend pytest tests/ -v
```
Kết quả kỳ vọng: **`33 passed, 3 skipped, 0 failed`**.

### 5.2. Kiểm tra các Endpoint Sức Khỏe (Health Check)
```bash
# 1. Backend API
curl -i http://localhost:8000/health
# {"status":"healthy"}

# 2. Embedding Service
curl -i http://localhost:8002/health
# {"status":"healthy","model_loaded":true}

# 3. Frontend Web
curl -I http://localhost:80
# HTTP/1.1 200 OK
```

### 5.3. Thử nghiệm hỏi đáp RAG Cụ Rùa qua API
```bash
curl -X POST http://localhost:8000/api/v1/rag/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "Vua Hùng dựng nước Văn Lang như thế nào?"}'
```
Kết quả trả về JSON chứa câu trả lời xưng hô Cụ Rùa và danh sách tài liệu tham khảo SGK.

---

## 6. Quản Lý & Sao Lưu Dữ Liệu (Backup & Recovery)

### 6.1. Sao lưu Cơ sở dữ liệu Postgres
```bash
# Backup dữ liệu ra file SQL nén
docker exec -t daivietkids-postgres-prod pg_dump -U postgres daivietkids_db | gzip > backup_db_$(date +%Y%m%d_%H%M%S).sql.gz
```

### 6.2. Phục hồi Cơ sở dữ liệu Postgres
```bash
# Phục hồi từ file backup
gunzip -c backup_db_YYYYMMDD_HHMMSS.sql.gz | docker exec -i daivietkids-postgres-prod psql -U postgres -d daivietkids_db
```

### 6.3. Sao lưu Vector Database ChromaDB
Thư mục lưu trữ vector `chroma_prod_data` có thể được sao lưu trực tiếp:
```bash
docker run --rm -v rag-history_chroma_prod_data:/data -v $(pwd):/backup alpine tar czf /backup/chroma_backup_$(date +%Y%m%d).tar.gz /data
```

---

## 7. Cẩm Nang Xử Lý Sự Cố Thường Gặp (Troubleshooting Runbook)

### Sự cố 1: Backend không thể kết nối Postgres khi vừa khởi động
- **Nguyên nhân**: Postgres đang khởi tạo cấu trúc ban đầu.
- **Khắc phục**: File `docker-compose.prod.yml` đã tích hợp `condition: service_healthy`. Nếu cần kiểm tra thủ công:
  ```bash
  docker compose -f docker-compose.prod.yml logs postgres
  ```

### Sự cố 2: ChromaDB báo lỗi vector rỗng hoặc chưa nạp sách giáo khoa
- **Nguyên nhân**: Lần đầu khởi động chưa chạy seeder dữ liệu.
- **Khắc phục**: Hệ thống tự động nạp khi khởi động. Để nạp lại thủ công:
  ```bash
  docker compose -f docker-compose.prod.yml exec backend python -c "from app.rag.ingestion.seeder import seed_sample_history_data_if_empty; seed_sample_history_data_if_empty()"
  ```

### Sự cố 3: Lỗi giới hạn tốc độ (Rate Limit) từ Gemini API
- **Nguyên nhân**: Sử dụng Gemini Free Tier vượt hạn mức RPM.
- **Khắc phục**:
  1. Cấu hình khóa Gemini trả phí (Pay-as-you-go).
  2. Hệ thống đã tích hợp cơ chế tự động Fallback trích xuất tóm tắt trực tiếp từ SGK khi LLM gặp lỗi, đảm bảo trải nghiệm của học sinh không bị gián đoạn.

### Sự cố 4: Xem log chi tiết từng dịch vụ khi phát sinh lỗi
```bash
# Xem log thời gian thực của backend
docker compose -f docker-compose.prod.yml logs -f --tail=100 backend

# Xem log của frontend Nginx
docker compose -f docker-compose.prod.yml logs -f --tail=100 frontend

# Xem log của dịch vụ embedding
docker compose -f docker-compose.prod.yml logs -f --tail=100 embedding_service
```
