jQuery(function () {
 
 
  /* Footer - Accordion Visiblity */
  if (getglobalLib("Footer_Accordion") == "yes") {
    $(".js__accordion-toggle-visiblity").addClass("accordion-toggle-footer");
    $(".js__accordion-content-visiblity").addClass("accordion-content-footer");
  }
  /* FAQ - Category Sidebar Visiblity */
  if (getglobalLib("FAQ_Side_Panel") == "yes") {
    $(".js__faq-category-side-panel").removeClass("hide");
  }
  if (getglobalLib("Product_Recommendation_Slider") == "on") {
    $("#js__pdp-recommendation-slider").not(".slick-initialized").slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      dots: false,
      centerMode: false,
      infinite: false,
      focusOnSelect: true,
      variableWidth: true,
      draggable: true,
    });
  }
});
