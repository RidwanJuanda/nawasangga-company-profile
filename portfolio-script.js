// Portfolio Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.classList.remove('hide');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hide');
                    item.style.display = 'none';
                }
            });
        });
    });

    // Image Modal/Popup with Drag and Pinch Zoom
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    const galleryImages = document.querySelectorAll('.gallery-image');

    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    let scale = 1;
    let lastScale = 1;
    let initialDistance = 0;
    let currentX = 0;
    let currentY = 0;

    // Open modal on image click (portfolio images)
    portfolioImages.forEach(img => {
        img.addEventListener('click', function() {
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            modal.classList.add('active');
            resetImageTransform();
        });
    });

    // Open modal on image click (gallery images)
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            modal.classList.add('active');
            resetImageTransform();
        });
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        resetImageTransform();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            resetImageTransform();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            resetImageTransform();
        }
    });

    // Reset image transform
    function resetImageTransform() {
        scale = 1;
        lastScale = 1;
        currentX = 0;
        currentY = 0;
        modalImage.style.transform = 'translate(0, 0) scale(1)';
    }

    // Mouse drag functionality
    modalImage.addEventListener('mousedown', function(e) {
        if (scale > 1) {
            isDragging = true;
            startX = e.pageX - currentX;
            startY = e.pageY - currentY;
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.pageX - startX;
        currentY = e.pageY - startY;
        modalImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Mouse wheel zoom
    modalImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        scale = Math.max(1, Math.min(scale * delta, 5));
        modalImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    });

    // Touch events for mobile (drag and pinch)
    let touchStartDistance = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let initialTouchX = 0;
    let initialTouchY = 0;

    modalImage.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            // Single touch - drag
            touchStartX = e.touches[0].clientX - currentX;
            touchStartY = e.touches[0].clientY - currentY;
        } else if (e.touches.length === 2) {
            // Two touches - pinch zoom
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialTouchX = (touch1.clientX + touch2.clientX) / 2;
            initialTouchY = (touch1.clientY + touch2.clientY) / 2;
        }
    });

    modalImage.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && scale > 1) {
            // Single touch - drag
            e.preventDefault();
            currentX = e.touches[0].clientX - touchStartX;
            currentY = e.touches[0].clientY - touchStartY;
            modalImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        } else if (e.touches.length === 2) {
            // Two touches - pinch zoom
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            if (initialDistance > 0) {
                scale = Math.max(1, Math.min(lastScale * (currentDistance / initialDistance), 5));
                modalImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
            }
        }
    });

    modalImage.addEventListener('touchend', function(e) {
        if (e.touches.length === 0) {
            lastScale = scale;
        }
    });
});

