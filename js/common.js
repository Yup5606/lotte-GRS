$(function() {

  const $window = $(window);
  const $header = $('#lt-header');
  const $gnb = $('#lt-gnb');
  const $sitemapBtn = $('.sitemap-btn');
  const $langWrap = $('.lang-wrap');
  const $langBtn = $('.lang-btn-box');
  const $langList = $('.lang-list-inner');

  /* =========================
    1. 사이트맵 열기/닫기
  ========================= */

  function openGnb() {
    $gnb.addClass('active');
    $('body').addClass('fixed');
  }

  function closeGnb() {
    $gnb.removeClass('active');
    $('body').removeClass('fixed');
    closeLang();
  }

  $sitemapBtn.on('click', function() {
    $gnb.hasClass('active') ? closeGnb() : openGnb();
  });

  $('.gnb-close').on('click', function() {
    closeGnb();
  });

  /* =========================
    2. 헤더 테마 변경
  ========================= */

  function changeHeaderTheme() {

    const scrollTop = $window.scrollTop();
    const headerHeight = $header.outerHeight();

    $('section').each(function() {

      const $section = $(this);

      const sectionTop = $section.offset().top - headerHeight;
      const sectionBottom = sectionTop + $section.outerHeight();

      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {

        const theme = $section.data('header');

        $header.removeClass('header-light header-dark');

        if (theme === 'dark') {
          $header.addClass('header-dark');
        } else {
          $header.addClass('header-light');
        }

      }

    });

  }

  $window.on('scroll', function() {
    changeHeaderTheme();
  });

  changeHeaderTheme();

  /* =========================
    3. 언어 선택 토글
  ========================= */

  function openLang() {
    $langBtn.addClass('open');
    $langList.show();
  }

  function closeLang() {
    $langBtn.removeClass('open');
    $langList.hide();
  }

  $langBtn.on('click', function(e) {

    e.stopPropagation();

    $langBtn.hasClass('open')
      ? closeLang()
      : openLang();

  });

  $(document).on('click', function(e) {

    if (!$(e.target).closest('.lang-wrap').length) {
      closeLang();
    }

  });

  /* =========================
    4. 모바일 아코디언 메뉴
  ========================= */

  $('.depth1 > a').on('click', function(e) {

    if ($(window).width() < 1280) {

      e.preventDefault();

      $(this)
        .next('.depth2')
        .stop()
        .slideToggle();

      $('.depth2')
        .not($(this).next())
        .slideUp();

    }

  });

});