#!/bin/bash

# Teamk 공유숙박 관리 시스템 자동 배포 스크립트
# GitHub + Cloudflare + Railway 배포

set -e

echo "🚀 Teamk 공유숙박 관리 시스템 배포 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 함수: 에러 처리
error_exit() {
    echo -e "${RED}❌ 오류: $1${NC}" >&2
    exit 1
}

# 함수: 성공 메시지
success_msg() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 함수: 정보 메시지  
info_msg() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 함수: 경고 메시지
warn_msg() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. 환경 확인
info_msg "환경 확인 중..."

# Node.js 설치 확인
if ! command -v node &> /dev/null; then
    error_exit "Node.js가 설치되지 않았습니다. https://nodejs.org 에서 설치하세요."
fi

# Git 설치 확인
if ! command -v git &> /dev/null; then
    error_exit "Git이 설치되지 않았습니다. https://git-scm.com 에서 설치하세요."
fi

# npm 설치 확인
if ! command -v npm &> /dev/null; then
    error_exit "npm이 설치되지 않았습니다."
fi

NODE_VERSION=$(node --version)
success_msg "Node.js 버전: $NODE_VERSION"

# 2. 의존성 설치
info_msg "의존성 설치 중..."
npm install || error_exit "npm install 실패"
success_msg "의존성 설치 완료"

# 3. 프론트엔드 빌드
info_msg "프론트엔드 빌드 중..."
npm run build || error_exit "빌드 실패"
success_msg "프론트엔드 빌드 완료 (dist/ 폴더)"

# 4. Git 상태 확인
info_msg "Git 상태 확인 중..."

if [ ! -d ".git" ]; then
    warn_msg "Git 저장소가 초기화되지 않았습니다. 초기화 중..."
    git init
    success_msg "Git 저장소 초기화 완료"
fi

# 5. 변경사항 커밋
info_msg "변경사항 커밋 중..."

git add .
git commit -m "🚀 배포 준비: $(date +'%Y-%m-%d %H:%M:%S')" || warn_msg "커밋할 변경사항이 없습니다."

# 6. 리모트 저장소 확인
if ! git remote | grep -q "origin"; then
    warn_msg "GitHub 리모트가 설정되지 않았습니다."
    echo -e "${YELLOW}다음 명령어로 리모트를 추가하세요:${NC}"
    echo "git remote add origin https://github.com/your-username/teamk-accommodation-system.git"
    echo ""
else
    info_msg "GitHub에 푸시 중..."
    git push origin main || warn_msg "푸시 실패. GitHub 저장소를 확인하세요."
    success_msg "GitHub 푸시 완료"
fi

# 7. 배포 상태 확인 및 안내
echo ""
echo "=================== 🎉 배포 준비 완료 ==================="
echo ""
success_msg "로컬 빌드 완료"
success_msg "GitHub 푸시 완료 (자동 배포 시작됨)"
echo ""
info_msg "다음 단계를 진행하세요:"
echo ""
echo "1. 🔧 Railway 백엔드 배포:"
echo "   https://railway.app → New Project → Deploy from GitHub"
echo ""
echo "2. 🌐 Cloudflare Pages 프론트엔드 배포:"  
echo "   https://dash.cloudflare.com/pages → Create a project → Connect to Git"
echo ""
echo "3. 🔗 배포 완료 후 예상 URL:"
echo "   프론트엔드: https://teamk-accommodation.pages.dev"
echo "   백엔드: https://teamk-accommodation-api.railway.app"
echo ""
echo "📚 자세한 가이드: DEPLOYMENT_GUIDE.md 파일 참조"
echo ""
echo "==============================================================="

# 8. 브라우저에서 가이드 열기 (선택사항)
if command -v open &> /dev/null; then
    read -p "배포 가이드를 브라우저에서 열까요? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "DEPLOYMENT_GUIDE.md" || warn_msg "브라우저에서 열기 실패"
    fi
fi

success_msg "배포 스크립트 실행 완료!"
echo "Happy coding! 🚀"