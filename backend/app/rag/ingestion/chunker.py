import re
from typing import List, Dict, Any


class DummyChunkDoc:
    def __init__(self, page_content: str, metadata: dict = None):
        self.page_content = page_content
        self.metadata = metadata or {}


class SemanticChunker:
    """
    Tách tài liệu Markdown theo các tiêu đề (#, ##, ###) và đoạn văn một cách nhanh chóng,
    giữ trọn vẹn ngữ nghĩa từng phần kèm metadata Header 1, Header 2, Header 3.
    """
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def _split_long_text(self, text: str, meta: Dict[str, Any]) -> List[DummyChunkDoc]:
        """Chia nhỏ một đoạn văn bản dài hơn chunk_size thành các chunks kế thừa metadata."""
        if len(text) <= self.chunk_size:
            return [DummyChunkDoc(page_content=text, metadata=dict(meta))]

        # Tách theo đoạn văn
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = []
        current_len = 0

        for p in paragraphs:
            p_len = len(p)
            if p_len > self.chunk_size:
                # Nếu chính đoạn văn p lớn hơn chunk_size, cắt theo câu hoặc từ
                if current_chunk:
                    chunks.append(DummyChunkDoc(page_content="\n\n".join(current_chunk), metadata=dict(meta)))
                    current_chunk = []
                    current_len = 0
                
                # Cắt p theo độ dài chunk_size
                step = max(1, self.chunk_size - self.chunk_overlap)
                for i in range(0, len(p), step):
                    sub_text = p[i:i + self.chunk_size].strip()
                    if sub_text:
                        chunks.append(DummyChunkDoc(page_content=sub_text, metadata=dict(meta)))
            elif current_len + p_len > self.chunk_size and current_chunk:
                chunks.append(DummyChunkDoc(page_content="\n\n".join(current_chunk), metadata=dict(meta)))
                current_chunk = [p]
                current_len = p_len
            else:
                current_chunk.append(p)
                current_len += p_len + 2

        if current_chunk:
            chunks.append(DummyChunkDoc(page_content="\n\n".join(current_chunk), metadata=dict(meta)))

        return chunks

    def chunk_text(self, markdown_text: str) -> List[DummyChunkDoc]:
        if not markdown_text or not markdown_text.strip():
            return []

        # Tách các section theo markdown headers (#, ##, ###)
        # Giữ lại delimiter bằng regex split
        lines = markdown_text.split('\n')
        sections: List[Dict[str, Any]] = []
        
        current_headers: Dict[str, str] = {}
        current_lines: List[str] = []

        for line in lines:
            h1_match = re.match(r'^#\s+(.+)$', line)
            h2_match = re.match(r'^##\s+(.+)$', line)
            h3_match = re.match(r'^###\s+(.+)$', line)

            if h1_match or h2_match or h3_match:
                if current_lines:
                    content = "\n".join(current_lines).strip()
                    if content:
                        sections.append({
                            "content": content,
                            "headers": dict(current_headers)
                        })
                    current_lines = []

                if h1_match:
                    current_headers = {"Header 1": h1_match.group(1).strip()}
                elif h2_match:
                    # Giữ Header 1 nếu có
                    h1 = current_headers.get("Header 1")
                    current_headers = {}
                    if h1:
                        current_headers["Header 1"] = h1
                    current_headers["Header 2"] = h2_match.group(1).strip()
                elif h3_match:
                    h1 = current_headers.get("Header 1")
                    h2 = current_headers.get("Header 2")
                    current_headers = {}
                    if h1:
                        current_headers["Header 1"] = h1
                    if h2:
                        current_headers["Header 2"] = h2
                    current_headers["Header 3"] = h3_match.group(1).strip()
                
                current_lines.append(line)
            else:
                current_lines.append(line)

        if current_lines:
            content = "\n".join(current_lines).strip()
            if content:
                sections.append({
                    "content": content,
                    "headers": dict(current_headers)
                })

        docs: List[DummyChunkDoc] = []
        for sec in sections:
            meta = dict(sec["headers"])
            # Thêm section_title cho tương thích
            title = meta.get("Header 3") or meta.get("Header 2") or meta.get("Header 1") or "Phần chung"
            meta["section_title"] = title
            
            content = sec["content"]
            sub_docs = self._split_long_text(content, meta)
            docs.extend(sub_docs)

        return docs

