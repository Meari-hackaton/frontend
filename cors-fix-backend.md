# 백엔드 CORS 설정 수정 가이드

## 문제 상황
- OPTIONS preflight 요청이 실패
- 프론트엔드: http://ec2-43-200-4-71.ap-northeast-2.compute.amazonaws.com
- 백엔드: http://ec2-13-125-128-95.ap-northeast-2.compute.amazonaws.com:8000

## 해결 방법

### 1. main.py 수정

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정 - 순서 중요! 다른 미들웨어보다 먼저 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://ec2-43-200-4-71.ap-northeast-2.compute.amazonaws.com",
        "http://43.200.4.71"  # IP 직접 접근도 허용
    ],
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
    expose_headers=["*"]  # 응답 헤더 노출
)
```

### 2. 또는 개발 중에는 모든 origin 허용 (보안 주의)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="http://.*",  # 모든 http origin 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)
```

### 3. nginx 사용 시 추가 설정

/etc/nginx/sites-available/default:

```nginx
server {
    listen 8000;
    
    location / {
        # CORS 헤더 추가
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '$http_origin' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. FastAPI 앱 재시작

```bash
# EC2에서
sudo systemctl restart your-app-service
# 또는
sudo supervisorctl restart your-app
# 또는 직접 실행 중이면
pkill -f uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. 테스트 방법

```bash
# preflight 요청 테스트
curl -X OPTIONS \
  http://ec2-13-125-128-95.ap-northeast-2.compute.amazonaws.com:8000/api/v1/meari/sessions \
  -H "Origin: http://ec2-43-200-4-71.ap-northeast-2.compute.amazonaws.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  -v
```

응답에 다음 헤더들이 포함되어야 함:
- Access-Control-Allow-Origin: http://ec2-43-200-4-71.ap-northeast-2.compute.amazonaws.com
- Access-Control-Allow-Credentials: true
- Access-Control-Allow-Methods: POST (또는 *)
- Access-Control-Allow-Headers: content-type (또는 *)