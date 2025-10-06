#!/usr/bin/env node

/**
 * Cloudflare Pages용 프론트엔드 빌드 스크립트
 * 정적 파일들을 dist/ 폴더로 복사하고 API 엔드포인트를 설정합니다.
 */

const fs = require('fs');
const path = require('path');

// 빌드 디렉토리 생성
const buildDir = './dist';
if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
}
fs.mkdirSync(buildDir, { recursive: true });

// 복사할 파일/폴더 목록
const filesToCopy = [
    'index.html',
    'accommodation.html', 
    'reservation.html',
    'analytics.html',
    'accounting.html',
    'investor.html',
    'settlement.html',
    'backup.html',
    'css/',
    'js/',
    'images/'
];

// 파일 복사 함수
function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// 파일들 복사
filesToCopy.forEach(item => {
    const srcPath = path.join(__dirname, item);
    const destPath = path.join(buildDir, item);
    
    if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, destPath);
        console.log(`✅ ${item} 복사 완료`);
    } else {
        console.log(`⚠️  ${item} 파일을 찾을 수 없습니다.`);
    }
});

// public 폴더의 파일들도 복사
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
    const publicFiles = fs.readdirSync(publicDir);
    publicFiles.forEach(file => {
        const srcPath = path.join(publicDir, file);
        const destPath = path.join(buildDir, file);
        
        if (fs.statSync(srcPath).isFile()) {
            copyRecursive(srcPath, destPath);
            console.log(`✅ public/${file} 복사 완료`);
        } else if (fs.statSync(srcPath).isDirectory()) {
            copyRecursive(srcPath, destPath);
            console.log(`✅ public/${file}/ 복사 완료`);
        }
    });
}

// API 설정 파일 생성
const apiConfig = `
// Cloudflare Pages용 API 설정
const API_CONFIG = {
    // 프로덕션 API URL (백엔드 서버 주소)
    production: '${process.env.API_URL || 'https://teamk-accommodation-api.railway.app'}',
    
    // 개발 환경 API URL  
    development: 'http://localhost:3000'
};

// 현재 환경에 맞는 API URL 설정
window.API_BASE_URL = window.location.hostname === 'localhost' 
    ? API_CONFIG.development 
    : API_CONFIG.production;

console.log('🌍 API Base URL:', window.API_BASE_URL);
`;

fs.writeFileSync(path.join(buildDir, 'js', 'config.js'), apiConfig);

// _redirects 파일 생성 (Cloudflare Pages SPA 지원)
const redirects = `
# SPA 리다이렉트 규칙
/accommodation /accommodation.html 200
/reservation /reservation.html 200  
/analytics /analytics.html 200
/accounting /accounting.html 200
/investor /investor.html 200
/settlement /settlement.html 200
/backup /backup.html 200

# 기본 페이지
/* /index.html 200
`;

fs.writeFileSync(path.join(buildDir, '_redirects'), redirects);

// package.json 생성 (Cloudflare Pages용)
const packageJson = {
    "name": "teamk-accommodation-frontend",
    "version": "1.0.0", 
    "description": "Teamk 공유숙박 관리 시스템 - 프론트엔드",
    "scripts": {
        "build": "node build-frontend.js",
        "dev": "python -m http.server 8080"
    },
    "keywords": ["accommodation", "management", "frontend"],
    "author": "Teamk",
    "license": "MIT"
};

fs.writeFileSync(path.join(buildDir, 'package.json'), JSON.stringify(packageJson, null, 2));

console.log('🎉 프론트엔드 빌드 완료!');
console.log('📁 빌드 결과:', buildDir);
console.log('🚀 Cloudflare Pages에 배포 준비 완료');