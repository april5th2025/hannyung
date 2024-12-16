class ImageCarousel {
    constructor() {
        this.track = document.getElementById('carousel-track');
        this.dotsContainer = document.getElementById('carousel-dots');
        this.modal = document.querySelector('.modal-overlay');
        this.modalImg = document.querySelector('#modal-image');
        this.currentIndex = 0;
        this.images = [];
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.initializeCarousel();
        this.setupEventListeners();
    }

    async initializeCarousel() {
        // Load images (adjust the number based on your actual images)
        for (let i = 1; i <= 50; i++) {
            const paddedNumber = String(i).padStart(2, '0');
            const imagePath = `img/hannyung/${paddedNumber}.jpg`;

            try {
                // Create image element to test if it exists
                const img = document.createElement('img');
                img.src = imagePath;
                
                img.onload = () => {
                    this.images.push(imagePath);
                    this.createSlide(imagePath);
                    this.updateDots();
                    this.updateSlidePositions();
                };
                
                img.onerror = () => {
                    // Image failed to load, skip it
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
        
        img.addEventListener('click', () => this.openModal(this.images.indexOf(imagePath)));
        
        slide.appendChild(img);
        this.track.appendChild(slide);
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
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelector('.carousel-button.prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.carousel-button.next').addEventListener('click', () => this.nextSlide());

        // Modal controls
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Touch events for mobile
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            const diff = this.touchStartX - this.touchEndX;
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
                if (e.key === 'Escape') this.closeModal();
            }
        });
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlidePositions();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlidePositions();
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

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageCarousel();
});