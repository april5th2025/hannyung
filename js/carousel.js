class ImageCarousel {
    constructor() {
        this.track = document.getElementById('carousel-track');
        this.dotsContainer = document.getElementById('carousel-dots');
        this.modal = document.querySelector('.modal-overlay');
        this.modalImg = document.querySelector('#modal-image');
        this.currentIndex = 0;
        this.images = [];
        
        // 드래그 관련 변수
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.dragThreshold = 50; // 드래그 임계값

        this.initializeCarousel();
        this.setupEventListeners();
    }

    async initializeCarousel() {
        for (let i = 1; i <= 50; i++) {
            const paddedNumber = String(i).padStart(2, '0');
            const imagePath = `img/hannyung/${paddedNumber}.jpg`;

            try {
                const img = document.createElement('img');
                img.src = imagePath;
                
                img.onload = () => {
                    this.images.push(imagePath);
                    this.createSlide(imagePath);
                    this.updateDots();
                    this.updateSlidePositions();
                };
                
                img.onerror = () => {
                    // Skip failed images
                };
            } catch (error) {
                console.error('Error loading image:', error);
            }
        }
    }

    createSlide(imagePath) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Wedding Photo';
        img.draggable = false; // 이미지 기본 드래그 방지
        
        img.addEventListener('click', () => this.openModal(this.images.indexOf(imagePath)));
        
        slide.appendChild(img);
        this.track.appendChild(slide);
    }

    setupEventListeners() {
        // 캐러셀 터치/드래그 이벤트
        this.setupDragListeners(this.track);
        
        // 모달 터치/드래그 이벤트
        this.setupDragListeners(this.modal);

        // 네비게이션 버튼
        document.querySelector('.carousel-button.prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.carousel-button.next').addEventListener('click', () => this.nextSlide());

        // 모달 컨트롤
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
                if (e.key === 'Escape') this.closeModal();
            }
        });
    }

    setupDragListeners(element) {
        // 마우스 이벤트
        element.addEventListener('mousedown', (e) => this.dragStart(e));
        element.addEventListener('mousemove', (e) => this.drag(e));
        element.addEventListener('mouseup', () => this.dragEnd());
        element.addEventListener('mouseleave', () => this.dragEnd());

        // 터치 이벤트
        element.addEventListener('touchstart', (e) => this.dragStart(e));
        element.addEventListener('touchmove', (e) => this.drag(e));
        element.addEventListener('touchend', () => this.dragEnd());
    }

    dragStart(e) {
        this.isDragging = true;
        this.startPos = this.getPositionX(e);
        this.track.style.transition = 'none';
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const currentPosition = this.getPositionX(e);
        this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
        
        if (this.modal.style.display === 'flex') {
            // 모달에서는 트랜스폼을 적용하지 않고 드래그 거리만 계산
        } else {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }

    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        
        if (Math.abs(movedBy) > this.dragThreshold) {
            if (movedBy < 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        } else {
            // 임계값보다 적게 이동했으면 원위치
            this.goToSlide(this.currentIndex);
        }
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    updateDots() {
        this.dotsContainer.innerHTML = '';
        this.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === this.currentIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    updateSlidePositions() {
        this.track.style.transition = 'transform 0.3s ease-in-out';
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.prevTranslate = -this.currentIndex * this.track.offsetWidth;
        this.currentTranslate = this.prevTranslate;
        
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlidePositions();
        if (this.modal.style.display === 'flex') {
            this.modalImg.src = this.images[this.currentIndex];
        }
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlidePositions();
        if (this.modal.style.display === 'flex') {
            this.modalImg.src = this.images[this.currentIndex];
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlidePositions();
    }

    openModal(index) {
        this.modal.style.display = 'flex';
        this.modalImg.src = this.images[index];
        this.currentIndex = index;
    }

    closeModal() {
        this.modal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageCarousel();
});