jQuery(function () {
  //Nav - Open and Close Mini cart

  if (getglobalLib("Mini_Cart") == "yes") {
    $(".js__cart-expand").on("click", function () {
      $("#CartSidebar").toggleClass("active");
      $("#cart_overlay").toggleClass("active");
      $(this).addClass("active");
    });
    $("#js__cart-close").on("click", function () {
      $("#CartSidebar").removeClass("active");
      $("#cart_overlay").removeClass("active");
      $(".js__cart-expand").removeClass("active");
    });
    $(".js__cart-expand").attr("href", "javascript:void(0)");
  }
  /* Cart - Free Shipping Progress bar Visiblity */
  if (getglobalLib("Free_Shipping_progressbar") == "yes") {
    $(".js__progressbar_visiblity").removeClass("hide");
  }

  /* Remove mini cart from the cart page */
  if ($(".cart-table-body")[0]) {
    $("#CartSidebar").remove();
    $("#cart_overlay").remove();
    $(".js__top-cart-form-actions").remove();
    $(".js__ajax-products-bind").remove();
    $(".mini-cart").removeClass("js__cart-expand");
    $(".mini-cart").attr("href", "/cart");
  }
  /* show no items in cart */
  if (CartJS.cart.item_count == 0) {
    $(".empty-cart-section").show();
    $(".js__show-cart-items-section").hide();
    $("#shopify-section-cart-recommendations").hide();
  } else {
    $(".empty-cart-section").hide();
  }
  /*Quantity Plus Minus for the textbox */
  $(".js__product-single__quantity .js__minus-qty").click(function () {
    decreaseQuantity();
  });
  $(".js__product-single__quantity .js__plus-qty").click(function () {
    increaseQuantity();
  });

  function increaseQuantity() {
    var productQuantity = $(".js__quantity-selector").val();
    productQuantity++;
    $(".js__quantity-selector").val(productQuantity);
  }

  function decreaseQuantity() {
    var productQuantity = $(".js__quantity-selector").val();
    if (productQuantity > 1) {
      productQuantity--;
    }
    $(".js__quantity-selector").val(productQuantity);
  }
});

/* 
NOTIFICATIONS SECTION
Show Noticiations On Success and Error
Note: This function isn't being used in every theme
Feel free to comment/uncomment as per the functionality
*/
function showCartSuccessMessage() {
  setTimeout(openMiniCart, 500);
  $("#cart-message").addClass("message-success");
  $("#cart-message").removeClass("message-error");
  $("#cart-message").html("Successfully added to cart!");
  $("#cart-message").show();
  setTimeout(function () {
    $("#cart-message").hide();
  }, 5000);
}
function showCartErrorMessage() {
  $("#cart-message").removeClass("message-success");
  $("#cart-message").addClass("message-error");
  $("#cart-message").html("Sorry! Seems like the product is out of stock");
  $("#cart-message").show();
  setTimeout(function () {
    $("#cart-message").hide();
  }, 5000);
}

function openMiniCart() {
  if (CartJS.cart.item_count > 0) {
    $("#CartSidebar").toggleClass("active");
    $("#cart_overlay").toggleClass("active");
  }
}

/* EVENT: When the cart request is completed everytime the below function is run */
$(document).on("cart.requestComplete", function (event, cart) {
  console.log("On cart request complete");
  reloadAjaxCartItemUsingCartAjaxObject(cart);
  //Progress Bar of shipping in cart and mini cart; Varies from theme to theme
  progressBar();
  //Show and hide empty cart depending upon the cart items
  setTimeout(function () {
    calculateSubTotalWithDiscount();
    addons();
  }, 1000);
});

// $(document).on("cart.requestStarted", function (event, cart) {console.log("Request started"); });
//$(document).on("cart.ready", function (event, cart) {});

/* currency formatter */
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
