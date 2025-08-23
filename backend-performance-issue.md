# 백엔드 성능 이슈

## 문제
`/api/v1/meari/sessions` POST 엔드포인트가 60초 이상 걸려서 타임아웃 발생

## 임시 해결
- 프론트엔드 타임아웃을 60초 → 120초로 증가
- 사용자에게 대기 시간 안내 (1-2분)

## 백엔드 최적화 필요사항

### 1. 성능 분석
```python
import time
import logging

@router.post("/sessions")
async def create_session(request: SessionCreateRequest, ...):
    start_time = time.time()
    
    # 각 단계별 시간 측정
    step1_start = time.time()
    # ... 처리 로직
    logging.info(f"Step 1 took: {time.time() - step1_start}s")
    
    # 전체 시간
    logging.info(f"Total time: {time.time() - start_time}s")
```

### 2. 비동기 처리 개선
```python
# 병렬 처리 가능한 작업 식별
async def create_session(...):
    # 병렬로 실행 가능한 작업들
    results = await asyncio.gather(
        create_cards_async(),
        generate_persona_async(),
        fetch_external_data_async()
    )
```

### 3. 캐싱 추가
```python
from functools import lru_cache
import redis

# Redis 캐싱
redis_client = redis.Redis(...)

@lru_cache(maxsize=100)
def get_cached_data(key):
    cached = redis_client.get(key)
    if cached:
        return json.loads(cached)
    return None
```

### 4. 데이터베이스 쿼리 최적화
```python
# N+1 문제 해결
from sqlalchemy.orm import selectinload

# Before
sessions = await db.query(Session).all()
for session in sessions:
    cards = await db.query(Card).filter(Card.session_id == session.id).all()

# After
sessions = await db.query(Session).options(
    selectinload(Session.cards)
).all()
```

### 5. 백그라운드 처리
```python
from celery import Celery

# 즉시 응답하고 백그라운드에서 처리
@router.post("/sessions")
async def create_session(...):
    # 빠른 초기 응답
    session_id = str(uuid.uuid4())
    
    # 백그라운드 작업 시작
    celery_task.delay(session_id, request.dict())
    
    # 즉시 응답
    return {
        "session_id": session_id,
        "status": "processing",
        "message": "세션 생성 중입니다. 잠시 후 다시 확인해주세요."
    }

# 상태 확인 엔드포인트
@router.get("/sessions/{session_id}/status")
async def check_session_status(session_id: str):
    # Redis에서 상태 확인
    status = redis_client.get(f"session:{session_id}:status")
    return {"status": status}
```

### 6. API 응답 스트리밍
```python
from fastapi.responses import StreamingResponse

@router.post("/sessions")
async def create_session(...):
    async def generate():
        yield '{"status": "starting"}\n'
        
        # 단계별 처리
        persona = await create_persona()
        yield f'{{"status": "persona_created", "data": {json.dumps(persona)}}}\n'
        
        cards = await create_cards()
        yield f'{{"status": "cards_created", "data": {json.dumps(cards)}}}\n'
        
        yield '{"status": "completed"}\n'
    
    return StreamingResponse(generate(), media_type="application/x-ndjson")
```

## 권장 사항
1. **단기**: 로깅 추가하여 병목 지점 파악
2. **중기**: 비동기 처리 및 캐싱 구현
3. **장기**: 백그라운드 작업 큐 도입 (Celery, RQ 등)

## 모니터링 도구
- New Relic APM
- DataDog
- Prometheus + Grafana
- FastAPI 내장 프로파일러

```bash
# 프로파일링 실행
python -m cProfile -o profile.prof main.py
python -m pstats profile.prof
```