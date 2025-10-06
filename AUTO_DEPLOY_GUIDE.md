# 🚀 자동 배포 가이드 - GitHub + Cloudflare

## 📋 1단계: 로컬 폴더에 파일 생성

**GitHub Desktop에서 "Show in Explorer" 클릭한 폴더에 다음 파일들을 생성하세요:**

### 📄 1. package.json 생성
```json
{
  "name": "teamk-airbnb",
  "version": "1.0.0",
  "description": "태국 에어비앤비 숙소 투자 및 운영 관리 시스템",
  "main": "index.html",
  "scripts": {
    "build": "echo 'Build complete'",
    "start": "python -m http.server 8080 || npx serve .",
    "dev": "python -m http.server 8080"
  },
  "keywords": ["airbnb", "thailand", "investment", "management"],
  "author": "Teamk",
  "license": "MIT"
}
```

### 📄 2. index.html 생성
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teamk 에어비앤비 관리 시스템</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body { 
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-6">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        🏢 Teamk 에어비앤비 관리 시스템
                    </h1>
                    <div class="language-selector">
                        <select id="languageSelect" class="text-sm border border-gray-300 rounded px-2 py-1">
                            <option value="ko">한국어</option>
                            <option value="en">English</option>
                            <option value="th">ไทย</option>
                        </select>
                    </div>
                </div>
                <p class="text-gray-600">태국 에어비앤비 숙소 투자 및 운영 관리 플랫폼</p>
            </div>
            
            <!-- Tab Navigation -->
            <div class="bg-white rounded-lg shadow-sm mb-6">
                <div class="flex flex-wrap border-b">
                    <button class="px-4 py-3 text-sm font-medium text-white bg-blue-600 border-b-2 border-blue-600 rounded-tl-lg">
                        <i class="fas fa-tachometer-alt mr-1"></i> 대시보드
                    </button>
                    <button onclick="window.location.href='accommodation.html'" class="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800">
                        <i class="fas fa-home mr-1"></i> 숙소 관리
                    </button>
                    <button onclick="window.location.href='investor.html'" class="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800">
                        <i class="fas fa-users mr-1"></i> 투자자 관리
                    </button>
                    <button onclick="window.location.href='analytics.html'" class="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800">
                        <i class="fas fa-chart-bar mr-1"></i> 분석 대시보드
                    </button>
                </div>
            </div>
        </div>

        <!-- Dashboard Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-home text-blue-600 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">총 숙소</p>
                        <p class="text-2xl font-semibold text-gray-900" id="totalAccommodations">0개</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-users text-green-600 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">총 투자자</p>
                        <p class="text-2xl font-semibold text-gray-900" id="totalInvestors">0명</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-calendar-check text-purple-600 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">이번 달 예약</p>
                        <p class="text-2xl font-semibold text-gray-900" id="monthlyReservations">0건</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-coins text-yellow-600 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">총 수익</p>
                        <p class="text-2xl font-semibold text-gray-900" id="totalRevenue">0 THB</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Message -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div class="flex">
                <div class="flex-shrink-0">
                    <i class="fas fa-check-circle text-green-400 text-xl"></i>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">
                        🎉 배포 성공!
                    </h3>
                    <div class="mt-2 text-sm text-green-700">
                        <p>Teamk 에어비앤비 관리 시스템이 성공적으로 배포되었습니다.</p>
                        <p class="mt-1">이제 실제 사용자들이 접속하여 이용할 수 있습니다!</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">빠른 시작</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onclick="window.location.href='investor.html'" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <i class="fas fa-user-plus text-blue-600 text-xl mb-2"></i>
                    <p class="font-medium">투자자 등록</p>
                    <p class="text-sm text-gray-500">새로운 투자자를 시스템에 등록</p>
                </button>

                <button onclick="window.location.href='accommodation.html'" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <i class="fas fa-home text-green-600 text-xl mb-2"></i>
                    <p class="font-medium">숙소 등록</p>
                    <p class="text-sm text-gray-500">새로운 에어비앤비 숙소 등록</p>
                </button>

                <button onclick="window.location.href='analytics.html'" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    <i class="fas fa-chart-line text-purple-600 text-xl mb-2"></i>
                    <p class="font-medium">수익 분석</p>
                    <p class="text-sm text-gray-500">투자 수익률 및 성과 분석</p>
                </button>
            </div>
        </div>
    </div>

    <script>
        // 기본 데이터 로드
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboardData();
        });

        function loadDashboardData() {
            // localStorage에서 데이터 로드
            const accommodations = JSON.parse(localStorage.getItem('accommodationData') || '[]');
            const investors = JSON.parse(localStorage.getItem('investorData') || '[]');
            
            // 대시보드 업데이트
            document.getElementById('totalAccommodations').textContent = accommodations.length + '개';
            document.getElementById('totalInvestors').textContent = investors.length + '명';
            
            console.log('🎉 Teamk 에어비앤비 관리 시스템이 로드되었습니다!');
        }

        // 언어 변경
        function changeLanguage(lang) {
            console.log('언어 변경:', lang);
            // 언어 변경 로직 구현
        }
    </script>
</body>
</html>
```

### 📄 3. _redirects 파일 생성 (Cloudflare Pages용)
```
# SPA 리다이렉트 규칙
/accommodation /accommodation.html 200
/investor /investor.html 200  
/analytics /analytics.html 200

# 기본 페이지
/* /index.html 200
```

### 📄 4. .gitignore 파일 생성
```
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 환경 변수
.env
.env.local
.env.production

# 빌드 결과
dist/
build/

# 로그 파일
logs/
*.log

# OS 생성 파일
.DS_Store
.DS_Store?
._*
Thumbs.db

# IDE 설정
.vscode/
.idea/
*.swp
```

---

## 🎯 2단계: GitHub에 업로드

**위의 4개 파일을 만든 후:**

1. **GitHub Desktop으로 돌아가기**
2. **파일 변경사항 확인** (Changes 탭)
3. **Summary 입력**: `🎉 Teamk 에어비앤비 시스템 초기 배포`
4. **"Commit to main"** 클릭
5. **"Push origin"** 클릭

---

## 🚀 3단계: Cloudflare Pages 자동 배포

**GitHub 업로드 후 다음 링크로 이동:**

🔗 **https://dash.cloudflare.com/sign-up**

1. **계정 생성** (이메일로 간단 가입)
2. **Pages** → **"Connect to Git"**
3. **GitHub 연결** → **"teamk-airbnb" 선택**
4. **"Begin setup"** 클릭
5. **빌드 설정**:
   - Framework preset: **None**
   - Build command: **비워두기**
   - Build output directory: **/** 
6. **"Save and Deploy"** 클릭

---

**📝 파일 생성 완료하시면 "파일 4개 만들었습니다"라고 알려주세요!**

그럼 다음 단계로 진행하겠습니다! 🚀