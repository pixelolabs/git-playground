jQuery(function () {
  /*Adding Tab index*/
  $("a").attr("tabindex", "0");
  $(".has-sub-nav").attr("tabindex", "0");
  $(".has-sub-nav").children(".site-nav__link").attr("tabindex", "-1");
  $(".ui-autocomplete-input").attr("tabindex", "0");
  $(".accordion-toggle-slide").attr("tabindex", "0");
  $(".accordion-toggle").attr("tabindex", "0");

  $("#PageContainer").attr("tabindex", "0");

  setTimeout(function () {
    console.log("top1");
    $(".boost-pfs-search-suggestion-mobile-overlay").remove();
    $(".boost-pfs-search-suggestion-mobile-top-panel").remove();
    $("#boost-pfs-search-box-mobile").attr("tabindex", "0");
    $(".top-search").attr("tabindex", "0");
    $("#boost-pfs-search-box-mobile").focus(function () {
      $(".js-cart-expand").click();
    });
    $(".top-search").focus(function () {
      console.log("top");
      $(".accessories-shop-menu .site-nav__link").removeClass("hover-submenu");
      $(".accordion-content").hide();
    });
  }, 1000);

  /*Hiding Mobile Menu */
  $("#PageContainer").focus(function (e) {
    if ($("#hamburger").hasClass("active")) {
      $("#hamburger").removeClass("active");
      $("#navbarNavDropdown").removeClass("active");
      $(".js__mobile-menu-open-hide").removeClass("active");
      $(".js__mobile-announcement-text").removeClass("active");
      if ($("#navbarNavDropdown").hasClass("active")) {
        $(".js__logo").addClass("active");
      } else {
        $(".js__logo").toggleClass("active");
      }
    }
  });
  /*Mobile account hide accordian*/
  $(".account-link")
    .children("a")
    .focus(function (e) {
      $(".accordion-toggle").removeClass("active");
      $(".accordion-content").hide();
    });

  /*Cart click*/
  $(".js-cart-expand").focus(function () {
    $(".js-cart-expand").click();
  });

  $("a.site-nav__link").focus(function () {
    $(".has-sub-nav").removeClass("focus-active");
    $(".has-sub-nav").removeClass("active");
    $(".accordion-toggle").removeClass("active");

    $(".accordion-content").removeClass("active");
  });

  $(".footer-social-links a").focus(function () {
    $(".accordion-toggle").removeClass("active");
    $(".accordion-content").slideUp(300);
  });

  $(".has-sub-nav").focus(function () {
    $(".has-sub-nav").removeClass("focus-active");
    $(this).addClass("focus-active");
    $(this).children(".accordion-toggle").click();
  });

  $(".has-sub-nav").mouseover(function () {
    $(".has-sub-nav").removeClass("focus-active");
  });

  $(".announcement-slider").focus(function () {
    console.log("a");
    $("#CartSidebar").removeClass("active");
    $(".js-cart-expand").removeClass("active");
    $("#cart_overlay").removeClass("active");
  });
});
