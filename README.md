# 🏢 Teamk 공유숙박 관리 시스템

실제 다중 사용자를 지원하는 태국 에어비앤비 숙소 투자 및 운영 관리 플랫폼

## ⚠️ 최근 수정사항 (2024-10-06)

### 🚨 **중요: 데이터 저장 방식 대폭 변경**
- **localStorage → Cloudflare D1 전환**: 이제 모든 데이터가 Cloudflare D1 데이터베이스에 저장되어 PC와 모바일 간 실시간 동기화됩니다
- **Cloudflare Workers API**: RESTful API를 통한 완전한 CRUD 작업 지원
- **엔터프라이즈급 데이터베이스**: 무료 SQLite 기반 클라우드 데이터베이스
- **자동 백업**: Cloudflare 인프라를 통한 데이터 안전성 보장
- **데이터 마이그레이션 도구 제공**: 기존 localStorage 데이터를 D1로 안전하게 이전

### 🔧 **기술적 개선사항**
- **로그인 버튼 무한 리로드 문제 해결**: DOMContentLoaded 이벤트 리스너 중복 제거
- **리다이렉션 경로 정리**: index.html을 메인 대시보드로 통일
- **세션 관리 개선**: 로그인 상태 확인 로직 최적화

### 📊 **Cloudflare D1 데이터베이스 구조**
- `investors` 테이블: 투자자 정보 (id, userId, password, name, phone, email, investmentRatio, accommodations, created_at, updated_at)
- `accommodations` 테이블: 숙소 정보 (id, name, location, contractType, monthlyRent, deposit, contractStart, contractEnd, airbnbUrl, notes, created_at, updated_at)
- `reservations` 테이블: 예약 정보 (accommodationId, guestName, checkIn, checkOut, platform, amount, commission, status)
- `accounting` 테이블: 정산 정보 (accommodationId, month, revenue, expenses, netIncome)

### 🔧 **Cloudflare D1 연동 설정 방법**

#### 1. **Cloudflare API 토큰 생성**:
- Cloudflare Dashboard → "My Profile" → "API Tokens"
- "Create Token" → "Custom token"
- 권한: Account - Cloudflare D1:Edit, Zone - Zone:Read, Zone Settings:Edit

#### 2. **D1 데이터베이스 생성**:
- Cloudflare Dashboard → "Workers & Pages" → "D1 SQL Database"
- "Create database" → Name: `teamk-data`
- Database ID 복사

#### 3. **Cloudflare Worker 배포**:
- "Workers & Pages" → "Create application" → "Create Worker"
- Name: `teamk-api`
- `workers/teamk-api.js` 코드 붙여넣기
- Settings → Variables → "D1 Database Bindings" 추가 (TEAMK_DB)

#### 4. **시스템 설정**:
- 사이트에서 "Cloudflare 연동" 탭 클릭
- API Token, Account ID, Database ID, Worker URL 입력
- 연결 테스트 → DB 초기화 → 설정 저장

#### 5. **데이터 마이그레이션**:
- "데이터 마이그레이션" 탭에서 기존 데이터를 D1로 이전

## 🌟 주요 기능

### 💼 투자자 관리
- 투자자 등록/수정/삭제
- 투자 비율 및 정산 정보 관리
- 투자자별 보유 숙소 현황

### 🏠 숙소 관리
- 숙소 정보 등록 및 관리
- 계약 정보, 월세, 보증금 관리
- 숙소별 수익 통계

### 📅 예약 관리
- 에어비앤비 예약 현황 추적
- 체크인/체크아웃 관리
- 플랫폼별 수수료 계산

### 💰 회계 관리
- 수입/지출 내역 관리
- 숙소별 손익 분석
- 월별/연별 재무 보고서

### 📊 분석 대시보드
- 실시간 수익 현황
- 투자 수익률 분석
- 시각적 차트 및 그래프

### 🧮 투자자 정산
- 자동 수익 분배 계산
- 월별 정산 보고서 생성
- 정산 내역 추적

### 🔐 보안 및 권한
- JWT 기반 사용자 인증
- 역할 기반 접근 제어 (Admin, Manager, Investor, Viewer)
- 보안 헤더 및 Rate Limiting

### 🌍 다국어 지원
- 한국어, 영어, 태국어 지원
- 동적 언어 전환

## 🏗️ 기술 스택

### Backend
- **Node.js 18** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **MySQL 8.0** - 데이터베이스
- **Sequelize** - ORM
- **JWT** - 인증
- **bcrypt** - 패스워드 해싱

### Frontend
- **HTML5/CSS3** - 마크업 및 스타일
- **Vanilla JavaScript** - 클라이언트 로직
- **Tailwind CSS** - UI 프레임워크
- **Chart.js** - 데이터 시각화
- **Font Awesome** - 아이콘

### Infrastructure
- **Docker** - 컨테이너화
- **Docker Compose** - 다중 컨테이너 관리
- **Nginx** - 리버스 프록시
- **Redis** - 세션/캐시
- **Let's Encrypt** - SSL 인증서

## 🚀 배포 방법

### 1. 로컬 개발 환경

```bash
# 1. 리포지토리 클론
git clone https://github.com/your-username/teamk-accommodation.git
cd teamk-accommodation

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 수정하여 데이터베이스 정보 등 설정

# 4. 데이터베이스 설정 (MySQL 실행 필요)
mysql -u root -p -e "CREATE DATABASE teamk_accommodation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. 개발 서버 시작
npm run dev
```

### 2. Docker로 실행

```bash
# 1. Docker Compose로 전체 스택 실행
docker-compose up -d

# 2. 애플리케이션 접속
# http://localhost (Nginx를 통해)
# http://localhost:3000 (직접 애플리케이션)
```

### 3. 프로덕션 배포

#### AWS EC2 / Digital Ocean / VPS 서버

```bash
# 1. 서버에 Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. 애플리케이션 배포
git clone https://github.com/your-username/teamk-accommodation.git
cd teamk-accommodation

# 4. 환경 변수 설정
cp .env.example .env
# 프로덕션 환경에 맞게 .env 수정

# 5. 프로덕션 실행
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📋 API 문서

### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `PUT /api/auth/password` - 비밀번호 변경

### 투자자 API
- `GET /api/investors` - 투자자 목록 조회
- `POST /api/investors` - 새 투자자 등록
- `PUT /api/investors/:id` - 투자자 정보 수정
- `DELETE /api/investors/:id` - 투자자 삭제

### 숙소 API
- `GET /api/accommodations` - 숙소 목록 조회
- `POST /api/accommodations` - 새 숙소 등록
- `PUT /api/accommodations/:id` - 숙소 정보 수정
- `DELETE /api/accommodations/:id` - 숙소 삭제

## 👥 사용자 권한

### Admin (관리자)
- 모든 기능 접근 가능
- 사용자 관리
- 시스템 설정

### Manager (매니저)
- 투자자, 숙소, 예약, 회계 관리
- 분석 및 보고서 조회
- 정산 처리

### Investor (투자자)
- 자신의 투자 현황 조회
- 보유 숙소 정보 확인
- 정산 내역 조회

### Viewer (조회자)
- 기본 정보 조회만 가능
- 수정/삭제 권한 없음

## 🚀 클라우드 배포 옵션

1. **AWS**: EC2 + RDS + S3
2. **Google Cloud Platform**: Compute Engine + Cloud SQL
3. **Digital Ocean**: Droplets + Managed Database
4. **Heroku**: 간단한 배포 (비용 효율적)
5. **Vercel/Netlify**: 프론트엔드만 (백엔드는 별도 호스팅)

## 📞 지원 및 문의

- **개발자**: Teamk 개발팀
- **이메일**: support@teamk.com
- **GitHub**: [Repository Link](https://github.com/your-username/teamk-accommodation)

---

**📝 라이센스**: MIT License  
**🌟 버전**: 1.0.0  
**📅 마지막 업데이트**: 2024년 10월

## ✅ 현재 구현 상태

- ✅ **백엔드 API 서버** - Node.js + Express
- ✅ **데이터베이스 모델** - MySQL + Sequelize
- ✅ **사용자 인증** - JWT 기반
- ✅ **권한 관리** - 역할 기반 접근 제어
- ✅ **Docker 컨테이너화** - 배포 준비 완료
- ✅ **API 클라이언트** - 프론트엔드 연동
- ✅ **다국어 지원** - 3개 언어
- ⏳ **추가 API 라우트** - 진행 중
- ⏳ **프론트엔드 API 연동** - 진행 중

**🎯 다음 단계**: 아래 명령어로 즉시 배포 시작!

```bash
npm run deploy
```

또는 빠른 배포 가이드: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)