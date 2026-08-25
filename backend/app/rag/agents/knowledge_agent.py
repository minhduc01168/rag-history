from app.rag.retrieval.hybrid_search import HybridSearcher
from app.rag.retrieval.reranker import Reranker
from app.rag.ingestion.vector_store import ChromaManager


class KnowledgeAgent:
    """
    Agent chuyên phụ trách tra cứu thông tin từ Sách giáo khoa Lịch sử Lớp 4 & 5.
    Sử dụng kiến trúc Advanced RAG: Semantic Search với ChromaDB + BM25 + Reranking.
    """
    def __init__(self, chroma_manager: ChromaManager = None, use_reranker: bool = True):
        self.chroma_manager = chroma_manager or ChromaManager()
        self.hybrid_searcher = None
        self.last_doc_count = 0
        self._refresh_hybrid_searcher()

        # Khởi tạo Reranker (nếu dùng)
        self.reranker = Reranker(mock=False) if use_reranker else None

    def _refresh_hybrid_searcher(self):
        """Khởi tạo hoặc cập nhật BM25 index khi có tài liệu mới."""
        try:
            all_data = self.chroma_manager.get_all_documents()
            documents = all_data.get("documents", []) if all_data else []
            if documents and len(documents) != self.last_doc_count:
                self.hybrid_searcher = HybridSearcher(documents)
                self.last_doc_count = len(documents)
        except Exception as e:
            print(f"[KnowledgeAgent] Không thể refresh hybrid searcher: {e}")

    def answer_query(self, query: str) -> dict:
        """
        Xử lý câu hỏi bằng kiến thức nội bộ (Advanced RAG).
        """
        try:
            self._refresh_hybrid_searcher()

            # 1. Semantic Search (Vector) từ ChromaDB
            results = self.chroma_manager.search(query, n_results=10)
            vector_docs = []
            if results and "documents" in results and results["documents"]:
                metadatas = results.get("metadatas", [[]])[0]
                for i, doc in enumerate(results["documents"][0]):
                    meta = metadatas[i] if i < len(metadatas) else {}
                    vector_docs.append({"text": doc, "metadata": meta})

            # 2. Keyword Search (BM25)
            bm25_docs = []
            if self.hybrid_searcher:
                bm25_docs = self.hybrid_searcher.keyword_search(query, top_k=10)

            # Nếu cả 2 đều rỗng thì báo lỗi
            if not vector_docs and not bm25_docs:
                return {"answer": "", "sources": []}

            # 3. Reciprocal Rank Fusion (RRF)
            if self.hybrid_searcher:
                fused_docs = self.hybrid_searcher.rrf_fusion(bm25_docs, vector_docs)
            else:
                fused_docs = vector_docs

            # 4. Reranking bằng Cross-Encoder
            if self.reranker and fused_docs:
                final_docs = self.reranker.rerank(query, fused_docs, top_k=3)
            else:
                final_docs = fused_docs[:3]

            # 5. Tổng hợp câu trả lời
            context_str = "\n".join([doc["text"] for doc in final_docs if doc.get("text")])

            # Tạo danh sách nguồn trích dẫn: ưu tiên tên file, fallback sang text snippet
            seen = set()
            sources = []
            for doc in final_docs:
                meta = doc.get("metadata", {})
                src = meta.get("source_file") if meta else None
                if not src:
                    src = doc.get("text", "")[:80] + "..."
                if src not in seen:
                    seen.add(src)
                    sources.append(src)

            return {
                "answer": context_str,
                "sources": sources
            }
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Error querying Knowledge Base: {e}")
            return {"answer": "", "sources": []}
