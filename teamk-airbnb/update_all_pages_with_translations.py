#!/usr/bin/env python3
"""
모든 페이지에 번역 스크립트를 추가하는 스크립트
"""

import os
import re

# 업데이트할 페이지들
pages = [
    'index.html',
    'accommodation.html', 
    'reservation.html',
    'accounting.html',
    'analytics.html',
    'investor.html',
    'settlement.html',
    'backup.html'
]

# 번역 스크립트 추가
translation_script = '<script src="js/translations.js"></script>'

# 공통 번역 패턴
translations = {
    r'Teamk 공유숙박 관리 시스템': 'data-translate="systemTitle">Teamk 공유숙박 관리 시스템',
    r'>대시보드<': '>대시보드<',  # 이미 수정됨
    r'>숙소 관리<': '>숙소 관리<',
    r'>예약 관리<': '>예약 관리<',
    r'>지표 관리<': '>지표 관리<',
    r'>수익 관리<': '>수익 관리<',
    r'>투자자 관리<': '>투자자 관리<',
    r'>투자자 정산<': '>투자자 정산<',
    r'>백업<': '>백업<'
}

def update_page(page_path):
    """개별 페이지 업데이트"""
    try:
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # translations.js 스크립트 추가 (중복 방지)
        if 'js/translations.js' not in content:
            auth_script = '<script src="js/auth.js"></script>'
            if auth_script in content:
                content = content.replace(
                    auth_script,
                    auth_script + '\n    ' + translation_script
                )
        
        # 시스템 제목에 번역 속성 추가
        content = re.sub(
            r'<h1[^>]*>(\s*Teamk 공유숙박 관리 시스템\s*)</h1>',
            r'<h1 class="text-2xl font-bold text-gray-800 mb-2" data-translate="systemTitle">\1</h1>',
            content
        )
        
        # 파일 저장
        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"✅ {page_path} 업데이트 완료")
        
    except Exception as e:
        print(f"❌ {page_path} 업데이트 실패: {e}")

def main():
    """메인 실행 함수"""
    print("🔄 모든 페이지에 번역 시스템 적용 시작...")
    
    for page in pages:
        if os.path.exists(page):
            update_page(page)
        else:
            print(f"⚠️  {page} 파일을 찾을 수 없습니다.")
    
    print("\n🎉 모든 페이지 번역 시스템 적용 완료!")
    print("\n📋 사용법:")
    print("1. 모든 페이지 상단에 언어 선택기가 추가됩니다")
    print("2. 한국어/태국어/영어 선택 가능")
    print("3. 선택한 언어는 localStorage에 저장되어 페이지 간 유지됩니다")
    print("4. data-translate 속성이 있는 모든 요소가 자동 번역됩니다")

if __name__ == "__main__":
    main()