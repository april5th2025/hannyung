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
  async function loadGalleryImages() {
      try {
          // Get all files from the directory
          const files = await listImagesInDirectory('img/hannyung/');
          imagePaths = files.sort(); // Sort files alphabetically

          // Create gallery items
          imagePaths.forEach((imagePath, index) => {
              const gridItem = document.createElement('div');
              gridItem.className = 'grid-item';
              gridItem.setAttribute('data-index', index);

              const img = document.createElement('img');
              img.src = imagePath;
              img.alt = `Wedding Photo ${index + 1}`;
              img.loading = 'lazy';

              gridItem.appendChild(img);
              galleryGrid.appendChild(gridItem);

              // Add click event
              gridItem.addEventListener('click', () => {
                  openModal(index);
              });
          });

          // Initialize Masonry layout after images are loaded
          initializeMasonry();
      } catch (error) {
          console.error('Error loading gallery images:', error);
      }
  }

  // Function to get all image files from directory
  async function listImagesInDirectory(directoryPath) {
      // This is a simple implementation. You'll need to modify this based on your server setup
      // For this example, we'll assume all files in the directory are images
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      const files = [];
      
      // In a real implementation, you might want to fetch this list from your server
      // For now, we'll manually handle the files we know exist
      for (let i = 1; i <= 20; i++) {
          const paddedNumber = String(i).padStart(2, '0');
          const filename = `${directoryPath}${paddedNumber}.jpg`;
          files.push(filename);
      }

      return files;
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

  // Update navigation buttons visibility
  function updateNavigationButtons() {
      prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
      nextBtn.style.display = currentIndex === imagePaths.length - 1 ? 'none' : 'block';
  }

  // Initialize Masonry layout
  function initializeMasonry() {
      const allImages = galleryGrid.getElementsByTagName('img');
      let loadedImages = 0;

      function checkAllImagesLoaded() {
          loadedImages++;
          if (loadedImages === allImages.length) {
              // All images are loaded, initialize any additional layout logic here if needed
              console.log('All images loaded');
          }
      }

      // Add load event listener to all images
      Array.from(allImages).forEach(img => {
          if (img.complete) {
              checkAllImagesLoaded();
          } else {
              img.addEventListener('load', checkAllImagesLoaded);
          }
      });
  }

  // Start loading images
  loadGalleryImages();
});