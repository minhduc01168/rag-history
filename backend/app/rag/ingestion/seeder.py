import os
import glob
from app.rag.ingestion.vector_store import ChromaManager
from app.rag.ingestion.chunker import SemanticChunker


def seed_sample_history_data_if_empty():
    """
    Tự động nạp dữ liệu Lịch sử SGK mẫu vào ChromaDB nếu collection đang rỗng.
    Giúp Cụ Rùa luôn có sẵn dữ liệu SGK Lớp 4 & 5 ngay khi khởi động.
    """
    try:
        cm = ChromaManager()
        count = cm.collection.count()
        if count > 0:
            print(f"[Seeder] ChromaDB đã có sẵn {count} chunks. Bỏ qua auto-seed.")
            return

        print("[Seeder] 🚀 ChromaDB đang rỗng. Bắt đầu tự động nạp dữ liệu SGK Lịch sử 4 & 5...")
        chunker = SemanticChunker()

        candidate_dirs = [
            "/markdowns/sample_history_data",
            "/app/../markdowns/sample_history_data",
            "/app/markdowns/sample_history_data",
            "../markdowns/sample_history_data",
            "./markdowns/sample_history_data",
            "/home/mypc/rag-history/markdowns/sample_history_data",
        ]
        sample_dir = None
        for d in candidate_dirs:
            if os.path.exists(d) and os.path.isdir(d):
                sample_dir = d
                break

        if not sample_dir:
            print("[Seeder] ⚠️ Không tìm thấy thư mục markdowns/sample_history_data")
            return

        all_docs = []

        class DummyDoc:
            def __init__(self, page_content, metadata):
                self.page_content = page_content
                self.metadata = metadata

        md_files = sorted(glob.glob(os.path.join(sample_dir, "*.md")))
        for fpath in md_files:
            fname = os.path.basename(fpath)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                splits = chunker.chunk_text(content)
                for split in splits:
                    meta = dict(split.metadata) if split.metadata else {}
                    meta["source_file"] = fname
                    meta["status"] = "ready"
                    all_docs.append(DummyDoc(split.page_content, meta))
            except Exception as fe:
                print(f"[Seeder] Lỗi đọc file {fname}: {fe}")

        if all_docs:
            cm.add_documents(all_docs)
            print(f"[Seeder] ✅ Đã nạp thành công {len(all_docs)} chunks từ {len(md_files)} bài học SGK Lịch sử!")
        else:
            print("[Seeder] Không tìm thấy dữ liệu để nạp.")
    except Exception as e:
        print(f"[Seeder] ⚠️ Lỗi trong quá trình auto-seed: {e}")
