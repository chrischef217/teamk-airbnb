# 🚀 GitHub + Cloudflare Pages 배포 가이드

GitHub에 코드를 업로드하고 Cloudflare Pages로 자동 배포하는 완전한 가이드입니다.

## 📋 **준비사항**

- ✅ GitHub 계정
- ✅ Cloudflare 계정
- ✅ Git 설치됨
- ✅ Cloudflare API 키 입력 완료

## 🔧 **1단계: GitHub 저장소 준비**

### 새 저장소 생성:
1. GitHub에서 "New repository" 클릭
2. Repository name: `teamk-airbnb-management`
3. ✅ Public (또는 Private)
4. ✅ Add a README file
5. "Create repository" 클릭

### 로컬 설정:
```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/teamk-airbnb-management.git
cd teamk-airbnb-management

# Git 사용자 설정 (필요시)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 📁 **2단계: 프로젝트 파일 업로드**

현재 프로젝트의 모든 파일을 GitHub 저장소에 복사:

```
teamk-airbnb-management/
├── index.html                    # 메인 페이지
├── login.html                    # 로그인 페이지
├── investor.html                 # 투자자 관리
├── accommodation.html            # 숙소 관리
├── reservation.html              # 예약 관리
├── accounting.html               # 회계 관리
├── analytics.html                # 분석 페이지
├── settlement.html               # 정산 관리
├── backup.html                   # 백업 관리
├── cloudflare-setup.html         # Cloudflare 설정
├── data-migration.html           # 데이터 마이그레이션
├── dashboard.html                # 대시보드
├── js/
│   ├── auth.js                   # 인증 관련
│   ├── translations.js           # 다국어 지원
│   └── cloudflare-storage.js     # Cloudflare 연동
├── workers/
│   └── teamk-api.js              # Workers API 코드
├── sql/
│   └── init.sql                  # DB 초기화 스크립트
├── wrangler.toml                 # Workers 설정
├── README.md                     # 프로젝트 설명
├── CLOUDFLARE_WORKERS_SETUP.md   # Workers 설정 가이드
└── GITHUB_CLOUDFLARE_DEPLOY.md   # 배포 가이드 (현재 파일)
```

### Git 명령어로 업로드:
```bash
# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Teamk Airbnb Management System"

# GitHub에 푸시
git push origin main
```

## ☁️ **3단계: Cloudflare Pages 설정**

### Pages 프로젝트 생성:
1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. "Pages" 탭 클릭
3. "Create a project" → "Connect to Git"
4. GitHub 계정 연결 및 저장소 선택
5. Build settings:
   ```
   Project name: teamk-airbnb
   Production branch: main
   Framework preset: None
   Build command: (비워둠)
   Build output directory: /
   ```
6. "Save and Deploy" 클릭

### 배포 확인:
배포 완료 후 URL 확인 (예: `https://teamk-airbnb.pages.dev`)

## 🛠️ **4단계: Cloudflare Workers 배포**

### Wrangler CLI 설치 및 로그인:
```bash
npm install -g wrangler
wrangler auth login
```

### D1 데이터베이스 생성:
```bash
# D1 데이터베이스 생성
wrangler d1 create teamk-data

# 출력에서 database_id 복사하여 wrangler.toml 업데이트
```

### wrangler.toml 수정:
```toml
[[d1_databases]]
binding = "TEAMK_DB"
database_name = "teamk-data"
database_id = "여기에-실제-ID-입력"  # 위에서 복사한 ID

[vars]
ALLOWED_ORIGINS = "https://teamk-airbnb.pages.dev"  # 실제 Pages URL
```

### 데이터베이스 초기화:
```bash
wrangler d1 execute teamk-data --file=./sql/init.sql
```

### Workers 배포:
```bash
wrangler deploy
```

배포된 Worker URL 기록 (예: `https://teamk-api.your-subdomain.workers.dev`)

## 🔗 **5단계: 시스템 연동**

### Cloudflare 설정:
1. 배포된 사이트 접속: `https://teamk-airbnb.pages.dev`
2. "Cloudflare 연동" 메뉴 클릭
3. 설정 정보 입력:
   - **API Token**: [이미 입력하신 토큰]
   - **Account ID**: Cloudflare Dashboard 우측 사이드바
   - **Database ID**: 4단계에서 생성한 D1 Database ID
   - **Worker URL**: 4단계에서 배포된 Worker URL
4. "연결 테스트" → "DB 초기화" → "설정 저장"

### 데이터 마이그레이션:
1. "데이터 마이그레이션" 메뉴 클릭
2. "전체 데이터 마이그레이션" 실행
3. 기존 localStorage 데이터가 Cloudflare D1으로 이전

## ✅ **6단계: 배포 완료 확인**

### 기능 테스트:
1. **로그인**: 관리자 (master/881114)
2. **투자자 추가**: PC에서 투자자 정보 입력
3. **모바일 확인**: 모바일에서 동일한 URL 접속하여 동일한 데이터 확인
4. **실시간 동기화**: 한 기기에서 수정하면 다른 기기에서 즉시 반영

### URL 정리:
- **메인 사이트**: `https://teamk-airbnb.pages.dev`
- **API 엔드포인트**: `https://teamk-api.your-subdomain.workers.dev`
- **GitHub 저장소**: `https://github.com/YOUR_USERNAME/teamk-airbnb-management`

## 🔄 **향후 업데이트 방법**

### 코드 수정 후 배포:
```bash
# 파일 수정 후
git add .
git commit -m "업데이트 설명"
git push origin main

# Cloudflare Pages가 자동으로 재배포됨 (약 1-2분 소요)
```

### Workers 업데이트:
```bash
# workers/teamk-api.js 수정 후
wrangler deploy
```

## 🚨 **보안 주의사항**

### GitHub에 업로드하지 말 것:
- ❌ API 토큰
- ❌ 비밀번호
- ❌ 개인정보

### 환경 변수 사용:
Cloudflare Pages에서 민감한 정보는 환경 변수로 관리

## 🎯 **완료!**

이제 다음이 모두 완료되었습니다:

✅ **GitHub**: 코드 버전 관리  
✅ **Cloudflare Pages**: 정적 웹사이트 호스팅  
✅ **Cloudflare Workers**: API 서버  
✅ **Cloudflare D1**: 데이터베이스  
✅ **실시간 동기화**: PC ↔ 모바일 완벽 연동

**🎉 PC에서 투자자를 추가하면 모바일에서 즉시 확인할 수 있습니다!**

---

## 🔧 **문제 해결**

### Pages 배포 실패:
- Build 로그 확인
- 파일 경로 재확인

### Workers 오류:
```bash
wrangler tail teamk-api  # 실시간 로그
wrangler dev            # 로컬 테스트
```

### 데이터 동기화 안됨:
- Browser DevTools → Network 탭에서 API 호출 확인
- Worker URL 재확인