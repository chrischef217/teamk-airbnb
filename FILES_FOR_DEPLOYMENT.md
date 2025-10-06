# 📁 배포를 위한 파일 목록

## ✅ 배포 준비 완료!

모든 파일이 GitHub + Cloudflare + Railway 배포용으로 최적화되었습니다.

---

## 🔧 핵심 설정 파일

### 배포 자동화
- `deploy.sh` - 원클릭 자동 배포 스크립트
- `build-frontend.js` - Cloudflare Pages용 프론트엔드 빌드
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD

### 서버 설정
- `server.js` - Express.js 백엔드 서버
- `package.json` - 의존성 및 스크립트
- `railway.toml` - Railway 배포 설정
- `healthcheck.js` - 서버 상태 확인
- `.env.example` - 환경 변수 템플릿

### 데이터베이스 & API
- `models/index.js` - Sequelize 데이터베이스 모델
- `routes/` - API 라우트 (auth, accommodations, health 등)
- `config/database.js` - 데이터베이스 연결 설정
- `middleware/auth.js` - JWT 인증 미들웨어

---

## 🌐 프론트엔드 파일

### 메인 페이지들
- `public/index.html` - 대시보드
- `accommodation.html` - 숙소 관리
- `investor.html` - 투자자 관리
- `reservation.html` - 예약 관리
- `accounting.html` - 회계 관리
- `analytics.html` - 분석 대시보드
- `settlement.html` - 투자자 정산
- `backup.html` - 데이터 백업

### JavaScript 라이브러리
- `public/js/api.js` - API 클라이언트 (서버 연동)
- `public/js/hybrid-storage.js` - 하이브리드 저장소 (온라인/오프라인)
- `js/auth.js` - 인증 시스템
- `js/translations.js` - 다국어 지원

---

## 📚 문서 파일

### 배포 가이드
- `DEPLOYMENT_GUIDE.md` - 상세 배포 가이드
- `QUICK_DEPLOY.md` - 빠른 배포 가이드 (1분 완성)
- `README.md` - 프로젝트 소개 및 전체 가이드

### 설정 파일
- `.gitignore` - Git 제외 파일 목록
- `Dockerfile` - Docker 컨테이너 설정
- `docker-compose.yml` - 다중 컨테이너 구성

---

## 🚀 배포 방법

### 🔥 자동 배포 (추천)
```bash
npm run deploy
```

### 🛠️ 수동 배포
1. GitHub Repository 생성
2. Railway에서 백엔드 배포
3. Cloudflare Pages에서 프론트엔드 배포

자세한 내용: `QUICK_DEPLOY.md` 참조

---

## 🎯 배포 완료 후 예상 URL

- **프론트엔드**: `https://teamk-accommodation.pages.dev`
- **백엔드 API**: `https://teamk-accommodation-api.railway.app`
- **헬스체크**: `https://teamk-accommodation-api.railway.app/api/health`

---

## 🌟 주요 특징

### ✅ 하이브리드 시스템
- **온라인**: 서버 API 사용 (다중 사용자)
- **오프라인**: localStorage 사용 (개인용)
- **자동 전환**: 네트워크 상태에 따라 자동 전환

### ✅ 무료 호스팅
- **Cloudflare Pages**: 무제한 무료
- **Railway**: 월 $5 크레딧 (충분)
- **총 비용**: $0/월 (무료 한도 내)

### ✅ 프로덕션 급 보안
- JWT 인증
- bcrypt 패스워드 해싱
- HTTPS 자동 적용
- Rate Limiting
- CORS 보안 설정

### ✅ 글로벌 배포
- CDN 전 세계 배포
- SSL 자동 적용
- 자동 스케일링
- 99.9% 업타임 보장

---

## 🔧 개발자를 위한 정보

### 로컬 개발 환경
```bash
npm install
npm run dev
```

### 빌드 테스트
```bash
npm run build
```

### 파일 정리
```bash
npm run clean
```

---

## 🎉 준비 완료!

**모든 파일이 배포 준비 완료되었습니다!**

이제 `npm run deploy` 명령어 하나로 실제 웹사이트를 배포할 수 있습니다. 🚀

궁금한 점이 있으면 `DEPLOYMENT_GUIDE.md`를 참조하세요!