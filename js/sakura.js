class SakuraAnimation {
    constructor() {
        this.container = document.getElementById('sakura-container');
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        // 꽃잎 수 계산식 수정 (더 적은 수의 꽃잎)
        this.numberOfPetals = Math.floor((this.windowWidth * this.windowHeight) / 80000); 
        this.petals = [];
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            this.numberOfPetals = Math.floor((this.windowWidth * this.windowHeight) / 25000);
            this.updatePetals();
        });
    }

    init() {
        for (let i = 0; i < this.numberOfPetals; i++) {
            this.createPetal();
        }
    }

    createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('sakura');
        
        const sizes = ['small', 'medium', 'large'];
        petal.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
        
        const colors = ['pink-1', 'pink-2', 'pink-3'];
        petal.classList.add(colors[Math.floor(Math.random() * colors.length)]);
        
        this.resetPetal(petal);
        
        this.container.appendChild(petal);
        this.petals.push(petal);
    }

    resetPetal(petal) {
        const startX = Math.random() * this.windowWidth;
        const startY = -10;
        
        const fallDistance = this.windowHeight + 10;
        const moveX = (Math.random() - 0.5) * 150; // 좌우 이동 범위 줄임
        const rotateDeg = Math.random() * 360;
        // 낙하 시간을 늘림 (8~15초)
        const duration = 8 + Math.random() * 7;
        
        petal.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            --move-x: ${moveX}px;
            --fall-distance: ${fallDistance}px;
            --rotate-deg: ${rotateDeg}deg;
            animation-duration: ${duration}s;
        `;
    }

    updatePetals() {
        const currentPetals = this.petals.length;
        
        if (currentPetals < this.numberOfPetals) {
            for (let i = 0; i < this.numberOfPetals - currentPetals; i++) {
                this.createPetal();
            }
        } else if (currentPetals > this.numberOfPetals) {
            for (let i = 0; i < currentPetals - this.numberOfPetals; i++) {
                const petal = this.petals.pop();
                petal.remove();
            }
        }
    }

    animate() {
        this.petals.forEach(petal => {
            const rect = petal.getBoundingClientRect();
            if (rect.top > this.windowHeight || rect.left < -100 || rect.left > this.windowWidth + 100) {
                this.resetPetal(petal);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SakuraAnimation();
});