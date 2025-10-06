# ⚡ 빠른 배포 가이드

## 🚀 1분만에 배포하기

### 준비사항 ✅
- [ ] GitHub 계정
- [ ] Cloudflare 계정  
- [ ] Railway 계정

---

## 🔥 자동 배포 스크립트 실행

```bash
# 실행 권한 부여
chmod +x deploy.sh

# 자동 배포 시작
./deploy.sh
```

**이 명령어 하나로 끝!** 🎉

---

## 📱 수동 배포 (3단계)

### 1️⃣ GitHub Repository 생성 (2분)

1. https://github.com 접속
2. **New repository** 클릭
3. Repository name: `teamk-accommodation-system`
4. **Create repository** 클릭
5. 터미널에서:
```bash
git init
git add .
git commit -m "🎉 First deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/teamk-accommodation-system.git
git push -u origin main
```

### 2️⃣ Railway 백엔드 배포 (3분)

1. https://railway.app 접속
2. **New Project** → **Deploy from GitHub repo**
3. `teamk-accommodation-system` 선택
4. **Add MySQL** 서비스 추가
5. **Environment Variables** 설정:
```
NODE_ENV=production
JWT_SECRET=teamk-jwt-secret-key-2024
DB_HOST=${{MYSQL.HOST}}
DB_PORT=${{MYSQL.PORT}}
DB_NAME=${{MYSQL.DATABASE}}
DB_USER=${{MYSQL.USERNAME}}
DB_PASSWORD=${{MYSQL.PASSWORD}}
```
6. **Deploy** 클릭

### 3️⃣ Cloudflare Pages 프론트엔드 배포 (2분)

1. https://dash.cloudflare.com 접속
2. **Pages** → **Create a project** 
3. **Connect to Git** → GitHub 연결
4. `teamk-accommodation-system` 선택
5. 빌드 설정:
```
Framework preset: None
Build command: npm run build
Build output directory: dist
```
6. 환경 변수 설정:
```
API_URL=https://your-railway-app.railway.app
```
7. **Save and Deploy** 클릭

---

## 🎯 배포 완료!

### ✅ 결과 확인
- **프론트엔드**: `https://teamk-accommodation.pages.dev`
- **백엔드 API**: `https://your-app.railway.app/api/health`

### 🔧 테스트
1. 프론트엔드 접속
2. 회원가입/로그인 테스트
3. 투자자 등록 테스트
4. 숙소 등록 테스트

---

## 🚨 문제 해결

### Railway 배포 실패
- **Logs 탭**에서 오류 확인
- MySQL 서비스 연결 상태 확인
- 환경 변수 설정 재확인

### Cloudflare 빌드 실패  
- **Functions** 탭에서 빌드 로그 확인
- Node.js 버전 호환성 확인
- 빌드 명령어 수정: `node build-frontend.js`

### API 연결 오류
- Railway URL이 정확한지 확인
- CORS 설정 확인 (Railway 환경변수)
- 브라우저 개발자 도구에서 네트워크 탭 확인

---

## 💡 추가 설정

### 커스텀 도메인 연결
1. Cloudflare DNS에 도메인 추가
2. Pages에서 Custom Domain 설정
3. Railway에서 Custom Domain 설정

### SSL 인증서
- Cloudflare: 자동 적용
- Railway: 자동 적용

### 모니터링
- Railway: 실시간 로그 및 메트릭
- Cloudflare: Analytics 및 성능 모니터링

---

## 🎊 축하합니다!

이제 **실제 사용자들이 접속할 수 있는 웹사이트**가 완성되었습니다!

- 🌍 **전 세계 접속 가능**
- 🔒 **SSL 보안 적용**  
- ⚡ **CDN 고속 배포**
- 💾 **데이터베이스 연동**
- 🔐 **사용자 인증 시스템**

**URL을 공유하고 팀원들을 초대하세요!** 🚀