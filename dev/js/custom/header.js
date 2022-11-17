jQuery(function () {
  /* Global
  Announcement Slider */
  $(".js__announcement-slider").not(".slick-initialized").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 4000,
    infinite: false,
    vertical: true,
    cssEase: "ease-in-out",
    adaptiveHeight: false,
  });
  /* Announcement 
  Close on Click  */
  $("#announcement-close").on("click", function () {
    $(".announcement-bar").hide();
    $("body").removeClass("announcement-visible");
  });

  /* MEGAMENU
    active link while submenu open */
  if ($(window).width() > 980) {
    $(".has-sub-nav .site-nav__link,.has-sub-nav .sub-nav").mouseover(
      function () {
        $(".has-sub-nav .site-nav__link").addClass("hover-submenu");
        $(".has-sub-nav .sub-nav").css("visibility", "visible");
        $(".has-sub-nav .sub-nav").css("opacity", "1");
      }
    );
    $(".has-sub-nav .site-nav__link,.has-sub-nav .sub-nav").mouseout(
      function () {
        $(".has-sub-nav .site-nav__link").removeClass("hover-submenu");
        $(".has-sub-nav .sub-nav").css("visibility", "hidden");
        $(".has-sub-nav .sub-nav").css("opacity", "0");
      }
    );
    $(".has-big-nav .site-nav__link,.has-big-nav .big-nav").mouseover(
      function () {
        $(".has-big-nav .site-nav__link").addClass("hover-submenu");
        $(".has-big-nav .big-nav").css("visibility", "visible");
        $(".has-big-nav .big-nav").css("opacity", "1");
      }
    );
    $(".has-big-nav .site-nav__link,.has-big-nav .big-nav").mouseout(
      function () {
        $(".has-big-nav .site-nav__link").removeClass("hover-submenu");
        $(".has-big-nav .big-nav").css("visibility", "hidden");
        $(".has-big-nav .big-nav").css("opacity", "0");
      }
    );
  }

  /* SubMenu
  Accordion JS */
  (function ($) {
    $(function () {
      var navLink = false;
      $(".accordion-toggle")
        .on("mousedown", function (e) {
          "use strict";
          e.stopImmediatePropagation();
          if ($(this).parent("div").hasClass("footer-links")) {
            if ($(window).width() < 980) {
              if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).siblings(".accordion-content").slideUp(300);
              } else {
                $(".accordion-toggle").removeClass("active");
                $(this).addClass("active");
                $(".accordion-content").slideUp(300);
                $(this).siblings(".accordion-content").slideDown(300);
              }
            }
          } else {
            if ($(this).hasClass("active")) {
              $(this).removeClass("active");
              $(this).siblings(".accordion-content").slideUp(300);
            } else {
              $(".accordion-toggle").removeClass("active");
              $(this).addClass("active");
              $(".accordion-content").slideUp(300);
              $(this).siblings(".accordion-content").slideDown(300);
            }
          }
          navLink = true;
        })
        .focus(function (e) {
          "use strict";
          if (navLink) {
            navLink = false;
          } else {
            if ($(this).parent("div").hasClass("footer-links")) {
              if ($(window).width() < 980) {
                if ($(this).hasClass("active")) {
                  $(this).removeClass("active");
                  $(this).siblings(".accordion-content").slideUp(300);
                } else {
                  $(".accordion-toggle").removeClass("active");
                  $(this).addClass("active");
                  $(".accordion-content").slideUp(300);
                  $(this).siblings(".accordion-content").slideDown(300);
                }
              }
            } else {
              if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).siblings(".accordion-content").slideUp(300);
              } else {
                $(".accordion-toggle").removeClass("active");
                $(this).addClass("active");
                $(".accordion-content").slideUp(300);
                $(this).siblings(".accordion-content").slideDown(300);
              }
            }
          }
        });
    });
    $(function () {
      var navLink = false;
      $(".accordion-toggle-inner")
        .on("mousedown", function (e) {
          "use strict";
          e.stopImmediatePropagation();
          if ($(this).parent("div").hasClass("footer-links")) {
            if ($(window).width() < 980) {
              if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).siblings(".accordion-content-inner").slideUp(300);
              } else {
                $(".accordion-toggle-inner").removeClass("active");
                $(this).addClass("active");
                $(".accordion-content-inner").slideUp(300);
                $(this).siblings(".accordion-content-inner").slideDown(300);
              }
            }
          } else {
            if ($(this).hasClass("active")) {
              $(this).removeClass("active");
              $(this).siblings(".accordion-content-inner").slideUp(300);
            } else {
              $(".accordion-toggle-inner").removeClass("active");
              $(this).addClass("active");
              $(".accordion-content-inner").slideUp(300);
              $(this).siblings(".accordion-content-inner").slideDown(300);
            }
          }
          navLink = true;
        })
        .focus(function (e) {
          "use strict";
          if (navLink) {
            navLink = false;
          } else {
            if ($(this).parent("div").hasClass("footer-links")) {
              if ($(window).width() < 980) {
                if ($(this).hasClass("active")) {
                  $(this).removeClass("active");
                  $(this).siblings(".accordion-content-inner").slideUp(300);
                } else {
                  $(".accordion-toggle-inner").removeClass("active");
                  $(this).addClass("active");
                  $(".accordion-content-inner").slideUp(300);
                  $(this).siblings(".accordion-content-inner").slideDown(300);
                }
              }
            } else {
              if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).siblings(".accordion-content-inner").slideUp(300);
              } else {
                $(".accordion-toggle-inner").removeClass("active");
                $(this).addClass("active");
                $(".accordion-content-inner").slideUp(300);
                $(this).siblings(".accordion-content-inner").slideDown(300);
              }
            }
          }
        });
    });
  })(jQuery);

  /** HEADER **/
  /** Top Search Result Open Close **/
  $("#searchOpen").on("click", function () {
    $(".top-search-results").toggleClass("active");
  });
});
/** Fix Header on Scroll **/
$(window).scroll(function () {
  var sticky = $("header"),
    scroll = $(window).scrollTop();
  if (scroll >= 35) {
    sticky.addClass("fixed");
    $(".main-content").addClass("active");
  } else {
    sticky.removeClass("fixed");
    $(".main-content").removeClass("active");
  }
});
/** used when header is relative **/
/** Fix Header on Scroll **/
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", function () {
    var scrollHeight = 35;
    if (window.scrollY > scrollHeight) {
      document.getElementById("navbarNavDropdown").classList.add("fixed");
      // add padding top to show content behind navbar
      var navbar_height =
        document.querySelector(".navbar-collapse").offsetHeight;
      document.body.style.paddingTop = navbar_height + "px";
    } else {
      document.getElementById("navbarNavDropdown").classList.remove("fixed");
      // remove padding top from body
      document.body.style.paddingTop = "0";
    }
  });
});

/** Mobile Navigation Open Close **/
(function ($) {
  $(function () {
    var navLink = false;
    $("#hamburger")
      .mousedown(function (e) {
        $(this).toggleClass("active");
        $("#navbarNavDropdown").toggleClass("active");
        $(".js__mobile-menu-open-hide").toggleClass("active");
        $(".js__mobile-announcement-text").toggleClass("active");
        if ($("#navbarNavDropdown").hasClass("active")) {
          $(".js__logo").addClass("active");
        } else {
          $(".js__logo").toggleClass("active");
        }
        navLink = true;
      })
      .focus(function (e) {
        "use strict";
        if (navLink) {
        } else {
          $(this).toggleClass("active");
          $("#navbarNavDropdown").toggleClass("active");
          $(".js__mobile-menu-open-hide").toggleClass("active");
          $(".js__mobile-announcement-text").toggleClass("active");
          if ($("#navbarNavDropdown").hasClass("active")) {
            $(".js__logo").addClass("active");
          } else {
            $(".js__logo").toggleClass("active");
          }
        }
      });
  });
})(jQuery);

/** CART SIDEBAR
 * Close on Outside Click
 * **/
$(document).mouseup(function (e) {
  var popup = $("#CartSidebar");
  var overlay = $("#cart_overlay");
  if (!popup.is(e.target) && popup.has(e.target).length == 0) {
    popup.removeClass("active");
    overlay.removeClass("active");
  }
});
