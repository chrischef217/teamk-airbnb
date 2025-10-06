# 🚀 Teamk 공유숙박 관리 시스템 배포 가이드

## 📋 배포 순서

### 1단계: GitHub Repository 생성

1. **GitHub 계정 로그인**
   - https://github.com 접속 및 로그인

2. **새 Repository 생성**
   ```bash
   Repository name: teamk-accommodation-system
   Description: 태국 에어비앤비 숙소 투자 및 운영 관리 시스템
   Visibility: Private (또는 Public)
   Initialize: README, .gitignore (Node) 선택
   ```

3. **로컬 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "🎉 Initial commit: Teamk Accommodation Management System"
   git branch -M main
   git remote add origin https://github.com/your-username/teamk-accommodation-system.git
   git push -u origin main
   ```

### 2단계: Railway 백엔드 배포

1. **Railway 계정 생성**
   - https://railway.app 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   ```bash
   New Project → Deploy from GitHub repo
   → teamk-accommodation-system 선택
   ```

3. **환경 변수 설정**
   ```bash
   Railway Dashboard → Variables 탭
   
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-2024
   DB_HOST=${{MYSQL.HOST}}
   DB_PORT=${{MYSQL.PORT}}
   DB_NAME=${{MYSQL.DATABASE}}
   DB_USER=${{MYSQL.USERNAME}}
   DB_PASSWORD=${{MYSQL.PASSWORD}}
   FRONTEND_URL=https://teamk-accommodation.pages.dev
   ```

4. **MySQL 데이터베이스 추가**
   ```bash
   Add Service → Database → MySQL
   ```

5. **도메인 확인**
   ```bash
   Settings → Domains
   → 생성된 URL 복사 (예: https://teamk-api.railway.app)
   ```

### 3단계: Cloudflare Pages 프론트엔드 배포

1. **Cloudflare 계정 생성**
   - https://dash.cloudflare.com 접속
   - 계정 생성 및 로그인

2. **Pages 프로젝트 생성**
   ```bash
   Cloudflare Dashboard → Pages → Create a project
   → Connect to Git → GitHub 연결
   → teamk-accommodation-system 선택
   ```

3. **빌드 설정**
   ```bash
   Project name: teamk-accommodation
   Production branch: main
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   Root directory: (leave blank)
   ```

4. **환경 변수 설정**
   ```bash
   Pages → teamk-accommodation → Settings → Environment variables
   
   API_URL=https://teamk-api.railway.app
   ```

5. **배포 확인**
   ```bash
   배포 완료 후 URL 확인 (예: https://teamk-accommodation.pages.dev)
   ```

### 4단계: 도메인 및 DNS 설정 (선택사항)

1. **Cloudflare DNS 설정**
   ```bash
   Cloudflare Dashboard → DNS → Records
   
   Type: CNAME
   Name: www
   Content: teamk-accommodation.pages.dev
   Proxy status: Proxied
   
   Type: CNAME  
   Name: api
   Content: teamk-api.railway.app
   Proxy status: Proxied
   ```

2. **커스텀 도메인 연결**
   ```bash
   Pages → Custom domains → Set up a custom domain
   → 도메인 입력 → Begin DNS setup
   ```

### 5단계: GitHub Secrets 설정

1. **GitHub Repository → Settings → Secrets**
   ```bash
   CLOUDFLARE_API_TOKEN: Cloudflare API 토큰
   CLOUDFLARE_ACCOUNT_ID: Cloudflare 계정 ID
   RAILWAY_TOKEN: Railway API 토큰
   API_URL: Railway 백엔드 URL
   ```

2. **API 토큰 생성**
   ```bash
   # Cloudflare API Token
   Cloudflare → My Profile → API Tokens → Create Token
   → Custom token → Permissions:
     Zone:Zone:Read
     Zone:DNS:Edit  
     Zone:Page Rules:Edit
   
   # Railway Token
   Railway → Account Settings → Tokens → Create Token
   ```

### 6단계: 배포 테스트 및 확인

1. **백엔드 API 테스트**
   ```bash
   curl https://teamk-api.railway.app/api/health
   ```

2. **프론트엔드 접속 확인**
   ```bash
   https://teamk-accommodation.pages.dev
   ```

3. **기능 테스트**
   - 회원가입/로그인
   - 투자자 등록
   - 숙소 등록
   - 데이터 저장/조회

## 🔧 문제 해결

### 일반적인 배포 오류들

1. **Railway 백엔드 오류**
   ```bash
   # 로그 확인
   Railway Dashboard → Deployments → View logs
   
   # 일반적 해결방법
   - 환경변수 확인
   - MySQL 서비스 연결 상태 확인
   - 포트 설정 (Railway는 PORT 환경변수 사용)
   ```

2. **Cloudflare Pages 빌드 오류**
   ```bash
   # 빌드 로그 확인
   Pages → Deployments → View build log
   
   # 일반적 해결방법  
   - Node.js 버전 호환성 확인
   - 빌드 명령어 수정
   - 의존성 설치 확인
   ```

3. **CORS 오류**
   ```bash
   # 백엔드 CORS 설정 확인
   FRONTEND_URL 환경변수가 올바르게 설정되었는지 확인
   ```

## 🎯 배포 완료 체크리스트

- [ ] GitHub Repository 생성 및 코드 업로드
- [ ] Railway 백엔드 배포 및 MySQL 연결
- [ ] Cloudflare Pages 프론트엔드 배포
- [ ] 환경 변수 모든 설정 완료
- [ ] API 엔드포인트 정상 작동 확인
- [ ] 프론트엔드-백엔드 연동 테스트
- [ ] 회원가입/로그인 기능 테스트
- [ ] 데이터 CRUD 기능 테스트
- [ ] GitHub Actions CI/CD 파이프라인 작동 확인
- [ ] 커스텀 도메인 연결 (선택)
- [ ] SSL 인증서 자동 적용 확인

## 🌍 배포 완료 URL

- **프론트엔드**: https://teamk-accommodation.pages.dev
- **백엔드 API**: https://teamk-api.railway.app
- **API 상태 확인**: https://teamk-api.railway.app/api/health

## 💡 추가 팁

1. **무료 한도**
   - Railway: 월 $5 크레딧 (충분)
   - Cloudflare Pages: 무제한 (무료)

2. **모니터링**
   - Railway 대시보드에서 실시간 로그 확인
   - Cloudflare Analytics로 트래픽 모니터링

3. **업데이트**
   - GitHub에 푸시하면 자동 배포
   - 브랜치별 배포 환경 분리 가능

배포 과정에서 문제가 발생하면 각 플랫폼의 로그를 먼저 확인하세요! 🚀