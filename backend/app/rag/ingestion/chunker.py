import re
from typing import List, Dict, Any


class DummyChunkDoc:
    def __init__(self, page_content: str, metadata: dict = None):
        self.page_content = page_content
        self.metadata = metadata or {}


class SemanticChunker:
    """
    Tách tài liệu Markdown theo các tiêu đề (#, ##, ###) và đoạn văn,
    giữ trọn vẹn ngữ nghĩa từng phần kèm metadata Header 1, Header 2, Header 3.
    Loại bỏ triệt để hiện tượng phân mảnh chunk rác (<20 token) do tiêu đề rỗng,
    đồng thời bổ sung Breadcrumb ngữ cảnh vào đầu mỗi chunk để tối ưu hóa vector retrieval.
    """
    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 100,
        min_chunk_chars: int = 0,
        include_header_breadcrumb: bool = True,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.min_chunk_chars = min_chunk_chars
        self.include_header_breadcrumb = include_header_breadcrumb

    def _split_long_paragraph(self, text: str) -> List[str]:
        """Cắt đoạn văn quá dài ưu tiên theo dấu câu tiếng Việt hoặc theo từ."""
        if len(text) <= self.chunk_size:
            return [text]

        # Cố gắng tách theo ranh giới câu
        sentence_endings = re.compile(r'(?<=[.!?])\s+')
        sentences = sentence_endings.split(text)
        sub_chunks = []
        cur_chunk = []
        cur_len = 0

        for s in sentences:
            s_len = len(s)
            if cur_len + s_len + 1 > self.chunk_size and cur_chunk:
                sub_chunks.append(" ".join(cur_chunk).strip())
                cur_chunk = [s]
                cur_len = s_len
            else:
                cur_chunk.append(s)
                cur_len += s_len + 1

        if cur_chunk:
            sub_chunks.append(" ".join(cur_chunk).strip())

        # Nếu có câu đơn lẻ vẫn dài hơn chunk_size, fallback cắt theo bước overlap
        final_splits = []
        step = max(1, self.chunk_size - self.chunk_overlap)
        for chunk in sub_chunks:
            if len(chunk) <= self.chunk_size:
                final_splits.append(chunk)
            else:
                for i in range(0, len(chunk), step):
                    part = chunk[i:i + self.chunk_size].strip()
                    if part:
                        final_splits.append(part)

        return final_splits

    def _split_section_content(self, content: str, prefix: str, meta: Dict[str, Any]) -> List[DummyChunkDoc]:
        """Chia nhỏ một section thành các DummyChunkDoc kế thừa prefix breadcrumb và metadata."""
        full_text = f"{prefix}{content}" if prefix else content
        if len(full_text) <= self.chunk_size:
            return [DummyChunkDoc(page_content=full_text, metadata=dict(meta))]

        # Tách theo đoạn văn kép (\n\n)
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
        chunks: List[DummyChunkDoc] = []
        current_paragraphs: List[str] = []
        prefix_len = len(prefix)
        current_len = prefix_len

        for p in paragraphs:
            p_len = len(p)
            # Nếu bản thân 1 đoạn văn dài hơn chunk_size
            if prefix_len + p_len > self.chunk_size:
                if current_paragraphs:
                    chunk_text = (prefix + "\n\n".join(current_paragraphs)).strip()
                    chunks.append(DummyChunkDoc(page_content=chunk_text, metadata=dict(meta)))
                    current_paragraphs = []
                    current_len = prefix_len

                long_parts = self._split_long_paragraph(p)
                for part in long_parts:
                    chunk_text = (prefix + part).strip()
                    chunks.append(DummyChunkDoc(page_content=chunk_text, metadata=dict(meta)))
            elif current_len + p_len + 2 > self.chunk_size and current_paragraphs:
                chunk_text = (prefix + "\n\n".join(current_paragraphs)).strip()
                chunks.append(DummyChunkDoc(page_content=chunk_text, metadata=dict(meta)))
                current_paragraphs = [p]
                current_len = prefix_len + p_len
            else:
                current_paragraphs.append(p)
                current_len += p_len + 2

        if current_paragraphs:
            chunk_text = (prefix + "\n\n".join(current_paragraphs)).strip()
            chunks.append(DummyChunkDoc(page_content=chunk_text, metadata=dict(meta)))

        return chunks

    def chunk_text(self, markdown_text: str) -> List[DummyChunkDoc]:
        if not markdown_text or not markdown_text.strip():
            return []

        lines = markdown_text.split('\n')
        raw_sections: List[Dict[str, Any]] = []
        
        current_headers: Dict[str, str] = {}
        current_body_lines: List[str] = []

        for line in lines:
            h1_match = re.match(r'^#\s+(.+)$', line)
            h2_match = re.match(r'^##\s+(.+)$', line)
            h3_match = re.match(r'^###\s+(.+)$', line)

            if h1_match or h2_match or h3_match:
                # Chỉ đóng gói section trước đó khi có body text thực tế
                body_content = "\n".join(current_body_lines).strip()
                if body_content:
                    raw_sections.append({
                        "content": body_content,
                        "headers": dict(current_headers)
                    })
                current_body_lines = []

                if h1_match:
                    current_headers = {"Header 1": h1_match.group(1).strip()}
                elif h2_match:
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
            else:
                if line.strip():
                    current_body_lines.append(line)
                elif current_body_lines and current_body_lines[-1] != "":
                    current_body_lines.append("")

        body_content = "\n".join(current_body_lines).strip()
        if body_content:
            raw_sections.append({
                "content": body_content,
                "headers": dict(current_headers)
            })

        if not raw_sections:
            return []

        # Tối ưu hóa: Merge các section cực ngắn vào section trước đó nếu cùng ngữ cảnh
        merged_sections: List[Dict[str, Any]] = []
        for sec in raw_sections:
            if (
                merged_sections
                and len(sec["content"]) < self.min_chunk_chars
                and merged_sections[-1]["headers"].get("Header 1") == sec["headers"].get("Header 1")
                and len(merged_sections[-1]["content"]) + len(sec["content"]) + 4 <= self.chunk_size
            ):
                # Gộp nội dung ngắn vào section trước
                merged_sections[-1]["content"] += f"\n\n{sec['content']}"
            else:
                merged_sections.append(sec)

        docs: List[DummyChunkDoc] = []
        for sec in merged_sections:
            meta = dict(sec["headers"])
            title = meta.get("Header 3") or meta.get("Header 2") or meta.get("Header 1") or "Phần chung"
            meta["section_title"] = title

            # Xây dựng breadcrumb ngữ cảnh nếu bật include_header_breadcrumb
            prefix = ""
            if self.include_header_breadcrumb:
                h_parts = [v for k, v in sorted(meta.items()) if k.startswith("Header ") and v]
                if h_parts:
                    breadcrumb = " > ".join(h_parts)
                    prefix = f"### {breadcrumb}\n\n"

            sub_docs = self._split_section_content(sec["content"], prefix, meta)
            docs.extend(sub_docs)

        return docs

