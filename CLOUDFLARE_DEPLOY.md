# Cloudflare Pages 배포 가이드

## 🚀 자동 배포 설정 (권장)

### 1단계: GitHub Repository 연결
1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. `Pages` 섹션으로 이동
3. `Create a project` 클릭
4. `Connect to Git` 선택
5. GitHub repository `teamk-airbnb` 선택

### 2단계: 빌드 설정
- **프레임워크 프리셋**: `None (Static HTML)`
- **빌드 명령**: 비워둠 (정적 HTML이므로)
- **빌드 출력 디렉터리**: `/`
- **환경 변수**: 필요시 추가

### 3단계: 배포 완료
- 자동으로 빌드 및 배포 시작
- `*.pages.dev` 도메인으로 접근 가능
- GitHub push시 자동 재배포

## 🛠️ 수동 배포 (선택사항)

### Wrangler CLI 사용
```bash
npm install -g wrangler
wrangler login
wrangler pages publish . --project-name=teamk-airbnb
```

## 📁 현재 프로젝트 구조

```
teamk-airbnb/
├── index.html              # 메인 대시보드
├── accommodation.html      # 숙소 관리
├── investor.html          # 투자자 관리
├── analytics.html         # 지표 관리
├── reservation.html       # 예약 관리
├── accounting.html        # 수익 관리
├── settlement.html        # 투자자 정산
├── backup.html           # 데이터 백업
├── js/                   # JavaScript 파일들
├── _headers              # Cloudflare 헤더 설정
├── _redirects            # 리다이렉트 규칙
├── functions/            # Cloudflare Functions
└── wrangler.toml         # Cloudflare 설정
```

## 🔧 시스템 특징

- **완전한 클라이언트 사이드**: 서버 없이 브라우저에서 실행
- **로컬 스토리지**: 모든 데이터를 브라우저에 저장
- **반응형 디자인**: 모바일/태블릿/데스크탑 최적화
- **다국어 지원**: 한국어/태국어 지원
- **실시간 계산**: ROI, 수익률 자동 계산

## 🌐 접속 후 확인사항

배포 완료 후 다음 기능들을 테스트해보세요:

1. ✅ 메인 대시보드 접속
2. ✅ 숙소 등록 및 관리
3. ✅ 투자자 등록 및 관리  
4. ✅ 예약 데이터 입력
5. ✅ 수익 데이터 분석
6. ✅ 투자자별 정산 계산
7. ✅ 데이터 백업/복원

## 📞 지원

문제가 있을 경우 GitHub Issues를 통해 문의해주세요.