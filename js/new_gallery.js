document.addEventListener('DOMContentLoaded', function() {
  const galleryGrid = document.getElementById('gallery-grid');
  const modal = document.querySelector('.modal-overlay');
  const modalImg = document.querySelector('#modal-image');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.nav-button.prev');
  const nextBtn = document.querySelector('.nav-button.next');
  let currentIndex = 0;
  let imagePaths = [];

  // Function to load images from directory
  function loadGalleryImages() {
      try {
          const directoryPath = 'img/hannyung/';
          // 최대 50개까지 시도 (넉넉하게 설정)
          for (let i = 1; i <= 50; i++) {
              const paddedNumber = String(i).padStart(2, '0');
              const imagePath = `${directoryPath}${paddedNumber}.jpg`;
              
              const gridItem = document.createElement('div');
              gridItem.className = 'grid-item';
              gridItem.setAttribute('data-index', imagePaths.length);

              const img = document.createElement('img');
              img.src = imagePath;
              img.alt = `Wedding Photo ${imagePaths.length + 1}`;
              img.loading = 'lazy';

              // 이미지 로드 에러 처리
              img.onerror = () => {
                  gridItem.remove(); // 이미지가 없으면 해당 아이템 제거
              };

              // 이미지 로드 성공 시
              img.onload = () => {
                  imagePaths.push(imagePath);
                  gridItem.setAttribute('data-index', imagePaths.length - 1);

                  // 클릭 이벤트 추가
                  gridItem.addEventListener('click', () => {
                      openModal(imagePaths.length - 1);
                  });
              };

              gridItem.appendChild(img);
              galleryGrid.appendChild(gridItem);
          }
      } catch (error) {
          console.error('Error loading gallery images:', error);
      }
  }

  function openModal(index) {
      modal.style.display = 'flex';
      modalImg.src = imagePaths[index];
      currentIndex = index;
      updateNavigationButtons();
  }

  // Close modal
  closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Previous image
  prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + imagePaths.length) % imagePaths.length;
      modalImg.src = imagePaths[currentIndex];
      updateNavigationButtons();
  });

  // Next image
  nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % imagePaths.length;
      modalImg.src = imagePaths[currentIndex];
      updateNavigationButtons();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') {
          if (e.key === 'ArrowLeft') {
              prevBtn.click();
          } else if (e.key === 'ArrowRight') {
              nextBtn.click();
          } else if (e.key === 'Escape') {
              closeBtn.click();
          }
      }
  });

  function updateNavigationButtons() {
      prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
      nextBtn.style.display = currentIndex === imagePaths.length - 1 ? 'none' : 'block';
  }

  // Start loading images
  loadGalleryImages();
});