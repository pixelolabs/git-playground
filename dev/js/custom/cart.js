// tweaks these below variable if you want to show subtotal and discount
var showCartSubTotalDiscountSection = true;
var showEmptyCartIcon = false;
var showCartCountInTopNav = true;
var showProgressBar = true;
var showVendorOnCartPage = false;
var enablePlusQuantity = false;
var disablePlusQuantityAfterNumber = 6;
var removeMiniCartTextOrIcon =
  "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><g stroke='#272F33' stroke-width='2' fill='none' fill-rule='evenodd'><path d='M2.929 17.071 17.07 2.93M2.929 2.929 17.07 17.07'/></g></svg>";

var plusIcon =
  '<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><g stroke="#2A1717" fill="none" fill-rule="evenodd"><path d="M0 5h10M5 0v10"/></g></svg>';
var minusIcon =
  '<svg width="10" height="1" viewBox="0 0 10 1" xmlns="http://www.w3.org/2000/svg"><path d="M0 .5h10" stroke="#2A1717" fill="none" fill-rule="evenodd"/></svg>';

// Fixed variables
var lineItemComparePrice;
var cartObject;
var cartCountEmptyValue = "0";
var boxID = "_Box ID";
//extra classes for the elements
var removeExtraClass = "btn-border-black-animate";

/* CUSTOM OFFERS */
//black friday main productID
var promoOfferQuantity = 0;
var boolPromoOffer_BlackFriday_ProductID = false;
//Replace on LIVE
var promoOffer_BlackFriday_ProductID = "6737920098374";
var promoOffer_BlackFriday_FreeBag_ProductID = "6737924587590";
// recharge 2020
var frequency = "";
var recurringchecked = false;
var frequency_unit = "";
$(document).ready(function ($) {
  reloadAjaxCartItemUsingCartAjaxObject();
  progressBar();
  quickCartTotal();
  calculateSubTotalWithDiscount();
  /*cart numeric type*/
  $(".js__cart__quantity-selector").keypress(function (event) {
    var keycode = event.keyCode || event.which;
    if (keycode == "13") {
      event.preventDefault();
      if ($(this).val() == "0") {
        $(this).val("1");
      }
      var lineCount = $(this).attr("data-cart-line-count");
      updateQuantity(lineCount);
      return false;
    }
  });
});
/*
EVENTS
1. Update quantity
2. minus quantity
3. plus quantity
4. remove item from cart
5. reload ajax cart
6. quickCartTotal
7. calculateSubTotalWithDiscount
8. cart.requestComplete
*/
//QUANTITY UPDATE
function updateQuantity(cartThis) {
  let lineItemCount = cartThis;
  lineItemCount = parseInt(lineItemCount);
  let itemPrice = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find(".js__raw-line-item-price")
    .text();
  itemPrice = itemPrice.replace(/[^0-9]/gi, "");
  itemPrice = parseInt(itemPrice);
  let lineItemComparePrice = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find(".js__raw-item-compare-price")
    .text()
    .replace(/[^0-9]/gi, "");
  lineItemComparePrice = parseInt(lineItemComparePrice);
  let variantID = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .attr("data-variant-id");
  variantID = parseInt(variantID);
  var newQuantity = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find("input[name='updates[]']")
    .val();
  newQuantity = parseInt(newQuantity);
  /* NOTE: you will not get Raw Inventory against the variant in API calls */
  /* PENDING, need to find a solution for this */
  /* Need to check stock levels for the variant 
  as cartJS is giving success even if the stock levels are low and not going into Error*/
  var rawStockVariantQuantity = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find("input[name='updates[]']")
    .attr("data-attr-raw-variant-quantity");
  /* If the new quantity is less then the stock then update the item */
  rawStockVariantQuantity = isNaN(rawStockVariantQuantity)
    ? "10000"
    : rawStockVariantQuantity;
  rawStockVariantQuantity = parseInt(rawStockVariantQuantity);
  if (newQuantity < rawStockVariantQuantity) {
    $("input[name='updates[]']")
      .filter('[data-cart-line-count="' + lineItemCount + '"]')
      .val(newQuantity);
    /* Update the item */
    CartJS.updateItem(
      lineItemCount,
      newQuantity,
      {},
      {
        success: function (data, textStatus, jqXHR) {
          //console.log(data);
          // //Rebind the line item price
          // reloadAjaxCartItemUsingCartAjaxObject(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          //console.log("Error: " + errorThrown + "!");
        },
        complete: function (jqXHR, textStatus, errorThrown) {
          //console.log(jqXHR);
          //console.log(textStatus);
          //console.log(errorThrown);
        },
      }
    );
  } else {
    /* Show a message out of stock */
    $(".js__cart-table-item-row ")
      .filter('[data-cart-line-count="' + lineItemCount + '"]')
      .find(".js__out-of-stock")
      .html("Out of stock");
    $(".js__cart-table-item-row ")
      .filter('[data-cart-line-count="' + lineItemCount + '"]')
      .find(".js__out-of-stock")
      .show();
    $(".js__cart-table-item-row ")
      .filter('[data-cart-line-count="' + lineItemCount + '"]')
      .find(".js__out-of-stock")
      .delay(2000)
      .fadeOut();
  }
}
function minusQuantity(cartThis) {
  // debugger;
  let lineItemCount = cartThis;
  lineItemCount = parseInt(lineItemCount);
  let itemPrice = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find(".js__raw-line-item-price")
    .text();
  itemPrice = itemPrice.replace(/[^0-9]/gi, "");
  itemPrice = parseInt(itemPrice);
  let lineItemComparePrice = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find(".js__raw-item-compare-price")
    .text()
    .replace(/[^0-9]/gi, "");
  lineItemComparePrice = parseInt(lineItemComparePrice);
  let variantID = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .attr("data-variant-id");
  variantID = parseInt(variantID);
  var newQuantity = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find("input[name='updates[]']")
    .val();
  newQuantity = parseInt(newQuantity);
  newQuantity = newQuantity - 1;
  $("input[name='updates[]']")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .val(newQuantity);

  // CUSTOM - Loop through properties to check if there is a product with PromoOffer, if yes, then set the bool to true
  let properties = loopThroughCartItems_on_VariantID(variantID);
  if (properties != null) {
    if (Object.keys(properties).length > 0) {
      $.each(properties, function (key, value) {
        if (key == "_promoOffer") {
          boolPromoOffer_BlackFriday_ProductID = true;
        }
      });
    }
  }

  if (newQuantity < 1) {
    removeItem(lineItemCount);
  } else {
    CartJS.updateItem(
      lineItemCount,
      newQuantity,
      {},
      {
        success: function (data, textStatus, jqXHR) {},
        error: function (jqXHR, textStatus, errorThrown) {
          //console.log("Error: " + errorThrown + "!");
        },
      }
    );
    /*
    if you want to update item by ID and not by line item then you can use updateItemId function
    Recommended - line item update
    CartJS.updateItemById(lineIndex, newQuantity);
    */
  }
  // CUSTOM -
  //if the promo main product exists and it's quantity is less then 2, then remove the promo free bag product
  // if promo main product quantity  = 1; then remove the free bag and update the promo main product quantity
  // if promo main product quantity  = 0; then remove the promo main product
  // update the quantity for the promo main product
  if (boolPromoOffer_BlackFriday_ProductID && newQuantity <= 1) {
    if (newQuantity == 1) {
      //console.log("BLACK FRIDAY: Quantity 1");
      //loop through the cart items to get the variant ID for the PROMO - Free bag product
      //console.log("BLACK FRIDAY: going to delete free bag ");
      let variantID = loopThroughCartItems_on_ProductID(
        promoOffer_BlackFriday_FreeBag_ProductID
      );
      removeItemById(variantID);
    }
  }
}
function plusQuantity(cartThis) {
  let lineItemCount = cartThis;
  lineItemCount = parseInt(lineItemCount);
  let itemPrice = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find(".js__raw-line-item-price")
    .text();
  itemPrice = itemPrice.replace(/[^0-9]/gi, "");
  itemPrice = parseInt(itemPrice);
  let lineItemComparePrice = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find(".js__raw-item-compare-price")
    .text()
    .replace(/[^0-9]/gi, "");
  lineItemComparePrice = parseInt(lineItemComparePrice);
  let variantID = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .attr("data-variant-id");
  variantID = parseInt(variantID);
  var newQuantity = $(".js__cart-table-item-row ")
    .filter('[data-cart-line-count="' + lineItemCount + '"]')
    .find("input[name='updates[]']")
    .val();
  newQuantity = parseInt(newQuantity);
  // Disable the PLUS quantity feature
  var proceedToUpdateQuantity = false;
  if (enablePlusQuantity) {
    if (newQuantity > disablePlusQuantityAfterNumber) {
      proceedToUpdateQuantity = true;
    }
  }

  if (proceedToUpdateQuantity == false) {
    newQuantity = newQuantity + 1;
    /* NOTE: you will not get Raw Inventory against the variant in API calls */
    /* PENDING, need to find a solution for this */
    /* Need to check stock levels for the variant 
    as cartJS is giving success even if the stock levels are low and not going into Error*/
    var rawStockVariantQuantity = $(".js__cart-table-item-row ")
      .filter('[data-cart-line-count="' + lineItemCount + '"]')
      .find("input[name='updates[]']")
      .attr("data-attr-raw-variant-quantity");
    /* If the new quantity is less then the stock then update the item */
    rawStockVariantQuantity = isNaN(rawStockVariantQuantity)
      ? "10000"
      : rawStockVariantQuantity;
    rawStockVariantQuantity = parseInt(rawStockVariantQuantity);
    if (newQuantity < rawStockVariantQuantity) {
      $("input[name='updates[]']")
        .filter('[data-cart-line-count="' + lineItemCount + '"]')
        .val(newQuantity);
      /* Update the item */
      CartJS.updateItem(
        lineItemCount,
        newQuantity,
        {},
        {
          success: function (data, textStatus, jqXHR) {
            //console.log(data);
            // //Rebind the line item price
            // reloadAjaxCartItemUsingCartAjaxObject(data);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            //console.log("Error: " + errorThrown + "!");
          },
          complete: function (jqXHR, textStatus, errorThrown) {
            //console.log(jqXHR);
            //console.log(textStatus);
            //console.log(errorThrown);
          },
        }
      );
    } else {
      /* Show a message out of stock */
      $(".js__cart-table-item-row ")
        .filter('[data-cart-line-count="' + lineItemCount + '"]')
        .find(".js__out-of-stock")
        .html("Out of stock");
      $(".js__cart-table-item-row ")
        .filter('[data-cart-line-count="' + lineItemCount + '"]')
        .find(".js__out-of-stock")
        .show();
      $(".js__cart-table-item-row ")
        .filter('[data-cart-line-count="' + lineItemCount + '"]')
        .find(".js__out-of-stock")
        .delay(2000)
        .fadeOut();
    }
  }
}
//REMOVE ITEM via lineItemCount
function removeItem(lineItemCount) {
  CartJS.removeItem(lineItemCount, {
    success: function (data, textStatus, jqXHR) {},
    error: function (jqXHR, textStatus, errorThrown) {
      //console.log('Error: ' + errorThrown + '!');
    },
  });
}
// REMOVE ITEM via variantID
//REMOVE ITEM
function removeItemById(variantID) {
  CartJS.removeItemById(variantID, {
    success: function (data, textStatus, jqXHR) {},
    error: function (jqXHR, textStatus, errorThrown) {
      //console.log('Error: ' + errorThrown + '!');
    },
  });
}
//RELOAD AJAX CART
function reloadAjaxCartItemUsingCartAjaxObject(data) {
  var lineCount = 1;
  var cartObject;
  //console.log(data);
  if (data == undefined) {
    cartObject = CartJS.cart;
  } else {
    cartObject = data;
    quickCartTotal(data);
  }
  $(".js__ajax-products-bind").html("");
  $(".cart-list").html("");
  $(cartObject.items).each(function () {
    var imageURL = this.featured_image.url;
    var imageAlt = this.featured_image.alt;
    var itemPrice = this.original_price;
    var itemLinePriceTotal = this.line_price;
    var handle = this.handle;
    var itemID = this.id;
    var itemPriceAfterDiscount = this.discounted_price;
    var comparePrice = "";
    let disabled = "";
    let finalLineItemPrice = this.final_line_price;
    let cartBundleBoxID = "";
    let boolPromoOffer = false;
    /*Bundle Free Bag Product*/
    if (this.properties != null) {
      itemProperties = this.properties;
      if (Object.keys(itemProperties).length > 0) {
        $.each(itemProperties, function (key, value) {
          /* If box ID exists, then remove quantity + -  working */
          if (key == boxID) {
            cartBundleBoxID = value;
          }
          if (key == "_promoOffer") {
            boolPromoOffer = true;
          }
        });
      }
    }
    /* get compare price using cartLib object */
    if (typeof cartLib !== "undefined") {
      $.each(cartLib, function (key, value) {
        //console.log(value);
        if (value["id"] == itemID) {
          comparePrice = value["comparePrice"];
        }
      });
    }
    /* FORMATTED PRICING */
    var formattedcomparePrice = comparePrice / 100;
    formattedcomparePrice = formatter.format(formattedcomparePrice); //console.log(imageURL);
    // check if the compared price is greater then item price then only show the compared price
    var comparePriceHtml = "";
    if (comparePrice > parseFloat(itemPrice)) {
      comparePriceHtml = "<s>" + formattedcomparePrice + "</s>";
    }
    // total compared price for the item with quantity
    var totalListItemComparePrice = comparePrice * this.quantity;
    totalListItemComparePrice = totalListItemComparePrice / 100;
    totalListItemComparePrice = formatter.format(totalListItemComparePrice);
    // item original price
    var formattedItemPrice = itemPrice / 100;
    formattedItemPrice = formatter.format(formattedItemPrice);
    // line price
    var formattedItemLinePriceTotal = itemLinePriceTotal / 100;
    formattedItemLinePriceTotal = formatter.format(formattedItemLinePriceTotal);
    //final line item price
    var formattedFinalLineItemPrice = finalLineItemPrice / 100;
    formattedFinalLineItemPrice = formatter.format(formattedFinalLineItemPrice);
    //console.log("formattedItemLinePriceTotal: " + formattedItemLinePriceTotal);
    //Price after discount
    let showPrice = "";
    let itemPriceAfterDiscountStatus = false;
    let discountedMessage = "";
    let discountedMessageElement = "";
    if (this.discounts != null) {
      discountedMessage = this.discounts;
      if (Object.keys(discountedMessage).length > 0) {
        //console.log("DISCOUNT EXISTS");
        discountedMessageElement = "<span class='discountedMessage'>";
        $.each(discountedMessage, function (key, value) {
          discountedMessageElement += value.title;
        });
        discountedMessageElement += "</span>";
      }
    }
    var formattedItemPriceAfterDiscount;
    formattedItemPriceAfterDiscount = itemPriceAfterDiscount / 100;
    formattedItemPriceAfterDiscount = formatter.format(
      formattedItemPriceAfterDiscount
    );
    // if itemPriceAfterDiscount > 0 then set the status to true so you can interchange the values
    if (this.discounts.length > 0) {
      itemPriceAfterDiscountStatus = true;
    }
    //console.log("itemPriceAfterDiscount STATUS: " + itemPriceAfterDiscountStatus)
    // if it's true; then show the compared price as the main price this.price and main price as discounted price
    if (itemPriceAfterDiscountStatus) {
      //comparePriceHtml
      showPrice =
        '<span class="price-wrapper js__raw-line-item-price"  data-attr-compare-price="0"><s>' +
        formattedItemPrice +
        '</s><span class="price" data-key="' +
        itemID +
        '">' +
        formattedItemPriceAfterDiscount +
        "</span><span class='forMiniCart'>" +
        formattedFinalLineItemPrice +
        "</span></span>" +
        discountedMessageElement;
    } else {
      showPrice =
        '<span class="price-wrapper js__raw-line-item-price"  data-attr-compare-price="0">' +
        comparePriceHtml +
        '<span class="price" data-key="' +
        itemID +
        '">' +
        formattedItemPrice +
        "</span><span class='forMiniCart'>" +
        formattedFinalLineItemPrice +
        "</span></span>";
    }
    /* Bind the properties */
    let itemProperties = "";
    let itemPropertiesElement = "";
    let itemPropertiesMainElement = "";
    var boolItemBoxType = false;
    var hideElementClass = "";
    var readonly = "";
    var justifyCenter = "";
    var formattedItemPriceMiniCart = formattedItemPrice;
    /* Item properties */
    if (this.properties != null) {
      itemProperties = this.properties;
      //console.log(itemProperties);
      if (Object.keys(itemProperties).length > 0) {
        itemPropertiesElement = "<ul>";
        $.each(itemProperties, function (key, value) {
          /* If box ID exists, then remove quantity + -  working */
          if (key == boxID) {
            // CUSTOM: 2 below lines are used if you want to remove the quantity + -
            // hideElementClass = "hide";
            // readonly = "readonly='readonly'";
            boolItemBoxType = true;
            justifyCenter = "justify-center ";
            // CUSTOM: if you do not want to show the price and compared price in cart and mini cart then open the below variables
            // formattedItemPrice="-";
            // formattedcomparePrice="-";
            // formattedItemLinePriceTotal="-";
            // formattedItemPriceMiniCart="";
          }
          if (key.indexOf("_") > -1) {
          } else {
            if (key != boxID) {
              itemPropertiesElement +=
                "<li class='flex'><span>" +
                key +
                ": </span><span style='padding-left: 5px'>" +
                value +
                "</span>";
              itemPropertiesElement += "</li>";
            }
          }
          // Recharge - when subscription is via properties for older recharge version before November 2020
          recharge2020(key, value);
        });
        // Recharge 2020, check if it's a subscription, then bind the value in the UL
        if (recurringchecked) {
          itemPropertiesElement +=
            "<li class='flex'><span>Recurring Delivery every " +
            frequency +
            " " +
            frequency_unit +
            ". Change or cancel anytime</span>";
          itemPropertiesElement += "</li>";
        }

        itemPropertiesElement += "</ul>";
        //console.log(itemPropertiesElement);
        itemPropertiesMainElement = itemPropertiesElement;
      } else {
        itemPropertiesElement = "";
      }
    }
    let sellingPlayInformation = "";
    if (this.selling_plan_allocation != undefined) {
      sellingPlayInformation = this.selling_plan_allocation.selling_plan.name;
    }
    /* check if variantTitle is NULL, then don't show variant */
    var variantTitle = this.variant_title;
    if (variantTitle == null) {
      variantTitle = "";
    }
    /* CUSTOM - if the product title contains "bag",  then disabled the quantity element
    To be applied for all the products with BoxID and Promo Offer
    */
    // if (this.product_title.toLowerCase() == "bag") {
    if (
      (this.product_title.toLowerCase().indexOf("bag") >= 0 &&
        cartBundleBoxID != "") ||
      (this.product_title.toLowerCase().indexOf("bag") >= 0 && boolPromoOffer)
    ) {
      //if you want to hide the quantity + - then enable the class below
      // hideElementClass="hide"
      justifyCenter = "justify-center ";
      readonly = "readonly='readonly'";
      disabled = "disabled ";
    }
    /* 
   LINE ITEM FOR THE MINI CART
    */
    //elements
    // remove anchor
    let removeAnchorElement =
      '<div class="remove js__cart-item-remove ' +
      removeExtraClass +
      '" data-cart-line-count="' +
      lineCount +
      '" data-variant-id="' +
      itemID +
      '"  data-cart-remove-variant="' +
      this.id +
      '" data-cart-line-count=' +
      lineCount +
      ">" +
      removeMiniCartTextOrIcon +
      "</div>";
    //quantity element
    var quantityElement =
      '<div class="cart-quantity-outer ' +
      disabled +
      justifyCenter +
      '"> <a  tabindex="0"  class="minus-qty ' +
      hideElementClass +
      '  font-zero" onclick="minusQuantity(' +
      lineCount +
      ')"   data-variant-id="' +
      itemID +
      '">' +
      minusIcon +
      '</a> <input aria-label="Quantity"  tabindex="-1"  data-limit="' +
      boolItemBoxType +
      '"  ' +
      readonly +
      '   onkeydown="return isNumeric(event);" type="text"  data-attr-raw-variant-quantity="94" data-cart-line-count="' +
      lineCount +
      '" class="cart__quantity-selector js__cart__quantity-selector" name="updates[]" id="updates_' +
      itemID +
      '" value="' +
      this.quantity +
      '" maxlength="3" size="3"> <a  tabindex="0"  class="plus-qty ' +
      hideElementClass +
      '  font-zero" onclick="plusQuantity(' +
      lineCount +
      ')"     data-variant-id="' +
      itemID +
      '">' +
      plusIcon +
      "</a> </div>";
    //vendor element
    let vendorElement =
      '<span class="subheading uppercase">' + this.vendor + "</span>";
    var lineItem;
    lineItem =
      '<li class="flex-wrap js__cart-table-item-row" data-cart-line-count=' +
      lineCount +
      ' data-handle="' +
      handle +
      '" data-variant-id=' +
      itemID +
      '><div class="image-section"> <a href="' +
      this.url +
      '"><img alt="' +
      imageAlt +
      '" src="' +
      imageURL +
      '""> </a> </div>';
    lineItem +=
      '<div class="content"><h5><a href="' +
      this.url +
      '">' +
      this.product_title +
      "</a></h5>" +
      removeAnchorElement +
      "";
    if (sellingPlayInformation != "") {
      lineItem += '<p class="capitalize">' + sellingPlayInformation + "</p>";
    }
    if (itemPropertiesElement != "") {
      lineItem += '<p class="capitalize">' + itemPropertiesElement + "</p>";
    }
    if (variantTitle != "") {
      lineItem += '<p class="capitalize">' + variantTitle + "</p>";
    }
    lineItem +=
      showPrice +
      '<div class="flex-space-between"><p class="hide">Qty ' +
      this.quantity +
      "</p>" +
      quantityElement;
    //lineItem += removeAnchorElement + "</div></div>";
    // !! NEED TO CHECK WITH DEV - why we using this variable here
    lineItem +=
      "<span class='price'>" +
      formattedItemPriceAfterDiscount +
      "</span></div></div>";
    lineItem += "</li>";
    /* Bind the line item to the list */
    $(".js__ajax-products-bind").append(lineItem);
    //LINE ITEM FOR THE CART PAGE
    if ($(".cart-list")[0]) {
      //classLineItem = ".js__set-line-item-price";
      var cartLineItem = "";
      cartLineItem =
        '<div class="cart-list__items cart-table-body js__cart-table-item-row flex" data-cart-line-count="' +
        lineCount +
        '" data-attr-compare-price="" data-variant-id="' +
        itemID +
        '"><div class="cart-list__items__columns"><div class="image-section "><img class="img-responsive img-thumbnail item-image" src="' +
        imageURL +
        '" alt="' +
        imageAlt +
        '"></div> <div class="content">';
      // show vendor on cart page
      if (showVendorOnCartPage) {
        cartLineItem += vendorElement;
      }
      cartLineItem +=
        '<a class="item-name" href="' +
        this.url +
        '"> <span class="item-title">' +
        this.product_title +
        " </span></a>";
      cartLineItem += '<div class="cart-list__variant-properties">';
      if (sellingPlayInformation != "") {
        cartLineItem +=
          '<span class="capitalize">' + sellingPlayInformation + "</span>";
      }
      if (itemPropertiesElement != "") {
        cartLineItem +=
          '<span class="capitalize">' + itemPropertiesElement + "</span>";
      }
      if (variantTitle != "") {
        cartLineItem += '<span class="capitalize">' + variantTitle + "</span>";
      }
      cartLineItem += "</div>";
      cartLineItem +=
        '<a class="remove btn-border-small-black" data-cart-line-count="' +
        lineCount +
        '" data-variant-id="' +
        itemID +
        '" href="javascript:;">remove</a>  </div>  </div>  <div class="cart-list__items__columns">';
      cartLineItem += showPrice;
      cartLineItem += "</div>";
      cartLineItem +=
        '<div class="cart-list__items__columns quantity" data-variant-id="' +
        itemID +
        '"> ' +
        quantityElement +
        '  <span class="js__out-of-stock"></span>';
      // ** Remove action is added here too
      cartLineItem += "</div>";
      cartLineItem +=
        '<div class="cart-list__items__columns total-price price-wrapper" data-head="Total"> <span class="js__set-line-item-price" data-attr-price="' +
        itemPrice +
        '" data-attr-compare-price=' +
        totalListItemComparePrice +
        '><s class="hide">' +
        totalListItemComparePrice +
        '</s><span class="price" data-key="' +
        itemID +
        '">' +
        formattedItemLinePriceTotal +
        "</span> </span>";
      // ** Remove element is added here too
      //cartLineItem +="<a class=' remove btn-border-small-black ipad-block ' data-cart-line-count='" +lineCount +"' data-variant-id='" +itemID +"' href='javascript:;'>remove</a> ";
      cartCountEmptyValue += " </div></div>";
      $(".cart-list").append(cartLineItem);
    }
    lineCount++;
  });
}
//CALCULATE TOTAL OF THE CART
function quickCartTotal(data) {
  if (data == undefined) {
    cartObject = CartJS.cart;
  } else {
    cartObject = data;
  }
  let total = cartObject.items_subtotal_price;
  total = total / 100;
  total = formatter.format(total);
  $(".js__cart-total").html(total);
  $(".js__ajax-cart-total").html("" + total);
  $(".js__ajax-cart-total").show();
  $(".js__ajax-cart-count").html(cartObject.item_count);
  $(".js__top-cart-form-actions").show();
  $(".js__cart-expand ").removeClass("empty-cart");
}
function calculateSubTotalWithDiscount() {
  let subTotal = 0;
  let discount = 0;
  let total = 0;
  let lineItemComparePrice = 0;
  let itemPrice = 0;
  let quantity = 0;
  /* loop through eachcart item and get the compared price and actual price */
  if (typeof cartLib !== "undefined") {
    $.each(cartLib, function (key, value) {
      quantity = parseInt(value.quantity);
      //console.log("quantity: " + quantity);
      if (value.comparePrice != "") {
        lineItemComparePrice =
          parseInt(value.comparePrice) * quantity + lineItemComparePrice;
        console.log("lineItemComparePrice: " + lineItemComparePrice);
      } else {
        lineItemComparePrice = parseInt(value.price) * quantity;
      }

      itemPrice = parseInt(value.price) * quantity;
      //console.log("itemPrice: " + itemPrice);
      subTotal += lineItemComparePrice;
      //console.log("subTotal: " + subTotal);
      discount += lineItemComparePrice - itemPrice;
      //console.log("discount: " + discount);
    });
    total = CartJS.cart.total_price;
    //format
    subTotal = subTotal / 100;
    subTotal = formatter.format(subTotal);
    discount = discount / 100;
    discount = formatter.format(discount);
    total = total / 100;
    total = formatter.format(total);
  }
  if (CartJS.cart.item_count > 0) {
    $(".js__cart-sub-total").html(subTotal);
    $(".js__cart-total-saved").html("-" + discount);
    $(".js__cart-total").html(total);
    if (showCartCountInTopNav) {
      $(".js__ajax-cart-count").show();
      $(".js__ajax-cart-count").html(CartJS.cart.item_count);
    }
    $(".free-shipping").show();
    //show/hide js__cartSubtotalDiscountWraper - if you want to show subtotal and discount
    showCartSubTotalDiscountSection
      ? $(".js__cartSubtotalDiscountWraper").removeClass("hide")
      : console.log("SubTotal Discount Wrapper: NOT visible");
  } else {
    /* 
    update cart item count = 0
    hide the totals
    hide checkout buttons
    update the icon cart with a different icon
    */
    $(".js__ajax-products-bind").html(
      '<li><div class="width-100"> <p class="uppercase text-center">Your cart is empty</p> </div></li>'
    );
    $(".freq-product-list").hide();
    $(".free-shipping").hide();
    $(".js__ajax-cart-count").html(cartCountEmptyValue);
    $(".js__ajax-cart-total").hide();
    $(".js__top-cart-form-actions").hide();
    $(".js__show-cart-items-section").hide();
    $(".empty-cart-section").show();
    $(".js__cart-expand ").addClass("empty-cart");
    //change the icon for the top cart, if required
    showEmptyCartIcon
      ? $(".js__update-cart-icon").addClass("empty-cart")
      : console.log("Top Cart Icon: NOTchanged");
  }
}
/*
  CUSTOM-- for the BUILDER
  THIS FUNCTION IS USED WHEN THERE IS NO QUANTITY BOX VISIBLE AGAINST THE ITEM
  //Variest from theme to theme
   1. Loop through cart items
   2. If item has property > 0 
   3. Then check for boxID 
   4. Save the BoxID in a variable
   5. Then go through the second cart item
   6. if currentItemPropertyBoxID = savedItemPropertyBoxID
   7. Then remove the item
   8. Else do not do anything
*/
var savedItemPropertyBoxID = "";
var currentItemPropertyBoxID = "";
var clickedRemoveItemStatus = false;
var currentItemID = "";
$(document).on("click", ".remove", function () {
  //console.log("REMOVE CLICKED");
  var howManyItemsToDelete = 0;
  var howManyVariantIDToDelete = [];
  let variantID = parseInt($(this).attr("data-variant-id"));
  let itemLineCount = parseInt($(this).attr("data-cart-line-count"));
  //console.log("itemLineCount: " + itemLineCount);
  let extraItemLineCount = 1;
  /* offer main product ID and bool*/
  let productID = "";
  //Run properties loop and set clickRemove status = true if BoxID is found
  $(CartJS.cart.items).each(function () {
    if (itemLineCount == extraItemLineCount) {
      //console.log("clicked - variantID : " + variantID);
      productID = this.product_id;
      $.each(this.properties, function (key, value) {
        //console.log("key: " + key);
        if (key == boxID) {
          //console.log("key2: " + key);
          savedItemPropertyBoxID = value;
          clickedRemoveItemStatus = true;
        }
        /* CUSTOM: Checking deleted item is main product of promo offer*/
        if (key == "_promoOffer") {
          if (productID == promoOffer_BlackFriday_ProductID) {
            boolPromoOffer_BlackFriday_ProductID = true;
          }
        }
      });
    }
    extraItemLineCount = extraItemLineCount + 1;
    //console.log("clickedRemoveItemStatus: " + clickedRemoveItemStatus);
    if (clickedRemoveItemStatus) {
      //console.log("clickedRemoveItemStatus: " + true);
      clickedRemoveItemStatus = false;
      return false;
    }
  });
  extraItemLineCount = 1;
  /* CUSTOM: Loop through items and properties */
  $(CartJS.cart.items).each(function () {
    currentItemID = this.id;
    //console.log("LoopCurrentItemID: " + currentItemID);
    $.each(this.properties, function (key, value) {
      //console.log("key4: " + key);
      //console.log("boxID4: " + boxID);
      if (key == boxID) {
        //console.log("Property Match");
        currentItemPropertyBoxID = value;
        //console.log("currentItemPropertyBoxID: " + currentItemPropertyBoxID);
        //console.log("savedItemPropertyBoxID: " + savedItemPropertyBoxID);
        if (currentItemPropertyBoxID == savedItemPropertyBoxID) {
          //console.log("remove the current item");
          extraItemLineCount = 1;
          howManyItemsToDelete = howManyItemsToDelete + 1;
          howManyVariantIDToDelete.push(currentItemID);
          //Remove the product that clicked
        } else {
          extraItemLineCount = extraItemLineCount + 1;
        }
      } else {
        //console.log("BOX ID ISN'T THERE IN PRODUCT");
        //removeItem(itemLineCount);
      }
    });
    //console.log("howManyVariantIDToDelete: " + howManyVariantIDToDelete);
  });
  //console.log("TOTAL: howManyVariantIDToDelete: " + howManyVariantIDToDelete);
  //console.log("TOTAL howManyItemsToDelete: " + howManyItemsToDelete);
  if (howManyItemsToDelete == 0) {
    //console.log("ITEM TO DELETE: " + 0);
    removeItem(itemLineCount);
  } else {
    //console.log("TOTAL # of item to delete > 0");
    /* 
    Remove the items depending upon how many are to be deleted
    Run the loop again and delete them one by one 
    */
    //console.log(howManyVariantIDToDelete.length);
    let currentItemLoop = 1;
    // NOTE: used "removeItemById" as for this particular project ..
    for (var n = 0; n < howManyVariantIDToDelete.length; ++n) {
      removeItemById(howManyVariantIDToDelete[n]);
      //debugger;
      // $(CartJS.cart.items).each(function () {
      //   //console.log("howManyVariantIDToDelete");
      //   //console.log(howManyVariantIDToDelete[n]);
      //   //console.log(this.title);
      //   //console.log(this.properties);
      //   //debugger;
      //   if (jQuery.isEmptyObject(this.properties)) {
      //     //console.log("Property is empty");
      //     currentItemLoop = currentItemLoop + 1;
      //   } else {
      //     $.each(this.properties, function (key, value) {
      //       if (key == boxID ) {
      //         //console.log("FINAL - BOX ID FOUND 1 by 1");
      //         currentItemPropertyBoxID = value;
      //         if (currentItemPropertyBoxID == savedItemPropertyBoxID) {
      //           //console.log("remove the final loop item");
      //           removeItemById(howManyVariantIDToDelete[n]);
      //           currentItemLoop = 1;
      //           //Remove the product that clicked
      //         } else {
      //           currentItemLoop = currentItemLoop + 1;
      //         }
      //       }
      //       else
      //       {
      //         //console.log("FINAL - BOX ID NOT FOUND 1 by 1");
      //       }
      //     });
      //     if (currentItemLoop == 1) {
      //       return false;
      //     }
      //   }
      // });
    }
  }

  showHideEmptyCart();
});

function showHideEmptyCart() {
  if (CartJS.cart.item_count == 0) {
    $(".empty-cart-section").show();
    $(".js__show-cart-items-section").hide();
    $("#shopify-section-cart-recommendations").hide();
  } else {
    $(".empty-cart-section").hide();
  }
}
/*
PROGRESS BAR
*/
function progressBar() {
  if (showProgressBar) {
    var totalAmount = CartJS.cart.total_price / 100;
    var freeShippingAmount = parseFloat($(".js__free-shipping-limit").html());
    var freeShippingRemaningAmount = freeShippingAmount - totalAmount;
    var freeShippingPercentage = 100;
    if (freeShippingRemaningAmount > 0) {
      freeShippingPercentage = (totalAmount * 100) / freeShippingAmount;
      $(".js__free-shipping-limit-message").show();
      $(".js__free-shipping-message").hide();
    } else {
      $(".js__free-shipping-limit-message").hide();
      $(".js__free-shipping-message").show();
    }
    $(".js__free-shipping-remaning-amount").html(
      formatter.format(freeShippingRemaningAmount)
    );
    $(".js__free-shipping__progress-bar").attr(
      "data-percentage",
      freeShippingPercentage
    );
    $(".js__free-shipping__progress-bar")
      .children("span")
      .css("width", freeShippingPercentage + "%");
  }
}
/*
ADDONS
NOTE:: CONFUSING CODE FOR THE ADDONS - WILL NEED TO CLEAN IT A BIT
1. Try to get all the addon handles for the items which are in the cart
2. Create an array for item>addon
3. Loop through all the cart items and addon
4. CHECK - if addon is already there in the list, then the same 2nd addon should not be visible
*/
$(document).ready(function ($) {
  $(".js__addon-add-to-cart").click(function () {
    let quantity = 1;
    let addonSelectedVariantID = $(this).attr("data-attr-variantid");
    cartAddItemAddon(addonSelectedVariantID, quantity);
  });
  $(".js__addon-add-to-cart").keypress(function () {
    var keycode = event.keyCode || event.which;
    if (keycode == "13") {
      event.preventDefault();
      let quantity = 1;
      let addonSelectedVariantID = $(this).attr("data-attr-variantid");
      cartAddItemAddon(addonSelectedVariantID, quantity);
    }
  });
});
function cartAddItemAddon(addonSelectedVariantID, addonQuantity) {
  CartJS.addItem(
    addonSelectedVariantID,
    addonQuantity,
    {},
    {
      success: function (data, textStatus, jqXHR) {
        //console.log("success");
        /* Pending - Remove the selected addon when add to cart is clicked */
      },
      error: function (jqXHR, textStatus, errorThrown) {
        //console.log("error");
      },
    }
  );
}
function addons() {
  //console.log("addons");
  /*Hide repeating addons*/
  var cartAddons = "";
  $(".js__top-cart-addons li").each(function (index) {
    // update this with variantID
    var addoneHandle = $(this).attr("data-handler");
    // if cartAddon is null,
    if (cartAddons == "") {
      // save the addonHandle
      cartAddons = addoneHandle;
    } else {
      //set bool value to see if the addons is present in the addon list or not
      // by default it's false
      var boolCartAddons = false;
      // going through the string and checking if the current addon handle = the addon
      //handle present in the string
      var cartAddons2 = cartAddons.split(",");
      for (var a = 0; a < cartAddons2.length; a++) {
        if ($(this).attr("data-handler") == cartAddons2[a]) {
          // if present, then hide it
          $(this).hide();
          boolCartAddons = true;
        }
      }
      // add the new addon handle to the string
      if (boolCartAddons == false) {
        cartAddons = cartAddons + "," + addoneHandle;
      }
    }
    //console.log(cartAddons);
    /* Hide the addons from the addon list, if the addon is present in the cart */
    var boolItemCartAddon = false;
    $(".js__ajax-products-bind li").each(function (index) {
      var itemHandle = $(this).attr("data-handle");
      //console.log("itemHandle"+itemHandle);
      //console.log("addoneHandle"+addoneHandle)
      if (addoneHandle == itemHandle) {
        boolItemCartAddon = true;
      }
    });
    if (boolItemCartAddon == true) {
      $(this).hide();
    } else {
      $(this).show();
    }
  });
  /* Hide the complete section if there are no addons */
  var boolAddonExist = false;
  $(".js__top-cart-addons li").each(function (index) {
    if ($(this).css("display") != "none") {
      boolAddonExist = true;
    }
  });
  //console.log("boolAddonExist"+boolAddonExist);
  if (boolAddonExist == false) {
    //console.log("if");
    $(".js__freq-bought-products").hide();
  } else {
    //console.log("else");
    $(".js__freq-bought-products").show();
  }
}
//Addons are fetched from the schemas; Varies from theme to theme
setTimeout(function () {
  addons();
}, 1000);

//loop through cart items to get property on the basis of variant ID
function loopThroughCartItems_on_VariantID(variantID) {
  let currentVariantID = "";
  let properties = "";
  $(CartJS.cart.items).each(function () {
    // currentVariantID = this.id;
    if (variantID == this.id) {
      properties = this.properties;
      return false;
    }
  });
  return properties;
}

function loopThroughCartItems_on_ProductID(productID) {
  let variantID = "";
  $(CartJS.cart.items).each(function () {
    // currentVariantID = this.id;
    if (productID == this.product_id) {
      variantID = this.id;
      return false;
    }
  });
  return variantID;
}

function recharge2020(key, value) {
  if (key == "shipping_interval_frequency") {
    frequency = value;
    recurringchecked = "true";
  }

  if (key == "shipping_interval_unit_type") {
    if (frequency == "1") {
      if (value == "Days") {
        frequency_unit = "Day";
      } else if (value == "Months") {
        frequency_unit = "Month";
      } else if (value == "Weeks") {
        frequency_unit = "Week";
      }
    } else {
      frequency_unit = value;
    }
  }
}
