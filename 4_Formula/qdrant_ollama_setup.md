# 🔧 Qdrant & Ollama Setup — Local Vector Search

> Use Qdrant and Ollama with `nomic-embed-text` (4096 context window) to enable semantic search over barrier duty documents and schedules.

---

## 📋 Overview

| Component | Role |
|-----------|------|
| **Ollama** | Local LLM runner — serves the `nomic-embed-text` embedding model |
| **Qdrant** | Vector database — stores and searches embeddings |
| **nomic-embed-text** | Embedding model — 4096 token context, 768-dim vectors |

---

## 🐳 Docker Compose Setup

Create a `docker-compose.yml` in your project root (or a `devops/` folder):

```yaml
version: "3.9"
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage
    restart: unless-stopped

volumes:
  ollama_data:
  qdrant_data:
```

---

## 🚀 Running the Containers

```bash
# Start both services
docker compose up -d

# Pull the nomic-embed-text model into Ollama
docker exec -it ollama ollama pull nomic-embed-text

# Verify Ollama is running
curl http://localhost:11434/api/tags

# Verify Qdrant is running
curl http://localhost:6333/healthz
```

---

## 🧩 Creating a Qdrant Collection

```bash
curl -X PUT http://localhost:6333/collections/barrier_duty \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 768,
      "distance": "Cosine"
    }
  }'
```

---

## 📥 Embedding Documents with Ollama

```python
import requests, json

def embed(text: str) -> list[float]:
    resp = requests.post(
        "http://localhost:11434/api/embeddings",
        json={"model": "nomic-embed-text", "prompt": text}
    )
    return resp.json()["embedding"]

# Example: embed a shift description
vec = embed("Morning barrier duty Monday 8:30 AM - Sarah J.")
print(f"Embedding dimensions: {len(vec)}")  # 768
```

---

## 🔍 Inserting & Searching in Qdrant

```python
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

client = QdrantClient(host="localhost", port=6333)

# Insert a document
client.upsert(
    collection_name="barrier_duty",
    points=[
        PointStruct(
            id=1,
            vector=embed("Morning barrier duty Monday 8:30 AM - Sarah J."),
            payload={"shift": "morning", "date": "2026-02-17", "volunteer": "Sarah J."}
        )
    ]
)

# Search for similar shifts
results = client.search(
    collection_name="barrier_duty",
    query_vector=embed("Who is on morning duty this week?"),
    limit=5
)
for r in results:
    print(r.payload)
```

---

## ⚙️ Environment Variables

Add to your `.env` file (see `.env.example`):

```env
OLLAMA_BASE_URL=http://localhost:11434
QDRANT_URL=http://localhost:6333
EMBED_MODEL=nomic-embed-text
COLLECTION_NAME=barrier_duty
```

---

## 📚 References

- [Ollama Docs](https://ollama.ai/docs)
- [Qdrant Docs](https://qdrant.tech/documentation/)
- [nomic-embed-text on Ollama Hub](https://ollama.ai/library/nomic-embed-text)

---

## 🔗 See Also
- [2_Environment — AI Clients](../2_Environment/README.md#-ai-clients)
- [4_Formula README](README.md)
