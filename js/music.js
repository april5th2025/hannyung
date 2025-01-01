// music.js
let sound = null;
let hasStartedPlaying = false;
let isMuted = false;

function createMusicAlert() {
    const modalHTML = `
        <div id="musicAlertModal" class="music-alert-overlay">
            <div class="music-alert-content">
                <div class="music-alert-box">
                    <h2>💌 참석 여부 </h2>
                    <p>결혼식에 참석여부를 작성하였나요?</p>
                    <div class="button-container">
                        <button id="confirmMusic" class="music-alert-button">예</button>
                        <button id="declineMusic" class="music-alert-button decline">아니오</button>
                    </div>
                </div>
            </div> 
        </div>
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .music-alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .music-alert-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            pointer-events: auto;
        }

        .music-alert-box {
            padding: 20px;
        }

        .music-alert-box h2 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 1.5rem;
        }

        .music-alert-box p {
            margin: 0 0 20px 0;
            color: #666;
            font-size: 1.1rem;
        }

        .button-container {
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        .music-alert-button {
            background-color: #4A90E2;
            color: white;
            border: none;
            padding: 10px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s;
        }

        .music-alert-button:hover {
            background-color: #357ABD;
        }

        .music-alert-button.decline {
            background-color: #6c757d;
        }

        .music-alert-button.decline:hover {
            background-color: #5a6268;
        }

        body.modal-open {
            overflow: hidden;
        }
    `;

    document.head.appendChild(styleSheet);
    document.body.insertAdjacentHTML('afterbegin', modalHTML);
    document.body.classList.add('modal-open');

    const overlay = document.getElementById('musicAlertModal');
    const content = overlay.querySelector('.music-alert-content');
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            e.stopPropagation();
        }
    });

    content.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function initializeAudio() {
    if (sound || hasStartedPlaying) return;

    sound = new Howl({
        src: ['november.mp3'], // GitHub Pages용 경로
        loop: true,
        volume: 1.0,
        html5: true
    });

    sound.play();
    hasStartedPlaying = true;
    updateMusicButton();
}

function updateMusicButton() {
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) {
        musicBtn.textContent = isMuted ? '🔇' : '🔊';
    }
}

function closeModal() {
    const modal = document.getElementById('musicAlertModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createMusicAlert();

    const confirmBtn = document.getElementById('confirmMusic');
    const declineBtn = document.getElementById('declineMusic');
    const musicBtn = document.getElementById('musicBtn');

    // 음악 컨트롤 버튼
    if (musicBtn) {
        musicBtn.addEventListener('click', function() {
            if (!sound) return;
            
            if (isMuted) {
                sound.volume(1.0);
                isMuted = false;
            } else {
                sound.volume(0);
                isMuted = true;
            }
            updateMusicButton();
        });
    }

    // '예' 버튼 클릭
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            initializeAudio();
            closeModal();
        });
    }

    // '아니오' 버튼 클릭
    if (declineBtn) {
        declineBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // initializeAudio();
            // closeModal();
            window.location.href = 'https://forms.gle/FLMyisC5LcKMUm2p8';
        });
    }
});