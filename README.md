# 🏢 Teamk 태국 에어비앤비 숙박관리 시스템

투자자별 권한 관리가 포함된 태국 에어비앤비 숙소 투자 및 운영 관리 클라이언트 전용 플랫폼

## ✅ 현재 완료된 기능

### 🔐 인증 및 권한 시스템
- **관리자 로그인**: `master / 881114`
- **투자자 로그인**: 투자자 관리에서 등록한 계정으로 로그인
- **강화된 세션 관리**: sessionStorage + localStorage 이중 백업
- **권한별 접근 제어**: 
  - 관리자: 모든 기능 접근
  - 투자자: 본인 숙소만 조회, 편집 불가, 백업 기능 숨김

### 📋 현재 기능적 진입점(URIs)
- `index.html` - 로그인 페이지 (관리자/투자자 구분 로그인)
- `dashboard.html` - 메인 대시보드 (수익 현황, 통계)
- `accommodation.html` - 숙소 관리 (등록/수정/삭제)
- `reservation.html` - 예약 관리 (체크인/체크아웃, 수익 계산)
- `analytics.html` - 분석 및 차트 (투자 수익률, 점유율)
- `accounting.html` - 수익 관리 (수입/지출 내역)
- `investor.html` - 투자자 관리 (관리자만 접근)
- `settlement.html` - 투자자 정산 (정산 내역 생성)
- `backup.html` - 백업 및 복원 (관리자만 접근)

### 🎯 투자자 권한 제한 기능
- **데이터 필터링**: 투자자는 본인이 투자한 숙소만 조회
- **편집 제한**: 투자자는 모든 데이터 읽기 전용
- **백업 탭 숨김**: 투자자에게 백업 기능 완전 차단
- **자동 리다이렉트**: 권한 없는 페이지 접근 시 대시보드로 이동

### 🌍 다국어 지원
- **한국어** (기본)
- **태국어** (ไทย)
- **영어** (English)
- 언어별 번역 및 로컬라이제이션

## ❌ 아직 미구현된 기능

### 📊 데이터 통합 및 연동
- 실제 에어비앤비 API 연동
- 은행/금융 데이터 자동 수집
- 실시간 환율 정보 연동

### 📈 고급 분석 기능
- 예측 분석 및 트렌드 예측
- 시장 비교 분석
- 투자 포트폴리오 최적화 추천

### 🔔 알림 및 자동화
- 이메일/SMS 알림 시스템
- 자동 정산 및 송금 연동
- 예약 확정/취소 자동 알림

## 🛠️ 기술 스택

### Frontend (클라이언트 사이드)
- **HTML5/CSS3** - 시맨틱 마크업 및 반응형 디자인
- **Vanilla JavaScript** - ES6+ 모던 JavaScript
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Chart.js** - 데이터 시각화 및 차트
- **Font Awesome** - 아이콘 라이브러리
- **localStorage/sessionStorage** - 클라이언트 데이터 저장

### 데이터 저장
- **브라우저 로컬 스토리지** - 클라이언트 데이터 영속성
- **RESTful Table API** - 서버 데이터 동기화 (선택적)

## 🚀 즉시 사용 가능한 배포

### 현재 배포 설정
1. **GitHub 리포지토리** 준비 완료
2. **Cloudflare Pages** 배포 설정 완료
3. **wrangler.toml** 배포 구성 완료
4. **_headers, _redirects** 보안 설정 적용

### 빠른 시작
```bash
# 1. GitHub에 업로드 (수동)
# 2. Cloudflare Pages에서 연결
# 3. 자동 배포 완료
```

## 🔧 권장 다음 단계

### 1. 우선순위 높음
- [ ] **실제 사용자 테스트** - 로그인/권한 시나리오 검증
- [ ] **데이터 백업/복원** - 중요 정보 보호
- [ ] **모바일 최적화** - 태블릿/스마트폰 사용성 개선

### 2. 중간 우선순위
- [ ] **API 서버 연동** - 실시간 데이터 동기화
- [ ] **파일 업로드** - 숙소 사진, 계약서 등
- [ ] **인쇄 최적화** - 정산서, 보고서 PDF 생성

### 3. 장기 계획
- [ ] **PWA 변환** - 앱처럼 설치 가능
- [ ] **오프라인 모드** - 인터넷 없이도 기본 기능 사용
- [ ] **멀티테넌트** - 여러 회사/팀 동시 사용

## 📊 데이터 모델 및 구조

### 투자자 데이터 구조
```javascript
{
  id: 'unique-id',
  userId: 'login-id',
  password: 'encrypted-password', 
  name: 'investor-name',
  accommodations: ['accommodation-id-1', 'accommodation-id-2']
}
```

### 숙소 데이터 구조  
```javascript
{
  id: 'accommodation-id',
  name: 'property-name',
  location: 'address',
  monthlyRent: 'amount',
  deposit: 'amount',
  contractDate: 'yyyy-mm-dd'
}
```

### 예약 데이터 구조
```javascript
{
  id: 'reservation-id',
  accommodationId: 'linked-property',
  checkIn: 'date',
  checkOut: 'date', 
  revenue: 'amount',
  commission: 'platform-fee'
}
```

## 🌐 공개 URL (배포 후)

- **프로덕션**: `https://your-site.pages.dev`
- **API 엔드포인트**: 클라이언트 사이드 전용 (서버 불필요)
- **문서**: GitHub README

## 📞 지원 정보

- **프로젝트**: Teamk 태국 에어비앤비 숙박관리 시스템
- **버전**: v1.0.0 (클라이언트 사이드)
- **마지막 업데이트**: 2025-01-06
- **라이센스**: MIT

---

**🎯 주요 특징**: 투자자별 권한 관리, 다국어 지원, 반응형 디자인, 클라이언트 사이드 전용으로 서버 불필요