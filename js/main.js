$(function () {

  const SLIDE_TIME = 6000;

  const visualSwiper = new Swiper('.visual-container', {
    init: false,
    effect: "fade",
    loop: true,
    speed: 800,
    allowTouchMove: false,

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  const slides = document.querySelectorAll('.visual-container .swiper-slide');

  let timer = null;

  function resetSlides() {
    slides.forEach(slide => {
      const video = slide.querySelector('video');
      const txt = slide.querySelector('.v-txt');

      if (video) {
        video.pause();
        video.currentTime = 0;
      }

      if (txt) {
        txt.classList.remove('animate');
      }
    });
  }

  function playActive() {
    const active = document.querySelector('.visual-container .swiper-slide-active');

    const video = active?.querySelector('video');
    const txt = active?.querySelector('.v-txt');

    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    if (txt) {
      txt.classList.remove('animate');
      void txt.offsetWidth;
      txt.classList.add('animate');
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      visualSwiper.slideNext();
    }, SLIDE_TIME);
  }

  // 스크롤 시 등장 애니메이션
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.brand-card').forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "all 0.6s ease-out";
    observer.observe(card);
  });
  
  /* ---- 소속 브랜드 탭 ---- */
  (function () {

    const tabItems = document.querySelectorAll('.ib-tab-item');
    const panels   = document.querySelectorAll('.ib-panel');

    if (!tabItems.length) return;

    tabItems.forEach(function (item) {
      item.querySelector('.ib-tab-btn').addEventListener('click', function () {
        const brand = item.dataset.brand;

        /* 탭 active 전환 */
        tabItems.forEach(function (t) { t.classList.remove('active'); });
        item.classList.add('active');

        /* 패널 전환 */
        panels.forEach(function (panel) {
          if (panel.dataset.brand === brand) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });

  }());

  /* ---- ESG 클릭 카드 스택 ---- */
  (function () {
    const esgStack = document.querySelector('.esg-stack');
    const esgCards = document.querySelectorAll('.esg-card');

    if (!esgStack || !esgCards.length) return;

    function setEsgState(type) {
      esgStack.classList.remove('state-e', 'state-s', 'state-g');
      esgStack.classList.add(`state-${type}`);

      esgCards.forEach((card) => {
        card.classList.toggle('active', card.dataset.esg === type);
      });
    }

    setEsgState('e');

    esgCards.forEach((card) => {
      card.addEventListener('click', () => {
        setEsgState(card.dataset.esg);
      });
    });
  }());


  /* ---- News 스와이퍼 + 필터 ---- */
  (function () {
    const filterItems = document.querySelectorAll('.news-filter-item');
    const newsSwiperEl = document.querySelector('.news-swiper');
    const newsWrapper = document.querySelector('.news-swiper .swiper-wrapper');

    if (!filterItems.length || !newsSwiperEl || !newsWrapper) return;

    const originalCards = Array.from(newsWrapper.querySelectorAll('.news-card'));
    let newsSwiper = null;

    function getNewsOptions() {
      return {
        slidesPerView: 'auto',
        spaceBetween: 8,
        grabCursor: true,
        loop: false,
        watchOverflow: true,

        navigation: {
          nextEl: '.news-swiper-next',
          prevEl: '.news-swiper-prev',
          disabledClass: 'swiper-button-disabled',
        },

        pagination: {
          el: '.news-swiper-pagination',
          clickable: true,
        },

        breakpoints: {
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 16,
            grid: {
              rows: 2,
              fill: 'row',
            },
          },
          1280: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 20,
            grid: {
              rows: 2,
              fill: 'row',
            },
          },
        },
      };
    }

    function renderNewsCards(filter) {
      const cards = filter === 'all'
        ? originalCards
        : originalCards.filter((card) => card.dataset.category === filter);

      newsWrapper.innerHTML = '';

      cards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.remove('hidden');
        newsWrapper.appendChild(clone);
      });
    }

    function resetNewsSwiper() {
      if (newsSwiper) {
        newsSwiper.destroy(true, true);
      }

      newsSwiper = new Swiper('.news-swiper', getNewsOptions());
    }

    renderNewsCards('all');
    resetNewsSwiper();

    filterItems.forEach((item) => {
      item.querySelector('.news-filter-btn').addEventListener('click', () => {
        const filter = item.dataset.filter;

        filterItems.forEach((filterItem) => {
          filterItem.classList.remove('active');
        });

        item.classList.add('active');

        renderNewsCards(filter);
        resetNewsSwiper();
        newsSwiper.slideTo(0, 0);
      });
    });
  }());
  
  /* ---- Contact 맵 확장 모션 ---- */
  (function () {

    const contactSection = document.querySelector('.main-contact');
    if (!contactSection) return;

    let triggered = false;

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          setTimeout(function () {
            contactSection.classList.add('map-active');
          }, 1000);
        }
      });
    }, {
      threshold: 0.3
    });

    obs.observe(contactSection);

  }());

  visualSwiper.on('slideChangeTransitionStart', () => {
    resetSlides();
  });

  visualSwiper.on('slideChangeTransitionEnd', () => {
    playActive();
  });

  visualSwiper.init();
  playActive(); // init 이후 직접 호출

});