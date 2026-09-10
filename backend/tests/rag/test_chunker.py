from app.rag.ingestion.chunker import SemanticChunker

def test_semantic_chunker_empty():
    chunker = SemanticChunker()
    assert chunker.chunk_text("") == []
    assert chunker.chunk_text("   ") == []

def test_semantic_chunker_headers():
    markdown_text = """# Giới thiệu
Đây là phần giới thiệu.

## Chi tiết
Đây là chi tiết. Đoạn này cũng khá ngắn.

### Cảnh báo
Cần chú ý an toàn!
"""
    chunker = SemanticChunker(chunk_size=100, chunk_overlap=10)
    docs = chunker.chunk_text(markdown_text)
    
    assert len(docs) == 3
    assert "Header 1" in docs[0].metadata
    assert docs[0].metadata["Header 1"] == "Giới thiệu"
    assert "Header 2" in docs[1].metadata
    assert docs[1].metadata["Header 2"] == "Chi tiết"

def test_semantic_chunker_long_text():
    markdown_text = "# Lịch sử\n" + ("A " * 600)  # > 1000 chars
    chunker = SemanticChunker(chunk_size=500, chunk_overlap=50)
    docs = chunker.chunk_text(markdown_text)
    
    # Do text dài hơn 1000 char và chunk_size=500 nên nó phải cắt ra thành nhiều đoạn
    assert len(docs) >= 2
    # Metadata Header 1 phải được kế thừa sang tất cả các đoạn con
    assert all(doc.metadata.get("Header 1") == "Lịch sử" for doc in docs)


def test_semantic_chunker_empty_header_not_split():
    """Header H1 không có body text trước H2 không được phép sinh thành chunk rác riêng."""
    markdown_text = """# Thời Hùng Vương và Nhà nước Văn Lang

## 1. Nguồn gốc dân tộc
Ngày xửa ngày xưa ở vùng đất Lạc Việt có Lạc Long Quân và Âu Cơ sinh ra bọc trăm trứng.

## 2. Tổ chức nhà nước
Nhà nước Văn Lang ra đời cách đây khoảng 2700 năm, đóng đô ở Phong Châu.
"""
    chunker = SemanticChunker()
    docs = chunker.chunk_text(markdown_text)

    # Chỉ có 2 section thực sự mang nội dung, không có chunk độc lập chỉ chứa '# Thời Hùng Vương...'
    assert len(docs) == 2
    assert docs[0].metadata["Header 1"] == "Thời Hùng Vương và Nhà nước Văn Lang"
    assert docs[0].metadata["Header 2"] == "1. Nguồn gốc dân tộc"
    # Kiểm tra breadcrumb ngữ cảnh có mặt trong page_content
    assert "Thời Hùng Vương và Nhà nước Văn Lang > 1. Nguồn gốc dân tộc" in docs[0].page_content
    assert all(len(d.page_content.split()) >= 15 for d in docs)


def test_semantic_chunker_min_chunk_merge():
    """Kiểm tra tính năng merge section ngắn nếu min_chunk_chars > 0."""
    markdown_text = """# Bài học

## Mục 1
Đoạn này có độ dài bình thường và đầy đủ ý nghĩa cho việc học tập.

## Mục 2
Quá ngắn.
"""
    chunker = SemanticChunker(min_chunk_chars=50)
    docs = chunker.chunk_text(markdown_text)

    # Mục 2 quá ngắn (<50 ký tự) nên được gộp vào Mục 1
    assert len(docs) == 1
    assert "Quá ngắn." in docs[0].page_content
