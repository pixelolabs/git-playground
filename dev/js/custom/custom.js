jQuery(function () {
  /* SLIDER */
  /* Hero Banner SLider */
  $(".js__hero-slider").not(".slick-initialized").slick({
    dots: true,
    slidesToShow: 1,
    arrows: false,
    infinite: true,
    speed: 500,
    draggable: false,
    cssEase: "ease-in-out",
    autoplay: false,
    adaptiveHeight: true,
  });

  $(".js__product-slider-section")
    .not(".slick-initialized")
    .slick({
      dots: false,
      arrows: true,
      slidesToShow: 2,
      infinite: false,
      speed: 500,
      draggable: false,
      cssEase: "ease-in-out",
      autoplay: false,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 1260,
          settings: {
            variableWidth: true,
            slidesToShow: 1,
          },
        },
      ],
    });

  $(".js__full-width-testimonial-slider").not(".slick-initialized").slick({
    dots: true,
    slidesToShow: 1,
    arrows: false,
    infinite: true,
    speed: 500,
    draggable: false,
    cssEase: "ease-in-out",
    autoplay: false,
    adaptiveHeight: true,
  });

  $(".js-timeline-nav").slick({
    asNavFor: ".js__timeline-slider",
    focusOnSelect: true,
    arrows: false,
    infinite: false,
    dots: false,
    variableWidth: false,
    slidesToShow: 9,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 981,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 481,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".js__timeline-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    asNavFor: ".js-timeline-nav",
    cssEase: "ease-in-out",
    speed: 500,
    autoplay: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          arrows: true,
        },
      },
    ],
  });

  /* Collection selected*/
  $(document).ready(function ($) {
    $(".js__collections-select").change(function () {
      window.location = $(this).val();
    });

    /*Dropdown selected*/
    $(".js__collection-content li").each(function (index) {
      var value = $(this).attr("data-url").toLowerCase();
      if (window.location.href.toLowerCase().indexOf(value) > -1) {
        $(this).addClass("active");
        $(".js__collections-select").val($(this).attr("data-url"));
      }
    });
  });

  try {
    var pageTotal = parseInt($(".js__total-page").val());
    var currentPage = parseInt($(".js__current-page").val());
    var itemTotal = parseInt($(".js__items-count").val());
    var perPageItem = parseInt($(".js__perpage-item").val());
    var itemStart = 1;
    var itemEnd = 0;
    if (currentPage > 1) {
      itemStart = perPageItem * (currentPage - 1) + 1;
    }
    itemEnd = itemStart + perPageItem - 1;
    if (pageTotal == currentPage) {
      itemEnd = itemTotal;
    }
    $(".js__page-range").html(itemStart + " - " + itemEnd);
  } catch {}

  /* SLIDER */

  /* PDP
  PRoduct Recommendation SLider */
  $("#js-pdp-recommendation-slider").not(".slick-initialized").slick({
    dots: false,
    slidesToShow: 5,
    arrows: false,
    infinite: false,
    speed: 500,
    cssEase: "ease-in-out",
    autoplay: false,
    variableWidth: true,
    draggable: true,
  });

  /* PDP
  Tab working */
  $(".tab-link").on("click", function () {
    var dataId = $(this).attr("data-attr");
    var i, tabcontent, tablink;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablink = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablink.length; i++) {
      tablink[i].className = tablink[i].className.replace(" active", "");
    }
    document.getElementById(dataId).style.display = "block";
    event.currentTarget.className += " active";

    /*PDP select*/
    $(".js__pdp-tab-select").val(dataId);
  });

  /* GLOBAL
  Scroll to particular Div with # value */
  $('a[href^="#"]').on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $(".tab-head").hide();
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 150,
          },
          1000
        );
    }
  });
  $(".js__accordian").children("li:first-child").addClass("active");
  /* accordion working about content in small screen*/
  $(".js__accordian")
    .children("li")
    .children("h5,h6,h3")
    .click(function (e) {
      if ($(this).parent("li").children(".content").css("display") == "none") {
        $(this)
          .parent("li")
          .parent(".js__accordian")
          .children("li")
          .children(".content")
          .hide();
        $(this)
          .parent("li")
          .parent(".js__accordian")
          .children("li")
          .removeClass("active");
        $(this).parent("li").children(".content").slideDown();
        $(this).parent("li").addClass("active");
        /* $('html,body').animate({
          scrollTop: $(this).offset().top - 120
        }, 500);*/
      } else {
        $(this).parent("li").children(".content").slideUp();
        $(this).parent("li").removeClass("active");
      }
    });
});

/** Dropdown **/
jQuery(function ($) {
  $(".js__dropdown_result").on("click", function () {
    if ($(".js__dropdown").css("display") == "none") {
      $(".js__dropdown").slideDown(300);
    } else {
      $(".js__dropdown").slideUp(300);
    }
    $(this).toggleClass("active");
  });
  var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
  $(".js__dropdown li a").each(function () {
    if (this.href === path) {
      $(this).addClass("active");
      console.log($(this).html());
      if ($(this).html() != "view all") {
        $(".js__dropdown_result").html($(this).html());
      }
      $(".js__dropdown").slideUp(300);
      $(".js__dropdown_result").removeClass("active");
    }
  });
  $(".js__active-class li a").each(function () {
    if (this.href === path) {
      $(".js__active-class li a").removeClass("active");
      $(this).addClass("active");
    }
  });
});
/* Mini cart - Checkout Button visiblity fix for IOS Mobile */
var lastScroll = 0;
jQuery(document).ready(function ($) {
  $(".cart-sidebar__middle").addClass("safari-mobile");

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > lastScroll) {
      $(".cart-sidebar__middle").removeClass("safari-mobile");
    } else if (scroll < lastScroll) {
      $(".cart-sidebar__middle").addClass("safari-mobile");
    }
    lastScroll = scroll;
  });
});

/** Dropdown **/
jQuery(function ($) {
  /*Blog dropdown*/
  $(".js__blog-select").change(function () {
    window.location = $(this).val();
  });
  /*Dropdown selected*/
  $(".js__blog-select option").each(function (index) {
    var value = $(this).val().toLowerCase();
    if (window.location.href.toLowerCase().indexOf(value) > -1) {
      $(".js__blog-select").val($(this).val());
    }
  });
});

jQuery(function ($) {
  $(".js--open-rates-popup").on("click", function () {
    $(".js__rates-popup").show();
  });

  $(".js__modal-close").on("click", function () {
    $(".modal").hide();
  });
});
/*Filter Hide click*/
$(document).on("click", ".js__hide-filter", function () {
  $(".boost-pfs-filter-left-col").toggle();
  $(".collection__product-list").toggleClass("full");
  $(".boost-pfs-filter-right-col").toggleClass("full");
  $(".js__colelction-column-product-card-slider").slick("refresh");

  if ($(".js__hide-filter").html() == "Hide Filters") {
    $(".js__hide-filter").html("Show Filters");
  } else {
    $(".js__hide-filter").html("Hide Filters");
  }
});

/*First tab link and first tab content active */
jQuery(document).ready(function ($) {
  $(".tab-link").first().addClass("active");
  $(".shopify-section .tab-content").first().show();
});

/*Select Dropdown change wit Tab */
jQuery(function () {
  var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
  $(".dropdown-select option").each(function () {
    if (this.value.toLowerCase() == path.toLowerCase()) {
      this.setAttribute("selected", true);
    }
  });

  $(".dropdown-select").change(function () {
    var dropdown = $(".dropdown-select").val();
    //first hide all tabs again when a new option is selected
    $(".tab-content").hide();
    //then show the tab content of whatever option value was selected
    $("#" + "tab-" + dropdown).show();
  });
});
