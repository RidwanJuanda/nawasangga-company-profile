document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
    document.querySelector('.main-nav')?.classList.remove('open');
  });
});

const links = Array.from(document.querySelectorAll('.nav-link'));
const sectionLinks = links.filter((l) => {
  const href = l.getAttribute('href') || '';
  return href.startsWith('#');
});
const sections = sectionLinks
  .map((l) => {
    const href = l.getAttribute('href');
    try { return document.querySelector(href); } catch { return null; }
  })
  .filter(Boolean);

const setActive = () => {
  const y = window.scrollY + 100;
  let current = null;
  sections.forEach((s) => {
    const top = s.offsetTop;
    if (y >= top) current = s;
  });
  links.forEach((l) => l.classList.remove('active'));
  if (current) {
    const id = '#' + current.id;
    const active = sectionLinks.find((l) => l.getAttribute('href') === id);
    active?.classList.add('active');
  }
};
if (sections.length > 0) {
  setActive();
  window.addEventListener('scroll', setActive);
}

// Path/hash based nav activation (works across pages)
const activateByPathHash = () => {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';

    // 1. HOME
    if (href === 'index.html' && currentPage === 'index.html' && currentHash === '') {
      link.classList.add('active');
    }
    // 2. ABOUT (index.html#about)
    if (href.includes('#about') && currentPage === 'index.html' && currentHash === '#about') {
      link.classList.add('active');
    }
    // 3. SERVICES (page) atau halaman lain selain index
    if (href === currentPage && currentPage !== 'index.html') {
      link.classList.add('active');
    }
  });
};
if (sections.length === 0) {
  activateByPathHash();
  window.addEventListener('hashchange', activateByPathHash);
}

const toggle = document.querySelector('.nav-toggle');
toggle?.addEventListener('click', () => {
  document.querySelector('.main-nav')?.classList.toggle('open');
});

document.querySelectorAll('a.cta[target="_blank"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href) window.open(href, '_blank');
  });
});

(function () {
    'use strict';

    let currentImageIndex = 0;
    let bannerInterval = null;
    const bannerImages = document.querySelectorAll('.hero-banner-image');
    const dotsWrap = document.querySelector('.slider-dots');
    const btnPrev = document.querySelector('.slider-btn.prev');
    const btnNext = document.querySelector('.slider-btn.next');

    function showBannerImage(index) {
        if (bannerImages.length === 0) return;

        bannerImages.forEach(img => img.classList.remove('active'));

        if (bannerImages[index]) {
            bannerImages[index].classList.add('active');
        }

        currentImageIndex = index;
        if (dotsWrap) {
          const dots = dotsWrap.querySelectorAll('button');
          dots.forEach(d => d.classList.remove('active'));
          if (dots[index]) dots[index].classList.add('active');
        }
    }

    function nextBannerImage() {
        const next = (currentImageIndex + 1) % bannerImages.length;
        showBannerImage(next);
    }
    function prevBannerImage() {
        const prev = (currentImageIndex - 1 + bannerImages.length) % bannerImages.length;
        showBannerImage(prev);
    }

    function startBannerSlider() {
        if (bannerInterval) {
            clearInterval(bannerInterval);
        }
        bannerInterval = setInterval(nextBannerImage, 4000);
    }

    function stopBannerSlider() {
        if (bannerInterval) {
            clearInterval(bannerInterval);
            bannerInterval = null;
        }
    }

    function initBannerSlider() {
        if (bannerImages.length === 0) {
            return;
        }

        if (dotsWrap) {
          dotsWrap.innerHTML = '';
          bannerImages.forEach((_, i) => {
            const b = document.createElement('button');
            if (i === 0) b.classList.add('active');
            b.addEventListener('click', () => {
              showBannerImage(i);
              startBannerSlider();
            });
            dotsWrap.appendChild(b);
          });
        }

        showBannerImage(0);
        startBannerSlider();

        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.addEventListener('mouseenter', stopBannerSlider);
            heroImage.addEventListener('mouseleave', startBannerSlider);
        }
        btnPrev?.addEventListener('click', () => {
          prevBannerImage();
          startBannerSlider();
        });
        btnNext?.addEventListener('click', () => {
          nextBannerImage();
          startBannerSlider();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBannerSlider);
    } else {
        initBannerSlider();
    }
})();
