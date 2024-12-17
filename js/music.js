class MusicController {
    constructor() {
        this.playBtn = document.getElementById('playBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.audio = new Howl({
            src: ['november.mp3'],
            loop: true,
            volume: 0.5,
            autoplay: false
        });
        
        this.isPlaying = false;
        this.isMuted = false;
        this.setupEventListeners();
        this.updateButtonStates();
    }

    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // 페이지 가시성 변경 시 음악 제어
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
        this.audio.play();
        this.isPlaying = true;
        this.playBtn.textContent = "⏸";
        this.updateButtonStates();
    }

    pauseMusic() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.textContent = "▶";
        this.updateButtonStates();
    }

    muteMusic() {
        this.audio.mute(true);
        this.isMuted = true;
        this.muteBtn.textContent = "🔇";
        this.updateButtonStates();
    }

    unmuteMusic() {
        this.audio.mute(false);
        this.isMuted = false;
        this.muteBtn.textContent = "🔊";
        this.updateButtonStates();
    }

    updateButtonStates() {
        this.playBtn.classList.toggle('playing', this.isPlaying);
        this.muteBtn.classList.toggle('muted', this.isMuted);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const musicController = new MusicController();
    
    // 사용자 상호작용이 필요한 브라우저를 위한 처리
    document.addEventListener('click', function initAudio() {
        musicController.audio.load();
        document.removeEventListener('click', initAudio);
    }, { once: true });
});