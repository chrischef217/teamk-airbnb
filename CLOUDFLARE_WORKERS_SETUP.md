# 🚀 Cloudflare Workers & D1 배포 가이드

Teamk 시스템을 위한 완전한 Cloudflare 인프라 설정 가이드입니다.

## 📋 **사전 준비사항**

1. ✅ Cloudflare 계정 ([cloudflare.com](https://cloudflare.com))
2. ✅ Node.js 설치 ([nodejs.org](https://nodejs.org))
3. ✅ GitHub 계정 및 저장소
4. ✅ Cloudflare API 키 입력 완료

## 🔧 **1단계: Wrangler CLI 설치**

```bash
# Wrangler CLI 전역 설치
npm install -g wrangler

# Cloudflare 로그인
wrangler auth login
```

## 🗄️ **2단계: D1 데이터베이스 생성**

```bash
# D1 데이터베이스 생성
wrangler d1 create teamk-data

# 출력에서 database_id 복사하여 wrangler.toml 파일 업데이트
```

**출력 예시:**
```
✅ Successfully created DB 'teamk-data' in region APAC
Created your database using D1's new storage backend.

[[d1_databases]]
binding = "TEAMK_DB"
database_name = "teamk-data" 
database_id = "abcd1234-5678-90ef-ghij-klmnopqrstuv" # 이 ID를 복사
```

### wrangler.toml 업데이트
생성된 `database_id`를 `wrangler.toml` 파일에 입력:

```toml
[[d1_databases]]
binding = "TEAMK_DB"
database_name = "teamk-data"
database_id = "여기에-실제-데이터베이스-ID-입력"
```

## 🏗️ **3단계: 데이터베이스 초기화**

```bash
# SQL 스키마 실행
wrangler d1 execute teamk-data --file=./sql/init.sql

# 테이블 생성 확인
wrangler d1 execute teamk-data --command="SELECT name FROM sqlite_master WHERE type='table'"
```

## 🚀 **4단계: Workers 배포**

```bash
# Workers 배포
wrangler deploy

# 배포 성공 시 URL 확인 (예: https://teamk-api.your-subdomain.workers.dev)
```

## 🧪 **5단계: API 테스트**

배포된 Worker URL로 테스트:

```bash
# 헬스체크
curl https://teamk-api.your-subdomain.workers.dev/health

# 투자자 목록 조회
curl https://teamk-api.your-subdomain.workers.dev/api/investors
```

## 🌐 **6단계: Cloudflare Pages 설정**

### GitHub 연동:
1. Cloudflare Dashboard → "Pages" → "Create a project"
2. "Connect to Git" → GitHub 저장소 선택
3. Build settings:
   - **Framework preset**: None
   - **Build command**: (비워둠)
   - **Build output directory**: `/`

### 환경 변수 설정:
Pages 설정에서 다음 환경 변수 추가:
- `WORKER_URL`: `https://teamk-api.your-subdomain.workers.dev`

## 🔗 **7단계: 시스템 연동 확인**

1. **Cloudflare Setup 페이지 접속**:
   ```
   https://your-site.pages.dev/cloudflare-setup.html
   ```

2. **설정 정보 입력**:
   - API Token: [이미 입력됨]
   - Account ID: Cloudflare Dashboard 우측 사이드바
   - Database ID: 2단계에서 생성한 ID
   - Worker URL: 4단계에서 배포된 URL

3. **연결 테스트**: "연결 테스트" 버튼 클릭

4. **데이터 마이그레이션**: 
   ```
   https://your-site.pages.dev/data-migration.html
   ```

## 📁 **프로젝트 구조**

```
teamk-airbnb/
├── workers/
│   └── teamk-api.js          # Workers 코드
├── sql/
│   └── init.sql              # DB 초기화 스크립트
├── js/
│   └── cloudflare-storage.js # 브라우저 연동 코드
├── wrangler.toml             # Workers 설정
├── cloudflare-setup.html     # 설정 페이지
├── data-migration.html       # 마이그레이션 도구
└── index.html                # 메인 페이지
```

## 🚨 **주의사항**

1. **API Token 보안**: API 토큰을 GitHub에 업로드하지 마세요
2. **CORS 설정**: Worker가 자동으로 CORS 처리
3. **데이터 백업**: D1은 자동 백업되지만 중요한 데이터는 별도 백업 권장
4. **사용량 모니터링**: Cloudflare 무료 플랜 한도 확인

## 🎯 **완료 확인**

모든 설정이 완료되면:

✅ PC에서 투자자 추가 → Cloudflare D1 저장  
✅ 모바일에서 즉시 동일한 데이터 확인  
✅ 실시간 동기화 완료!

## 🔧 **문제 해결**

### Workers 배포 실패:
```bash
# 로그 확인
wrangler tail teamk-api

# 로컬 테스트
wrangler dev
```

### D1 연결 오류:
```bash
# 데이터베이스 상태 확인
wrangler d1 info teamk-data

# 바인딩 확인
wrangler d1 list
```

### CORS 오류:
브라우저 개발자 도구에서 네트워크 탭 확인 후 Worker URL 재확인

---

**🎉 완료되면 PC와 모바일에서 완벽한 실시간 동기화를 경험하실 수 있습니다!**