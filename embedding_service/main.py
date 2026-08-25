import os
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from contextlib import asynccontextmanager

# Configure PyTorch CPU thread count to maximize multi-core performance
torch.set_num_threads(max(1, min(os.cpu_count() or 4, 8)))

MODEL_NAME = os.environ.get("EMBEDDING_MODEL_NAME", "microsoft/harrier-oss-v1-0.6b")
MAX_SEQ_LENGTH = int(os.environ.get("MAX_SEQ_LENGTH", "512"))
model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    print(f"Loading embedding model '{MODEL_NAME}' (max_seq_length={MAX_SEQ_LENGTH})...")
    
    # Load model with float32 for fast CPU inference
    model_kwargs = {"torch_dtype": torch.float32} if "harrier" in MODEL_NAME.lower() else {}
    model = SentenceTransformer(MODEL_NAME, model_kwargs=model_kwargs)
    
    # TỐI ƯU QUAN TRỌNG: Giới hạn max_seq_length từ 32,768 (mặc định) xuống 512 tokens
    # Giúp tăng tốc độ CPU lên hơn 30x (từ 8.5 phút xuống ~10-15s cho 200 chunks)
    model.max_seq_length = MAX_SEQ_LENGTH
    
    print(f"✅ Model '{MODEL_NAME}' loaded successfully (max_seq_length={model.max_seq_length}).")
    yield
    model = None
    print("Model unloaded.")

app = FastAPI(title="Embedding Service", lifespan=lifespan)

class EmbedRequest(BaseModel):
    texts: list[str]

class EmbedResponse(BaseModel):
    embeddings: list[list[float]]

@app.post("/embed", response_model=EmbedResponse)
async def embed_texts(request: EmbedRequest):
    if not request.texts:
        return EmbedResponse(embeddings=[])
    
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet.")

    try:
        n = len(request.texts)
        print(f"[EmbedService] Encoding {n} texts with batch_size=32...")
        with torch.inference_mode():
            embeddings = model.encode(
                request.texts,
                batch_size=32,
                show_progress_bar=(n > 20),
                convert_to_numpy=True,
                normalize_embeddings=True,
            )
        print(f"[EmbedService] ✅ Done {n} texts.")
        return EmbedResponse(embeddings=embeddings.tolist())
    except Exception as e:
        print(f"[EmbedService] Error encoding: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model": MODEL_NAME,
        "max_seq_length": MAX_SEQ_LENGTH,
        "model_loaded": model is not None
    }
