const updateActiveNav = () => {
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const currentHash = window.location.hash;

  navLinks.forEach((l) => l.classList.remove("active"));

  const pageSections = [];
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    let targetPath = currentPath;
    let targetHash = "";

    if (href.startsWith("#")) {
      targetHash = href;
    } else {
      const parts = href.split("#");
      targetPath = parts[0] ? parts[0].split("/").pop() : currentPath;
      if (parts.length > 1) {
        targetHash = "#" + parts[1];
      }
    }

    if (targetPath === currentPath && targetHash && targetHash !== "#") {
      try {
        const el = document.querySelector(targetHash);
        if (el) pageSections.push({ link, el, targetHash });
      } catch (e) {}
    }
  });

  let activeLink = null;
  const scrollPos = window.scrollY + Math.max(120, window.innerHeight / 3);

  if (pageSections.length > 0) {
    let currentSection = null;
    pageSections.forEach((item) => {
      const topOffset = item.el.getBoundingClientRect().top + window.scrollY;
      if (scrollPos >= topOffset) {
        currentSection = item;
      }
    });
    if (currentSection) {
      activeLink = currentSection.link;
    }
  }

  if (!activeLink) {
    const exactMatch = navLinks.find((link) => {
      const href = link.getAttribute("href") || "";
      let targetPath = currentPath;
      if (!href.startsWith("#")) {
        const parts = href.split("#");
        targetPath = parts[0] ? parts[0].split("/").pop() : currentPath;
      }
      return (
        targetPath === currentPath &&
        !href.includes("#") &&
        currentPath !== "index.html"
      );
    });

    if (exactMatch) {
      activeLink = exactMatch;
    } else if (
      currentPath === "index.html" &&
      (!currentHash || currentHash === "")
    ) {
      activeLink = navLinks.find((l) => {
        const h = l.getAttribute("href") || "";
        return h === "#home" || h === "index.html";
      });
    }
  }

  if (activeLink) {
    activeLink.classList.add("active");
  }
};

updateActiveNav();
window.addEventListener("scroll", updateActiveNav);
window.addEventListener("hashchange", updateActiveNav);

document.querySelectorAll("a").forEach((a) => {
  const href = a.getAttribute("href");
  if (!href) return;
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  let isHashLinkForCurrentPage = false;
  let targetHash = "";

  if (href.startsWith("#") && href !== "#") {
    isHashLinkForCurrentPage = true;
    targetHash = href;
  } else if (href.includes("#")) {
    const parts = href.split("#");
    const pathPart = parts[0].split("/").pop() || "index.html";
    if (pathPart === currentPath) {
      isHashLinkForCurrentPage = true;
      targetHash = "#" + parts[1];
    }
  }

  if (isHashLinkForCurrentPage && targetHash) {
    a.addEventListener("click", (e) => {
      const el = document.querySelector(targetHash);
      if (!el) return;
      e.preventDefault();

      if (history.pushState) {
        history.pushState(null, null, targetHash);
      } else {
        window.location.hash = targetHash;
      }

      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
      document.querySelector(".main-nav")?.classList.remove("open");
      updateActiveNav();
    });
  }
});

window.addEventListener("load", () => {
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  }
});

const toggle = document.querySelector(".nav-toggle");
toggle?.addEventListener("click", () => {
  document.querySelector(".main-nav")?.classList.toggle("open");
});

document.querySelectorAll('a.cta[target="_blank"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const href = a.getAttribute("href");
    if (href) window.open(href, "_blank");
  });
});

(function () {
  "use strict";

  let currentImageIndex = 0;
  let bannerInterval = null;
  const bannerImages = document.querySelectorAll(".hero-banner-image");
  const dotsWrap = document.querySelector(".slider-dots");
  const btnPrev = document.querySelector(".slider-btn.prev");
  const btnNext = document.querySelector(".slider-btn.next");

  function showBannerImage(index) {
    if (bannerImages.length === 0) return;

    bannerImages.forEach((img) => img.classList.remove("active"));

    if (bannerImages[index]) {
      bannerImages[index].classList.add("active");
    }

    currentImageIndex = index;
    if (dotsWrap) {
      const dots = dotsWrap.querySelectorAll("button");
      dots.forEach((d) => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }
  }

  function nextBannerImage() {
    const next = (currentImageIndex + 1) % bannerImages.length;
    showBannerImage(next);
  }
  function prevBannerImage() {
    const prev =
      (currentImageIndex - 1 + bannerImages.length) % bannerImages.length;
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
      dotsWrap.innerHTML = "";
      bannerImages.forEach((_, i) => {
        const b = document.createElement("button");
        if (i === 0) b.classList.add("active");
        b.addEventListener("click", () => {
          showBannerImage(i);
          startBannerSlider();
        });
        dotsWrap.appendChild(b);
      });
    }

    showBannerImage(0);
    startBannerSlider();

    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
      heroImage.addEventListener("mouseenter", stopBannerSlider);
      heroImage.addEventListener("mouseleave", startBannerSlider);
    }
    btnPrev?.addEventListener("click", () => {
      prevBannerImage();
      startBannerSlider();
    });
    btnNext?.addEventListener("click", () => {
      nextBannerImage();
      startBannerSlider();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBannerSlider);
  } else {
    initBannerSlider();
  }
})();

// Modal popup logic
const popupState = {};

window.openPopup = (id) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Initialize slider state for this modal if not exist
    if (!popupState[id]) {
      popupState[id] = { currentIndex: 0 };
    }

    // Reset transform to current slide when opening
    const slidesContainer = modal.querySelector(".modal-slides");
    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${popupState[id].currentIndex * 100}%)`;
    }
  }
};

window.closePopup = (id) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
};

window.moveSlide = (slidesId, direction) => {
  const slidesContainer = document.getElementById(slidesId);
  if (!slidesContainer) return;

  const modal = slidesContainer.closest(".modal-overlay");
  if (!modal) return;
  const modalId = modal.id;

  if (!popupState[modalId]) {
    popupState[modalId] = { currentIndex: 0 };
  }

  const slides = slidesContainer.querySelectorAll(".modal-slide");
  let newIndex = popupState[modalId].currentIndex + direction;

  if (newIndex >= slides.length) {
    newIndex = 0;
  } else if (newIndex < 0) {
    newIndex = slides.length - 1;
  }

  popupState[modalId].currentIndex = newIndex;
  slidesContainer.style.transform = `translateX(-${newIndex * 100}%)`;
};

// Close modal when clicking outside content
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closePopup(overlay.id);
      }
    });
  });
});
