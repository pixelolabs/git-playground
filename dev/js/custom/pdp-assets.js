$(document).ready(function ($) {
    /*Slider working Start*/
    /* Main SLIDER  initialization */
    $(".pdp-slider")
        .not(".slick-initialized")
        .slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            focusOnSelect: true,
            infinite: false,
            adaptiveHeight: false,
            variableWidth: false
        });

        
    if (getglobalLib("PDP_Slider_Thumbnail") == "vertical") {
        $(".js__pdp-thumbnail-slider")
            .not(".slick-initialized")
            .slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                dots: false,
                centerMode: false,
                infinite: false,
                focusOnSelect: true,
                focusOnChange: false,
                variableWidth: false,
                verticalSwiping: true,
                vertical: true,
               
                arrows: true,
                responsive: [{
                        breakpoint: 981,
                        settings: {
                            verticalSwiping: false,
                            vertical: false,
                            slidesToShow: 3,
                        },
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            vertical: false,
                            variableWidth: true,
                        },
                    },
                ],
            });
    } else {
        $(".js__pdp-thumbnail-slider")
            .not(".slick-initialized")
            .slick({
                slidesToShow: 6,
                slidesToScroll: 1,
                dots: false,
                centerMode: false,
                infinite: false,
                arrows: false,
                focusOnSelect: true,
                variableWidth: false,
              
                responsive: [{
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        variableWidth: true,
                    },
                }, ],
            });
    }

    /*PDP tab section drop down change*/
    $(".js__pdp-tab-select").change(function () {
        $(".tab-content").removeClass("active");
        $(".tab-content").hide();
        $("#"+$(this).val()).show();
        $("#"+$(this).val()).addClass("active");
        $(".tab-link").removeClass("active");
        $("#tab-link-"+$(this).val()).addClass("active");
      })
    

    

    /* Manual click of thumbnail of slider*/
    $(document).on("click", ".pdp-thumbnail li", function (e) {
         var slideno = $(this).index();
        $(".pdp-thumbnail li").removeClass("active");
        $(this).addClass("active");
        $(".pdp-slider").slick("slickGoTo", slideno);
       
        setTimeout(function () {
            $(".pdp-thumbnail").slick("slickGoTo", slideno);
          }, 500);
       /* var slideno = $(this).index();
        $(".pdp-thumbnail li").removeClass("active");
        $(this).addClass("active");
        console.log("slideno"+slideno);
       
        $(".pdp-slider").slick("slickGoTo", slideno);*/
    
    });
    /*Write review click*/
    $(".js__write-review-btn").click(function () {
        $(".tab-link").removeClass("active");
        $("#tab-link-reviews").addClass("active");
        $(".write-review-button").click();
        $(".tab-content").removeClass("active");
        $("#reviews").addClass("active");
        $(".spr-summary-actions-newreview").click();
        var target = $(".pdp-review-section");
        setTimeout(function () {
            $("html, body").animate({
                    scrollTop: target.offset().top - 200,
                },
                500
            );
        }, 500);
    });
    /*View details*/
    $(document).on("click", ".js__pdp-view-details", function (e) {
        e.preventDefault();
        $(".tab-link").removeClass("active");
        $(".tab-head li:first-child").children(".tab-link").addClass("active");
    
        $(".tab-content").removeClass("active");
        $(".tab-content:first-child").addClass("active");
        $(".tab-content").hide();
        $(".tab-content:first-child").show();
        $(".js__pdp-tab-select").val($(".tab-head li:first-child").children(".tab-link").attr("data-attr"));
    
        setTimeout(function () {
          var target = $(".tab-content:first-child");
          $("html, body").animate(
            {
              scrollTop: target.offset().top - 350,
            },
            500
          );
        }, 500);
      });
  
    /*Slider working End*/
    /* Call page load functions */
    setTimeout(function () {
        setColorThumbImages();
    }, 1000);
    /* FORMATTING: Loop Through each color thumb and set the images for them through the product color library object */
    function setColorThumbImages() {
        if ($(".js-variant-color-swatch li")[0]) {
            $(".js-variant-color-swatch  li").each(function (index) {
                var color = $(this).attr("data-color");
                var colorValue = getVariantColor(color);
                //$(this).children("div.color").css("background-color", colorValue);
                if (colorValue == "") {
                    $(this).children("img").css("opacity", "0");
                }
                $(this).children("img").attr("src", colorValue);
            });
        }
    }
})
/*PENDING Get Variant Color*/
function getVariantColor(color) {
    try {
        var variantColorValue = "";
        $.each(prodColor, function (key, value) {
            if (color.toLowerCase() == value.title.toLowerCase()) {
                variantColorValue = value.color;
            }
        })
        /* $.each(prodLib, function (key, value) {
           if (color.toLowerCase() == value.option1.toLowerCase()) {
             variantColorValue = value.image;
           }
         });*/
        return variantColorValue;
    } catch {}
}
/* Color swatch click*/
$(document).ready(function ($) {
    $(document).on("mouseenter", ".js__product-cart-color li", function () {
        var productID = $(this).attr("data-product-id");
        var variantImage = $(this).attr("data-image");
        var featuredImage = $(this).attr("data-featured_image");
        if (variantImage.indexOf("no-image-") == -1) {
            $(".js__product-image-" + productID).attr("src", variantImage);
        } else {
            $(".js__product-image-" + productID).attr("src", featuredImage);
        }
    })
    $(document).on("mouseleave", ".js__product-cart-color li", function () {
        var productID = $(this).attr("data-product-id");
        var  featuredImage= $(".js__product-image-" + productID).attr("data-src");
        $(".js__product-image-" + productID).attr("src", featuredImage);
        
    })
})



    