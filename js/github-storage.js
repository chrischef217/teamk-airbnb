// GitHub를 데이터베이스로 사용하는 저장소 시스템
class GitHubStorage {
    constructor() {
        this.token = null;
        this.owner = null;
        this.repo = null;
        this.branch = 'main';
        this.dataFolder = 'data';
        
        // localStorage에서 설정 로드
        this.loadConfig();
    }

    // GitHub 설정 저장
    saveConfig(token, owner, repo) {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);
        
        console.log('✅ GitHub 설정 저장됨');
    }

    // GitHub 설정 로드
    loadConfig() {
        this.token = localStorage.getItem('github_token');
        this.owner = localStorage.getItem('github_owner');
        this.repo = localStorage.getItem('github_repo');
        
        if (this.token && this.owner && this.repo) {
            console.log('📡 GitHub 설정 로드됨:', `${this.owner}/${this.repo}`);
            return true;
        }
        return false;
    }

    // 설정 확인
    isConfigured() {
        return !!(this.token && this.owner && this.repo);
    }

    // GitHub API 요청 헤더
    getHeaders() {
        return {
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        };
    }

    // 파일 존재 확인
    async fileExists(filename) {
        if (!this.isConfigured()) throw new Error('GitHub 설정이 필요합니다.');

        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataFolder}/${filename}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            return response.ok;
        } catch (error) {
            console.log(`파일 확인 실패: ${filename}`, error);
            return false;
        }
    }

    // 파일 SHA 가져오기 (업데이트 시 필요)
    async getFileSHA(filename) {
        if (!this.isConfigured()) throw new Error('GitHub 설정이 필요합니다.');

        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataFolder}/${filename}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                return data.sha;
            }
            return null;
        } catch (error) {
            console.error(`SHA 가져오기 실패: ${filename}`, error);
            return null;
        }
    }

    // JSON 데이터 로드
    async loadData(filename) {
        if (!this.isConfigured()) {
            console.warn('GitHub 설정이 없습니다. localStorage 폴백 사용.');
            const localData = localStorage.getItem(filename.replace('.json', 'Data'));
            return localData ? JSON.parse(localData) : [];
        }

        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataFolder}/${filename}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                const content = atob(data.content);
                const jsonData = JSON.parse(content);
                
                console.log(`📥 GitHub에서 로드: ${filename} (${jsonData.length}개 항목)`);
                return jsonData;
            } else if (response.status === 404) {
                console.log(`📄 파일 없음: ${filename}, 빈 배열 반환`);
                return [];
            } else {
                throw new Error(`GitHub API 오류: ${response.status}`);
            }
        } catch (error) {
            console.error(`데이터 로드 실패: ${filename}`, error);
            
            // 폴백: localStorage에서 로드
            const localData = localStorage.getItem(filename.replace('.json', 'Data'));
            return localData ? JSON.parse(localData) : [];
        }
    }

    // JSON 데이터 저장
    async saveData(filename, data) {
        if (!this.isConfigured()) {
            console.warn('GitHub 설정이 없습니다. localStorage에 저장.');
            localStorage.setItem(filename.replace('.json', 'Data'), JSON.stringify(data));
            return;
        }

        try {
            const content = btoa(JSON.stringify(data, null, 2));
            const sha = await this.getFileSHA(filename);
            
            const payload = {
                message: `Update ${filename} - ${new Date().toISOString()}`,
                content: content,
                branch: this.branch
            };

            // 파일이 존재하면 SHA 포함
            if (sha) {
                payload.sha = sha;
            }

            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataFolder}/${filename}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log(`📤 GitHub에 저장: ${filename} (${data.length}개 항목)`);
                
                // 성공 시 localStorage에도 백업
                localStorage.setItem(filename.replace('.json', 'Data'), JSON.stringify(data));
            } else {
                const errorData = await response.json();
                throw new Error(`GitHub API 오류: ${response.status} - ${errorData.message}`);
            }
        } catch (error) {
            console.error(`데이터 저장 실패: ${filename}`, error);
            
            // 폴백: localStorage에 저장
            console.log('localStorage에 폴백 저장');
            localStorage.setItem(filename.replace('.json', 'Data'), JSON.stringify(data));
            
            throw error;
        }
    }

    // 투자자 데이터 관리
    async loadInvestors() {
        return await this.loadData('investors.json');
    }

    async saveInvestors(data) {
        return await this.saveData('investors.json', data);
    }

    // 숙소 데이터 관리
    async loadAccommodations() {
        return await this.loadData('accommodations.json');
    }

    async saveAccommodations(data) {
        return await this.saveData('accommodations.json', data);
    }

    // 예약 데이터 관리
    async loadReservations() {
        return await this.loadData('reservations.json');
    }

    async saveReservations(data) {
        return await this.saveData('reservations.json', data);
    }

    // 정산 데이터 관리
    async loadAccounting() {
        return await this.loadData('accounting.json');
    }

    async saveAccounting(data) {
        return await this.saveData('accounting.json', data);
    }

    // 연결 테스트
    async testConnection() {
        if (!this.isConfigured()) {
            return { success: false, error: 'GitHub 설정이 필요합니다.' };
        }

        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const repo = await response.json();
                return { 
                    success: true, 
                    message: `연결 성공: ${repo.full_name}`,
                    repo: repo
                };
            } else {
                return { 
                    success: false, 
                    error: `저장소 접근 실패: ${response.status}` 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: `연결 오류: ${error.message}` 
            };
        }
    }
}

// 전역 인스턴스
window.githubStorage = new GitHubStorage();