const burger = document.querySelector(".header__mobile");
const nav = document.querySelector(".header__nav");
const langSwitch = document.querySelector(".lang-switch");

burger?.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav?.classList.toggle("active");
  langSwitch?.classList.toggle("active");
});

// Privacy modal (guarded for pages without modal)
const privacyLink = document.querySelector('.footer__content-policy');
const modal = document.getElementById('privacy-modal');
const modalClose = document.getElementById('modal-close');
const modalOverlay = modal ? modal.querySelector('.modal__overlay') : null;

privacyLink?.addEventListener('click', (e) => {
  if (!modal) return;
  e.preventDefault();
  modal.classList.add('active');
});

modalClose?.addEventListener('click', () => {
  modal?.classList.remove('active');
});

modalOverlay?.addEventListener('click', () => {
  modal?.classList.remove('active');
});

// Cookie popup
const cookiePopup = document.getElementById('cookie');
const cookieAccept = document.getElementById('cookie-accept');

if (cookiePopup && !localStorage.getItem('cookieAccepted')) {
  cookiePopup.classList.add('active');
}

cookieAccept?.addEventListener('click', () => {
  localStorage.setItem('cookieAccepted', 'true');
  cookiePopup?.classList.remove('active');
});

// Sliders
const transformationSwiper = document.querySelector('.transformations__slider') && new Swiper('.transformations__slider', {
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 32,
  loop: true,
  navigation: {
    nextEl: '.transformations__next',
    prevEl: '.transformations__prev',
  },
  breakpoints: {
    768: { 
      slidesPerView: 1,
      spaceBetween: 32
    },
    480: { 
      slidesPerView: 1,
      spaceBetween: 16
    },
    320: { 
      slidesPerView: 1,
      spaceBetween: 16
    },
  },
});

const mainSwiper = document.querySelector('.main-slider') && new Swiper('.main-slider', {
  slidesPerView: 4,
  spaceBetween: 20,
  loop: true,
  grabCursor: true,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
  speed: 10000,
  freeMode: false,
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});

const journeySwiper = document.querySelector('.journey') && new Swiper('.journey', {
  slidesPerView: 3,
  spaceBetween: 32, 
  loop: true,
  navigation: {
    nextEl: '.transformations__next',
    prevEl: '.transformations__prev',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});

const playSwiper = document.querySelector('.play-slider') && new Swiper('.play-slider', {
  slidesPerView: 4,
  spaceBetween: 20,
  loop: true,
  grabCursor: true,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
  speed: 10000,
  freeMode: false,
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  }
});

// Simple scroll animations (no external deps)
(function initScrollAnimations() {
  const animatedSelectors = [
    '.hero__content', '.hero__image', '.section-title', '.project-card',
    '.services-section__list-item', '.transformations__item', '.section-promotion__item',
    '.tools-section__card', '.characters__title', '.character-card', '.journey-slide',
    '.section-courses__title', '.course-card', '.products-section .product-card',
    '.hero-play-section__content', '.main-slider__slide', '.play-slider__slide'
  ];
  const elements = Array.from(document.querySelectorAll(animatedSelectors.join(',')));
  if (!elements.length) return;

  // add base class and stagger delays
  elements.forEach((el, idx) => {
    el.classList.add('aos');
    el.style.setProperty('--aos-delay', `${(idx % 10) * 60}ms`);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos--in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => io.observe(el));
})();
