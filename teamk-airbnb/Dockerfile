# Node.js 18 Alpine 이미지 사용 (경량화)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    mysql-client

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 프론트엔드 파일을 public 폴더로 복사
RUN mkdir -p public
COPY *.html public/
COPY css/ public/css/
COPY js/ public/js/
COPY images/ public/images/ 2>/dev/null || true

# 로그 디렉토리 생성
RUN mkdir -p logs uploads

# 비root 사용자 생성
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 폴더 권한 설정
RUN chown -R nodejs:nodejs /app
USER nodejs

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# 애플리케이션 시작
CMD ["node", "server.js"]