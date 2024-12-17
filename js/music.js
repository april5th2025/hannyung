class MusicController {
    constructor() {
        this.playBtn = document.getElementById('playBtn');
        this.muteBtn = document.getElementById('muteBtn');
        
        // Howl 객체 생성 시 상세 옵션 추가
        this.audio = new Howl({
            src: ['./november.mp3'],  // 상대 경로 사용
            loop: true,
            volume: 0.5,
            autoplay: false,
            onloaderror: (error) => {
                console.error('음악 파일 로드 실패:', error);
            },
            onload: () => {
                console.log('음악 파일 로드 성공');
            },
            onplay: () => {
                console.log('음악 재생 시작');
            }
        });
        
        this.isPlaying = false;
        this.isMuted = false;
        this.setupEventListeners();
        this.updateButtonStates();
    }

    setupEventListeners() {
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.togglePlay());
        }
        if (this.muteBtn) {
            this.muteBtn.addEventListener('click', () => this.toggleMute());
        }
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying) {
                this.pauseMusic();
            }
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }

    toggleMute() {
        if (this.isMuted) {
            this.unmuteMusic();
        } else {
            this.muteMusic();
        }
    }

    playMusic() {
        try {
            this.audio.play();
            this.isPlaying = true;
            if (this.playBtn) {
                this.playBtn.textContent = "🔊";  // 변경
            }
            this.updateButtonStates();
        } catch (error) {
            console.error('재생 중 오류:', error);
        }
    }
    
    pauseMusic() {
        try {
            this.audio.pause();
            this.isPlaying = false;
            if (this.playBtn) {
                this.playBtn.textContent = "🔇";  // 변경
            }
            this.updateButtonStates();
        } catch (error) {
            console.error('일시정지 중 오류:', error);
        }
    }
    
    muteMusic() {
        try {
            this.audio.mute(true);
            this.isMuted = true;
            if (this.muteBtn) {
                this.muteBtn.textContent = "🔇";  // 이미 동일
            }
            this.updateButtonStates();
        } catch (error) {
            console.error('음소거 중 오류:', error);
        }
    }
    
    unmuteMusic() {
        try {
            this.audio.mute(false);
            this.isMuted = false;
            if (this.muteBtn) {
                this.muteBtn.textContent = "🔊";  // 이미 동일
            }
            this.updateButtonStates();
        } catch (error) {
            console.error('음소거 해제 중 오류:', error);
        }
    }
   
    updateButtonStates() {
        if (this.playBtn) {
            this.playBtn.classList.toggle('playing', this.isPlaying);
        }
        if (this.muteBtn) {
            this.muteBtn.classList.toggle('muted', this.isMuted);
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const musicController = new MusicController();
    
    // 사용자 상호작용을 위한 초기화
    document.addEventListener('click', function initAudio() {
        musicController.audio.load();
        document.removeEventListener('click', initAudio);
    }, { once: true });
});