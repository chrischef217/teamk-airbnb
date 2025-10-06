// 다국어 번역 시스템
const translations = {
    ko: {
        // 공통 헤더
        systemTitle: "Teamk 공유숙박 관리 시스템",
        
        // 탭 네비게이션
        dashboard: "대시보드",
        accommodations: "숙소 관리", 
        reservations: "예약 관리",
        analytics: "지표 관리",
        accounting: "수익 관리",
        investors: "투자자 관리",
        settlement: "투자자 정산",
        backup: "백업",
        dataManagement: "데이터 관리",
        
        // 대시보드
        dashboardTitle: "대시보드",
        dashboardSubtitle: "시스템 현황 및 주요 지표",
        totalAccommodations: "총 숙소 수",
        monthlyReservations: "이번 달 예약",
        totalRevenue: "총 수익",
        accommodationRevenue: "숙소별 수익 현황",
        accommodationName: "숙소명",
        monthlyRent: "월 임대료",
        totalIncome: "총 수입",
        netIncome: "순수입",
        roi: "투자수익률",
        
        // 숙소 관리
        accommodationManagement: "숙소 관리",
        accommodationManagementSubtitle: "태국 에어비앤비 숙소 현황 및 운영 관리",
        addAccommodation: "새 숙소 등록",
        searchAccommodation: "숙소명 검색...",
        accommodationList: "숙소 목록",
        accommodationInfo: "숙소 정보",
        edit: "수정",
        buildingName: "건물명",
        address: "주소",
        roomType: "객실타입",
        capacity: "수용인원",
        area: "면적(㎡)",
        deposit: "보증금",
        maintenanceFee: "관리비",
        agencyName: "중개업소명",
        agencyContact: "중개업소 연락처",
        agencyFee: "중개수수료",
        ownerName: "건물주명",
        ownerContact: "건물주 연락처",
        contractStart: "계약 시작일",
        contractEnd: "계약 종료일",
        notes: "특이사항",
        
        // 예약 관리
        reservationManagement: "예약 관리",
        reservationManagementSubtitle: "태국 시간 기준 실시간 예약 현황",
        monthFilter: "월별 필터",
        selectMonth: "월을 선택하세요",
        reservationList: "예약 목록",
        guestName: "예약자명",
        guestPhone: "연락처",
        guestEmail: "이메일",
        checkinDate: "체크인 날짜",
        checkinTime: "체크인 시간",
        checkoutDate: "체크아웃 날짜", 
        checkoutTime: "체크아웃 시간",
        adults: "성인",
        children: "아동",
        totalAmount: "총 금액",
        paidAmount: "결제 금액",
        paymentMethod: "결제 방법",
        platform: "플랫폼",
        status: "상태",
        specialRequests: "특별 요청",
        
        // 지표 관리
        analyticsManagement: "지표 관리",
        analyticsManagementSubtitle: "데이터 기반 수익성 분석",
        analysisMode: "분석 모드",
        byInvestor: "투자자별 분석",
        byAccommodation: "숙소별 분석", 
        byMonth: "월별 분석",
        selectInvestor: "투자자를 선택하세요",
        selectAccommodationForAnalysis: "분석할 숙소를 선택하세요",
        
        // 수익 관리
        accountingManagement: "수익 관리",
        accountingManagementSubtitle: "수입 및 지출 관리",
        accommodationFilter: "숙소 필터",
        selectAccommodation: "숙소를 선택하세요",
        transactionEntry: "거래 입력",
        transactionList: "거래 내역",
        income: "수입",
        expense: "지출",
        date: "날짜",
        description: "내용",
        category: "카테고리",
        incomeAmount: "수입 금액",
        expenseAmount: "지출 금액",
        balance: "잔액",
        
        // 투자자 관리
        investorManagement: "투자자 관리",
        investorManagementSubtitle: "투자자 정보 및 지분 관리",
        addInvestor: "새 투자자 등록",
        investorList: "투자자 목록",
        investorInfo: "투자자 정보",
        phone: "연락처",
        email: "이메일",
        settlementDay: "정산일",
        investorRatio: "투자자 비율",
        companyRatio: "회사 비율",
        ownedAccommodations: "보유 숙소",
        
        // 투자자 정산
        settlementManagement: "투자자 정산",
        settlementReport: "정산 리포트",
        selectInvestorForSettlement: "투자자를 선택하세요",
        selectSettlementMonth: "월을 선택하세요",
        generateReport: "리포트 생성",
        print: "인쇄",
        settlementPeriod: "정산 기간 및 투자자 정보",
        investorBasicInfo: "투자자 정보",
        investmentConditions: "투자 조건",
        ownedAccommodationList: "보유 숙소 목록",
        monthlyRevenue: "월별 수익 현황",
        settlementCalculation: "정산 계산서",
        revenueAnalysis: "수익 분석",
        dividendCalculation: "배당 계산",
        finalSettlementAmount: "이번 달 정산 금액",
        confirmation: "확인 및 서명",
        
        // 백업
        backupManagement: "데이터 백업 & 복원",
        backupManagementSubtitle: "전체 시스템 데이터를 안전하게 백업하고 복원합니다",
        systemStatus: "시스템 상태",
        normal: "정상",
        lastBackupStatus: "마지막 백업 현황",
        downloadTime: "다운로드 일시",
        uploadTime: "업로드 일시",
        backupFile: "백업 파일",
        currentDataStatus: "현재 데이터 현황",
        backupDownload: "데이터 백업 다운로드",
        backupRestore: "데이터 백업 복원",
        selectBackupFile: "백업 파일 선택 (*.xlsx)",
        validateFile: "파일 검증하기",
        executeRestore: "데이터 복원 실행",
        
        // 로그인 페이지
        loginTitle: "로그인",
        loginSubtitle: "공유숙박 관리 시스템",
        adminLogin: "관리자 로그인",
        investorLogin: "투자자 로그인",
        adminId: "관리자 아이디",
        investorId: "투자자 아이디",
        password: "비밀번호",
        adminIdPlaceholder: "관리자 아이디를 입력하세요",
        investorIdPlaceholder: "투자자 아이디를 입력하세요",
        passwordPlaceholder: "비밀번호를 입력하세요",
        loginAsAdmin: "관리자로 로그인",
        loginAsInvestor: "투자자로 로그인",
        loginGuide: "로그인 안내",
        adminGuide: "관리자: 모든 기능 이용 가능",
        investorGuide: "투자자: 본인 투자 정보만 조회 가능",
        allRightsReserved: "All rights reserved",
        loginSuccess: "로그인 성공!",
        adminLoginSuccess: "관리자 로그인 성공!",
        investorLoginSuccess: "님 로그인 성공!",
        loginError: "아이디 또는 비밀번호가 올바르지 않습니다.",
        
        // 공통 버튼
        save: "저장",
        cancel: "취소",
        delete: "삭제",
        close: "닫기",
        confirm: "확인",
        yes: "예",
        no: "아니오",
        loading: "로딩 중...",
        
        // 상태
        confirmed: "확정",
        pending: "대기",
        completed: "완료",
        cancelled: "취소",
        
        // 통화 단위
        currency: "THB",
        
        // 메시지
        noData: "데이터가 없습니다",
        selectRequired: "선택이 필요합니다",
        saveSuccess: "저장되었습니다",
        deleteSuccess: "삭제되었습니다",
        error: "오류가 발생했습니다"
    },
    
    th: {
        // 공통 헤더
        systemTitle: "ระบบจัดการที่พักแบบแชร์ Teamk",
        
        // 탭 네비게이션
        dashboard: "แดชบอร์ด",
        accommodations: "จัดการที่พัก",
        reservations: "จัดการการจอง",
        analytics: "จัดการดัชนี",
        accounting: "จัดการรายได้",
        investors: "จัดการนักลงทุน",
        settlement: "การชำระเงินนักลงทุน",
        backup: "สำรองข้อมูล",
        dataManagement: "จัดการข้อมูล",
        
        // 대시보드
        dashboardTitle: "แดชบอร์ด",
        dashboardSubtitle: "สถานะระบบและดัชนีสำคัญ",
        totalAccommodations: "จำนวนที่พักทั้งหมด",
        monthlyReservations: "การจองเดือนนี้",
        totalRevenue: "รายได้รวม",
        accommodationRevenue: "สถานะรายได้แยกตามที่พัก",
        accommodationName: "ชื่อที่พัก",
        monthlyRent: "ค่าเช่ารายเดือน",
        totalIncome: "รายได้รวม",
        netIncome: "รายได้สุทธิ",
        roi: "ผลตอบแทนการลงทุน",
        
        // 숙소 관리
        accommodationManagement: "จัดการที่พัก",
        accommodationManagementSubtitle: "สถานะและการจัดการที่พัก Airbnb ประเทศไทย",
        addAccommodation: "ลงทะเบียนที่พักใหม่",
        searchAccommodation: "ค้นหาชื่อที่พัก...",
        accommodationList: "รายการที่พัก",
        accommodationInfo: "ข้อมูลที่พัก",
        edit: "แก้ไข",
        buildingName: "ชื่ออาคาร",
        address: "ที่อยู่",
        roomType: "ประเภทห้อง",
        capacity: "จำนวนผู้เข้าพัก",
        area: "พื้นที่(ตร.ม.)",
        deposit: "เงินมัดจำ",
        maintenanceFee: "ค่าจัดการ",
        agencyName: "ชื่อนายหน้า",
        agencyContact: "ติดต่อนายหน้า",
        agencyFee: "ค่าคอมมิชชั่น",
        ownerName: "ชื่อเจ้าของอาคาร",
        ownerContact: "ติดต่อเจ้าของอาคาร",
        contractStart: "วันที่เริ่มสัญญา",
        contractEnd: "วันที่สิ้นสุดสัญญา",
        notes: "หมายเหตุพิเศษ",
        
        // 예약 관리
        reservationManagement: "จัดการการจอง",
        reservationManagementSubtitle: "สถานะการจองแบบเรียลไทม์ตามเวลาไทย",
        monthFilter: "กรองตามเดือน",
        selectMonth: "เลือกเดือน",
        reservationList: "รายการจอง",
        guestName: "ชื่อผู้จอง",
        guestPhone: "เบอร์ติดต่อ",
        guestEmail: "อีเมล",
        checkinDate: "วันที่เช็คอิน",
        checkinTime: "เวลาเช็คอิน",
        checkoutDate: "วันที่เช็คเอาท์",
        checkoutTime: "เวลาเช็คเอาท์",
        adults: "ผู้ใหญ่",
        children: "เด็ก",
        totalAmount: "จำนวนเงินรวม",
        paidAmount: "จำนวนเงินที่ชำระ",
        paymentMethod: "วิธีการชำระเงิน",
        platform: "แพลตฟอร์ม",
        status: "สถานะ",
        specialRequests: "คำขอพิเศษ",
        
        // 지표 관리
        analyticsManagement: "จัดการดัชนี",
        analyticsManagementSubtitle: "การวิเคราะห์ความสามารถในการทำกำไรจากข้อมูล",
        analysisMode: "โหมดการวิเคราะห์",
        byInvestor: "วิเคราะห์ตามนักลงทุน",
        byAccommodation: "วิเคราะห์ตามที่พัก",
        byMonth: "วิเคราะห์ตามเดือน",
        selectInvestor: "เลือกนักลงทุน",
        selectAccommodationForAnalysis: "เลือกที่พักสำหรับวิเคราะห์",
        
        // 수익 관리
        accountingManagement: "จัดการรายได้",
        accountingManagementSubtitle: "จัดการรายได้และค่าใช้จ่าย",
        accommodationFilter: "กรองที่พัก",
        selectAccommodation: "เลือกที่พัก",
        transactionEntry: "บันทึกรายการ",
        transactionList: "รายการธุรกรรม",
        income: "รายได้",
        expense: "ค่าใช้จ่าย",
        date: "วันที่",
        description: "รายละเอียด",
        category: "หมวดหมู่",
        incomeAmount: "จำนวนรายได้",
        expenseAmount: "จำนวนค่าใช้จ่าย",
        balance: "ยอดคงเหลือ",
        
        // 투자자 관리
        investorManagement: "จัดการนักลงทุน",
        investorManagementSubtitle: "ข้อมูลนักลงทุนและการจัดการหุ้น",
        addInvestor: "ลงทะเบียนนักลงทุนใหม่",
        investorList: "รายการนักลงทุน",
        investorInfo: "ข้อมูลนักลงทุน",
        phone: "เบอร์ติดต่อ",
        email: "อีเมล",
        settlementDay: "วันชำระเงิน",
        investorRatio: "อัตราส่วนนักลงทุน",
        companyRatio: "อัตราส่วนบริษัท",
        ownedAccommodations: "ที่พักที่ถือครอง",
        
        // 투자자 정산
        settlementManagement: "การชำระเงินนักลงทุน",
        settlementReport: "รายงานการชำระเงิน",
        selectInvestorForSettlement: "เลือกนักลงทุน",
        selectSettlementMonth: "เลือกเดือน",
        generateReport: "สร้างรายงาน",
        print: "พิมพ์",
        settlementPeriod: "ระยะเวลาชำระเงินและข้อมูลนักลงทุน",
        investorBasicInfo: "ข้อมูลนักลงทุน",
        investmentConditions: "เงื่อนไขการลงทุน",
        ownedAccommodationList: "รายการที่พักที่ถือครอง",
        monthlyRevenue: "สถานะรายได้รายเดือน",
        settlementCalculation: "การคำนวณการชำระเงิน",
        revenueAnalysis: "การวิเคราะห์รายได้",
        dividendCalculation: "การคำนวณเงินปันผล",
        finalSettlementAmount: "จำนวนเงินชำระเดือนนี้",
        confirmation: "การยืนยันและลงชื่อ",
        
        // 백업
        backupManagement: "การสำรองข้อมูลและการคืนค่า",
        backupManagementSubtitle: "สำรองข้อมูลระบบทั้งหมดและคืนค่าอย่างปลอดภัย",
        systemStatus: "สถานะระบบ",
        normal: "ปกติ",
        lastBackupStatus: "สถานะการสำรองข้อมูลล่าสุด",
        downloadTime: "เวลาดาวน์โหลด",
        uploadTime: "เวลาอัพโหลด",
        backupFile: "ไฟล์สำรองข้อมูล",
        currentDataStatus: "สถานะข้อมูลปัจจุบัน",
        backupDownload: "ดาวน์โหลดการสำรองข้อมูล",
        backupRestore: "คืนค่าการสำรองข้อมูล",
        selectBackupFile: "เลือกไฟล์สำรองข้อมูล (*.xlsx)",
        validateFile: "ตรวจสอบไฟล์",
        executeRestore: "ดำเนินการคืนค่าข้อมูล",
        
        // 로그인 페이지
        loginTitle: "เข้าสู่ระบบ",
        loginSubtitle: "ระบบจัดการที่พักร่วม",
        adminLogin: "เข้าสู่ระบบผู้ดูแล",
        investorLogin: "เข้าสู่ระบบนักลงทุน",
        adminId: "รหัสผู้ดูแล",
        investorId: "รหัสนักลงทุน",
        password: "รหัสผ่าน",
        adminIdPlaceholder: "กรุณาใส่รหัสผู้ดูแล",
        investorIdPlaceholder: "กรุณาใส่รหัสนักลงทุน",
        passwordPlaceholder: "กรุณาใส่รหัสผ่าน",
        loginAsAdmin: "เข้าสู่ระบบในฐานะผู้ดูแล",
        loginAsInvestor: "เข้าสู่ระบบในฐานะนักลงทุน",
        loginGuide: "คำแนะนำการเข้าสู่ระบบ",
        adminGuide: "ผู้ดูแล: สามารถใช้งานทุกฟังก์ชั่น",
        investorGuide: "นักลงทุน: ดูข้อมูลการลงทุนส่วนตัวเท่านั้น",
        allRightsReserved: "สงวนลิขสิทธิ์",
        loginSuccess: "เข้าสู่ระบบสำเร็จ!",
        adminLoginSuccess: "เข้าสู่ระบบผู้ดูแลสำเร็จ!",
        investorLoginSuccess: "เข้าสู่ระบบสำเร็จ!",
        loginError: "รหัสผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        
        // 공통 버튼
        save: "บันทึก",
        cancel: "ยกเลิก",
        delete: "ลบ",
        close: "ปิด",
        confirm: "ยืนยัน",
        yes: "ใช่",
        no: "ไม่",
        loading: "กำลังโหลด...",
        
        // 상태
        confirmed: "ยืนยัน",
        pending: "รอดำเนินการ",
        completed: "เสร็จสิ้น",
        cancelled: "ยกเลิก",
        
        // 통화 단위
        currency: "บาท",
        
        // 메시지
        noData: "ไม่มีข้อมูล",
        selectRequired: "จำเป็นต้องเลือก",
        saveSuccess: "บันทึกแล้ว",
        deleteSuccess: "ลบแล้ว",
        error: "เกิดข้อผิดพลาด"
    },
    
    en: {
        // 공통 헤더
        systemTitle: "Teamk Shared Accommodation Management System",
        
        // 탭 네비게이션
        dashboard: "Dashboard",
        accommodations: "Accommodation Mgmt",
        reservations: "Reservation Mgmt",
        analytics: "Analytics Mgmt",
        accounting: "Revenue Mgmt",
        investors: "Investor Mgmt",
        settlement: "Investor Settlement",
        backup: "Backup",
        
        // 대시보드
        dashboardTitle: "Dashboard",
        dashboardSubtitle: "System Status and Key Metrics",
        totalAccommodations: "Total Accommodations",
        monthlyReservations: "Monthly Reservations",
        totalRevenue: "Total Revenue",
        accommodationRevenue: "Revenue Status by Accommodation",
        accommodationName: "Accommodation Name",
        monthlyRent: "Monthly Rent",
        totalIncome: "Total Income",
        netIncome: "Net Income",
        roi: "Return on Investment",
        
        // 숙소 관리
        accommodationManagement: "Accommodation Management",
        accommodationManagementSubtitle: "Thailand Airbnb Property Status and Operations Management",
        addAccommodation: "Register New Property",
        searchAccommodation: "Search accommodation name...",
        accommodationList: "Accommodation List",
        accommodationInfo: "Accommodation Information",
        edit: "Edit",
        buildingName: "Building Name",
        address: "Address",
        roomType: "Room Type",
        capacity: "Capacity",
        area: "Area(㎡)",
        deposit: "Deposit",
        maintenanceFee: "Maintenance Fee",
        agencyName: "Agency Name",
        agencyContact: "Agency Contact",
        agencyFee: "Agency Fee",
        ownerName: "Owner Name",
        ownerContact: "Owner Contact",
        contractStart: "Contract Start Date",
        contractEnd: "Contract End Date",
        notes: "Special Notes",
        
        // 예약 관리
        reservationManagement: "Reservation Management",
        reservationManagementSubtitle: "Real-time Reservation Status (Thailand Time)",
        monthFilter: "Monthly Filter",
        selectMonth: "Select Month",
        reservationList: "Reservation List",
        guestName: "Guest Name",
        guestPhone: "Phone Number",
        guestEmail: "Email",
        checkinDate: "Check-in Date",
        checkinTime: "Check-in Time",
        checkoutDate: "Check-out Date",
        checkoutTime: "Check-out Time",
        adults: "Adults",
        children: "Children",
        totalAmount: "Total Amount",
        paidAmount: "Paid Amount",
        paymentMethod: "Payment Method",
        platform: "Platform",
        status: "Status",
        specialRequests: "Special Requests",
        
        // 지표 관리
        analyticsManagement: "Analytics Management",
        analyticsManagementSubtitle: "Data-driven Profitability Analysis",
        analysisMode: "Analysis Mode",
        byInvestor: "By Investor Analysis",
        byAccommodation: "By Accommodation Analysis",
        byMonth: "By Month Analysis",
        selectInvestor: "Select Investor",
        selectAccommodationForAnalysis: "Select Accommodation for Analysis",
        
        // 수익 관리
        accountingManagement: "Revenue Management",
        accountingManagementSubtitle: "Income and Expense Management",
        accommodationFilter: "Accommodation Filter",
        selectAccommodation: "Select Accommodation",
        transactionEntry: "Transaction Entry",
        transactionList: "Transaction History",
        income: "Income",
        expense: "Expense",
        date: "Date",
        description: "Description",
        category: "Category",
        incomeAmount: "Income Amount",
        expenseAmount: "Expense Amount",
        balance: "Balance",
        
        // 투자자 관리
        investorManagement: "Investor Management",
        investorManagementSubtitle: "Investor Information and Equity Management",
        addInvestor: "Register New Investor",
        investorList: "Investor List",
        investorInfo: "Investor Information",
        phone: "Phone",
        email: "Email",
        settlementDay: "Settlement Day",
        investorRatio: "Investor Ratio",
        companyRatio: "Company Ratio",
        ownedAccommodations: "Owned Accommodations",
        
        // 투자자 정산
        settlementManagement: "Investor Settlement",
        settlementReport: "Settlement Report",
        selectInvestorForSettlement: "Select Investor",
        selectSettlementMonth: "Select Month",
        generateReport: "Generate Report",
        print: "Print",
        settlementPeriod: "Settlement Period and Investor Information",
        investorBasicInfo: "Investor Information",
        investmentConditions: "Investment Conditions",
        ownedAccommodationList: "Owned Accommodation List",
        monthlyRevenue: "Monthly Revenue Status",
        settlementCalculation: "Settlement Calculation",
        revenueAnalysis: "Revenue Analysis",
        dividendCalculation: "Dividend Calculation",
        finalSettlementAmount: "This Month's Settlement Amount",
        confirmation: "Confirmation and Signature",
        
        // 백업
        backupManagement: "Data Backup & Restore",
        backupManagementSubtitle: "Safely backup and restore entire system data",
        systemStatus: "System Status",
        normal: "Normal",
        lastBackupStatus: "Last Backup Status",
        downloadTime: "Download Time",
        uploadTime: "Upload Time",
        backupFile: "Backup File",
        currentDataStatus: "Current Data Status",
        backupDownload: "Data Backup Download",
        backupRestore: "Data Backup Restore",
        selectBackupFile: "Select Backup File (*.xlsx)",
        validateFile: "Validate File",
        executeRestore: "Execute Data Restore",
        
        // 로그인 페이지
        loginTitle: "Login",
        loginSubtitle: "Shared Accommodation Management System",
        adminLogin: "Admin Login",
        investorLogin: "Investor Login",
        adminId: "Admin ID",
        investorId: "Investor ID",
        password: "Password",
        adminIdPlaceholder: "Enter admin ID",
        investorIdPlaceholder: "Enter investor ID",
        passwordPlaceholder: "Enter password",
        loginAsAdmin: "Login as Admin",
        loginAsInvestor: "Login as Investor",
        loginGuide: "Login Guide",
        adminGuide: "Admin: Full access to all features",
        investorGuide: "Investor: View personal investment info only",
        allRightsReserved: "All rights reserved",
        loginSuccess: "Login successful!",
        adminLoginSuccess: "Admin login successful!",
        investorLoginSuccess: "Login successful!",
        loginError: "Incorrect username or password.",
        
        // 공통 버튼
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        close: "Close",
        confirm: "Confirm",
        yes: "Yes",
        no: "No",
        loading: "Loading...",
        
        // 상태
        confirmed: "Confirmed",
        pending: "Pending",
        completed: "Completed",
        cancelled: "Cancelled",
        
        // 통화 단위
        currency: "THB",
        
        // 메시지
        noData: "No data available",
        selectRequired: "Selection required",
        saveSuccess: "Saved successfully",
        deleteSuccess: "Deleted successfully",
        error: "An error occurred"
    }
};

// 번역 관리자 클래스
class TranslationManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'ko';
        this.init();
    }
    
    init() {
        this.createLanguageSelector();
        this.applyTranslations();
    }
    
    // 저장된 언어 설정 가져오기
    getStoredLanguage() {
        return localStorage.getItem('teamk-language');
    }
    
    // 언어 설정 저장
    setStoredLanguage(lang) {
        localStorage.setItem('teamk-language', lang);
    }
    
    // 언어 선택기 생성
    createLanguageSelector() {
        const header = document.querySelector('.bg-white.rounded-lg.shadow-sm.p-4.mb-6');
        if (!header) return;
        
        // 기존 언어 선택기가 있으면 제거
        const existingSelector = header.querySelector('.language-selector');
        if (existingSelector) {
            existingSelector.remove();
        }
        
        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector flex items-center gap-2 mt-3';
        languageSelector.innerHTML = `
            <label class="text-sm font-medium text-gray-600">Language:</label>
            <select id="languageSelect" class="border border-gray-300 rounded px-2 py-1 text-sm">
                <option value="ko" ${this.currentLanguage === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
                <option value="th" ${this.currentLanguage === 'th' ? 'selected' : ''}>🇹🇭 ไทย</option>
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            </select>
        `;
        
        header.appendChild(languageSelector);
        
        // 언어 변경 이벤트 리스너
        const select = languageSelector.querySelector('#languageSelect');
        select.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }
    
    // 언어 변경
    changeLanguage(language) {
        this.currentLanguage = language;
        this.setStoredLanguage(language);
        this.applyTranslations();
    }
    
    // 현재 언어의 번역 가져오기
    getTranslation(key) {
        return translations[this.currentLanguage]?.[key] || translations.ko[key] || key;
    }
    
    // 번역 적용
    applyTranslations() {
        // data-translate 속성이 있는 모든 요소에 번역 적용
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // 페이지 제목 업데이트
        if (document.title.includes('Teamk')) {
            document.title = this.getTranslation('systemTitle');
        }
    }
    
    // 동적으로 번역 텍스트 가져오기
    t(key) {
        return this.getTranslation(key);
    }
}

// 글로벌 번역 관리자 인스턴스
let translator = null;

// 페이지 로드 시 번역 시스템 초기화
document.addEventListener('DOMContentLoaded', function() {
    translator = new TranslationManager();
});

// 번역 함수 (전역에서 사용 가능)
function t(key) {
    return translator ? translator.t(key) : key;
}