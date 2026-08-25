import os
import time
import uuid
import chromadb
import requests
from chromadb import Documents, EmbeddingFunction, Embeddings

class CustomHTTPEmbeddingFunction(EmbeddingFunction):
    def __init__(self, api_url: str, timeout: int = 5):
        self.api_url = api_url
        self.timeout = timeout

    def __call__(self, input: Documents) -> Embeddings:
        n = len(input)
        print(f"[Embedding] Đang encode {n} chunks...")
        t0 = time.time()
        try:
            response = requests.post(
                self.api_url,
                json={"texts": input},
                timeout=self.timeout
            )
            response.raise_for_status()
            elapsed = time.time() - t0
            print(f"[Embedding] ✅ Hoàn thành {n} chunks trong {elapsed:.2f}s ({elapsed/max(1,n):.3f}s/chunk)")
            return response.json()["embeddings"]
        except Exception as e:
            print(f"[Embedding] ⚠️ Không thể kết nối embedding service tại {self.api_url}: {e}. Sử dụng mock vectors cho offline/testing!")
            import hashlib
            mock_vecs = []
            for t in input:
                vec = [0.0] * 640
                for w in t.lower().split():
                    idx = int(hashlib.md5(w.encode('utf-8')).hexdigest(), 16) % 640
                    vec[idx] += 1.0
                mock_vecs.append(vec)
            return mock_vecs

class ChromaManager:
    """
    Quản lý việc lưu trữ các Document Chunks vào ChromaDB.
    """
    def __init__(self, persist_directory="./.chroma", collection_name="history_knowledge"):
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        
        # Khởi tạo client: Sử dụng HttpClient nếu có CHROMA_HOST khác localhost (trong Docker Compose)
        chroma_host = os.environ.get("CHROMA_HOST", "localhost")
        chroma_port = int(os.environ.get("CHROMA_PORT", "8000"))
        
        if chroma_host and chroma_host != "localhost":
            print(f"[ChromaDB] Kết nối tới ChromaDB server qua HTTP tại {chroma_host}:{chroma_port}...")
            self.client = chromadb.HttpClient(host=chroma_host, port=chroma_port)
        else:
            print(f"[ChromaDB] Khởi tạo PersistentClient tại thư mục {self.persist_directory}...")
            self.client = chromadb.PersistentClient(path=self.persist_directory)
        
        # Sử dụng microservice cho embedding
        default_embed = "http://embedding_service:8002/embed" if (chroma_host and chroma_host != "localhost") else "http://localhost:8002/embed"
        embedding_url = os.environ.get("EMBEDDING_SERVICE_URL", default_embed)
        self.embedding_fn = CustomHTTPEmbeddingFunction(api_url=embedding_url)
        
        # Tạo hoặc lấy collection
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self.embedding_fn
        )

    def add_documents(self, docs):
        """
        Nhận vào danh sách các Document và lưu vào ChromaDB theo từng batch (tránh timeout/treo).
        """
        if not docs:
            return

        documents = []
        metadatas = []
        ids = []

        for i, doc in enumerate(docs):
            documents.append(doc.page_content)
            metadatas.append(doc.metadata if doc.metadata else {"source": "unknown"})
            ids.append(str(uuid.uuid4()))

        total_chunks = len(docs)
        batch_size = 10
        print(f"[ChromaDB] Bắt đầu lưu {total_chunks} chunks (batch_size={batch_size})...")
        t_start = time.time()

        for start_idx in range(0, total_chunks, batch_size):
            end_idx = min(start_idx + batch_size, total_chunks)
            b_docs = documents[start_idx:end_idx]
            b_meta = metadatas[start_idx:end_idx]
            b_ids = ids[start_idx:end_idx]
            
            print(f"[ChromaDB] -> Đang thêm batch {start_idx + 1}-{end_idx}/{total_chunks}...")
            self.collection.add(
                documents=b_docs,
                metadatas=b_meta,
                ids=b_ids
            )

        t_total = time.time() - t_start
        print(f"[ChromaDB] ✅ Đã lưu thành công {total_chunks} chunks vào '{self.collection_name}' trong {t_total:.2f}s")

    def search(self, query: str, n_results: int = 3):
        """
        Tìm kiếm semantic cơ bản.
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            include=['documents', 'metadatas', 'distances'],
        )
        return results

    def get_all_documents(self):
        """
        Lấy toàn bộ documents từ collection để phục vụ BM25 indexing.
        """
        try:
            return self.collection.get()
        except Exception as e:
            print(f"Error fetching all documents: {e}")
            return {"documents": [], "metadatas": [], "ids": []}
