"use strict";

// tweaks these below variable if you want to show subtotal and discount
var showCartSubTotalDiscountSection = true;
var showEmptyCartIcon = false;
var showCartCountInTopNav = true;
var showProgressBar = true;
var showVendorOnCartPage = false;
var enablePlusQuantity = false;
var disablePlusQuantityAfterNumber = 6;
var removeMiniCartTextOrIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><g stroke='#272F33' stroke-width='2' fill='none' fill-rule='evenodd'><path d='M2.929 17.071 17.07 2.93M2.929 2.929 17.07 17.07'/></g></svg>";
var plusIcon = '<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><g stroke="#2A1717" fill="none" fill-rule="evenodd"><path d="M0 5h10M5 0v10"/></g></svg>';
var minusIcon = '<svg width="10" height="1" viewBox="0 0 10 1" xmlns="http://www.w3.org/2000/svg"><path d="M0 .5h10" stroke="#2A1717" fill="none" fill-rule="evenodd"/></svg>'; // Fixed variables

var lineItemComparePrice;
var cartObject;
var cartCountEmptyValue = "0";
var boxID = "_Box ID"; //extra classes for the elements

var removeExtraClass = "btn-border-black-animate";
/* CUSTOM OFFERS */
//black friday main productID

var promoOfferQuantity = 0;
var boolPromoOffer_BlackFriday_ProductID = false; //Replace on LIVE

var promoOffer_BlackFriday_ProductID = "6737920098374";
var promoOffer_BlackFriday_FreeBag_ProductID = "6737924587590"; // recharge 2020

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
  var lineItemCount = cartThis;
  lineItemCount = parseInt(lineItemCount);
  var itemPrice = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__raw-line-item-price").text();
  itemPrice = itemPrice.replace(/[^0-9]/gi, "");
  itemPrice = parseInt(itemPrice);
  var lineItemComparePrice = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__raw-item-compare-price").text().replace(/[^0-9]/gi, "");
  lineItemComparePrice = parseInt(lineItemComparePrice);
  var variantID = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').attr("data-variant-id");
  variantID = parseInt(variantID);
  var newQuantity = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find("input[name='updates[]']").val();
  newQuantity = parseInt(newQuantity);
  /* NOTE: you will not get Raw Inventory against the variant in API calls */

  /* PENDING, need to find a solution for this */

  /* Need to check stock levels for the variant 
  as cartJS is giving success even if the stock levels are low and not going into Error*/

  var rawStockVariantQuantity = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find("input[name='updates[]']").attr("data-attr-raw-variant-quantity");
  /* If the new quantity is less then the stock then update the item */

  rawStockVariantQuantity = isNaN(rawStockVariantQuantity) ? "10000" : rawStockVariantQuantity;
  rawStockVariantQuantity = parseInt(rawStockVariantQuantity);

  if (newQuantity < rawStockVariantQuantity) {
    $("input[name='updates[]']").filter('[data-cart-line-count="' + lineItemCount + '"]').val(newQuantity);
    /* Update the item */

    CartJS.updateItem(lineItemCount, newQuantity, {}, {
      success: function success(data, textStatus, jqXHR) {//console.log(data);
        // //Rebind the line item price
        // reloadAjaxCartItemUsingCartAjaxObject(data);
      },
      error: function error(jqXHR, textStatus, errorThrown) {//console.log("Error: " + errorThrown + "!");
      },
      complete: function complete(jqXHR, textStatus, errorThrown) {//console.log(jqXHR);
        //console.log(textStatus);
        //console.log(errorThrown);
      }
    });
  } else {
    /* Show a message out of stock */
    $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__out-of-stock").html("Out of stock");
    $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__out-of-stock").show();
    $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__out-of-stock").delay(2000).fadeOut();
  }
}

function minusQuantity(cartThis) {
  // debugger;
  var lineItemCount = cartThis;
  lineItemCount = parseInt(lineItemCount);
  var itemPrice = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__raw-line-item-price").text();
  itemPrice = itemPrice.replace(/[^0-9]/gi, "");
  itemPrice = parseInt(itemPrice);
  var lineItemComparePrice = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__raw-item-compare-price").text().replace(/[^0-9]/gi, "");
  lineItemComparePrice = parseInt(lineItemComparePrice);
  var variantID = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').attr("data-variant-id");
  variantID = parseInt(variantID);
  var newQuantity = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find("input[name='updates[]']").val();
  newQuantity = parseInt(newQuantity);
  newQuantity = newQuantity - 1;
  $("input[name='updates[]']").filter('[data-cart-line-count="' + lineItemCount + '"]').val(newQuantity); // CUSTOM - Loop through properties to check if there is a product with PromoOffer, if yes, then set the bool to true

  var properties = loopThroughCartItems_on_VariantID(variantID);

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
    CartJS.updateItem(lineItemCount, newQuantity, {}, {
      success: function success(data, textStatus, jqXHR) {},
      error: function error(jqXHR, textStatus, errorThrown) {//console.log("Error: " + errorThrown + "!");
      }
    });
    /*
    if you want to update item by ID and not by line item then you can use updateItemId function
    Recommended - line item update
    CartJS.updateItemById(lineIndex, newQuantity);
    */
  } // CUSTOM -
  //if the promo main product exists and it's quantity is less then 2, then remove the promo free bag product
  // if promo main product quantity  = 1; then remove the free bag and update the promo main product quantity
  // if promo main product quantity  = 0; then remove the promo main product
  // update the quantity for the promo main product


  if (boolPromoOffer_BlackFriday_ProductID && newQuantity <= 1) {
    if (newQuantity == 1) {
      //console.log("BLACK FRIDAY: Quantity 1");
      //loop through the cart items to get the variant ID for the PROMO - Free bag product
      //console.log("BLACK FRIDAY: going to delete free bag ");
      var _variantID = loopThroughCartItems_on_ProductID(promoOffer_BlackFriday_FreeBag_ProductID);

      removeItemById(_variantID);
    }
  }
}

function plusQuantity(cartThis) {
  var lineItemCount = cartThis;
  lineItemCount = parseInt(lineItemCount);
  var itemPrice = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__raw-line-item-price").text();
  itemPrice = itemPrice.replace(/[^0-9]/gi, "");
  itemPrice = parseInt(itemPrice);
  var lineItemComparePrice = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__raw-item-compare-price").text().replace(/[^0-9]/gi, "");
  lineItemComparePrice = parseInt(lineItemComparePrice);
  var variantID = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').attr("data-variant-id");
  variantID = parseInt(variantID);
  var newQuantity = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find("input[name='updates[]']").val();
  newQuantity = parseInt(newQuantity); // Disable the PLUS quantity feature

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

    var rawStockVariantQuantity = $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find("input[name='updates[]']").attr("data-attr-raw-variant-quantity");
    /* If the new quantity is less then the stock then update the item */

    rawStockVariantQuantity = isNaN(rawStockVariantQuantity) ? "10000" : rawStockVariantQuantity;
    rawStockVariantQuantity = parseInt(rawStockVariantQuantity);

    if (newQuantity < rawStockVariantQuantity) {
      $("input[name='updates[]']").filter('[data-cart-line-count="' + lineItemCount + '"]').val(newQuantity);
      /* Update the item */

      CartJS.updateItem(lineItemCount, newQuantity, {}, {
        success: function success(data, textStatus, jqXHR) {//console.log(data);
          // //Rebind the line item price
          // reloadAjaxCartItemUsingCartAjaxObject(data);
        },
        error: function error(jqXHR, textStatus, errorThrown) {//console.log("Error: " + errorThrown + "!");
        },
        complete: function complete(jqXHR, textStatus, errorThrown) {//console.log(jqXHR);
          //console.log(textStatus);
          //console.log(errorThrown);
        }
      });
    } else {
      /* Show a message out of stock */
      $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__out-of-stock").html("Out of stock");
      $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__out-of-stock").show();
      $(".js__cart-table-item-row ").filter('[data-cart-line-count="' + lineItemCount + '"]').find(".js__out-of-stock").delay(2000).fadeOut();
    }
  }
} //REMOVE ITEM via lineItemCount


function removeItem(lineItemCount) {
  CartJS.removeItem(lineItemCount, {
    success: function success(data, textStatus, jqXHR) {},
    error: function error(jqXHR, textStatus, errorThrown) {//console.log('Error: ' + errorThrown + '!');
    }
  });
} // REMOVE ITEM via variantID
//REMOVE ITEM


function removeItemById(variantID) {
  CartJS.removeItemById(variantID, {
    success: function success(data, textStatus, jqXHR) {},
    error: function error(jqXHR, textStatus, errorThrown) {//console.log('Error: ' + errorThrown + '!');
    }
  });
} //RELOAD AJAX CART


function reloadAjaxCartItemUsingCartAjaxObject(data) {
  var lineCount = 1;
  var cartObject; //console.log(data);

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
    var disabled = "";
    var finalLineItemPrice = this.final_line_price;
    var cartBundleBoxID = "";
    var boolPromoOffer = false;
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
    } // total compared price for the item with quantity


    var totalListItemComparePrice = comparePrice * this.quantity;
    totalListItemComparePrice = totalListItemComparePrice / 100;
    totalListItemComparePrice = formatter.format(totalListItemComparePrice); // item original price

    var formattedItemPrice = itemPrice / 100;
    formattedItemPrice = formatter.format(formattedItemPrice); // line price

    var formattedItemLinePriceTotal = itemLinePriceTotal / 100;
    formattedItemLinePriceTotal = formatter.format(formattedItemLinePriceTotal); //final line item price

    var formattedFinalLineItemPrice = finalLineItemPrice / 100;
    formattedFinalLineItemPrice = formatter.format(formattedFinalLineItemPrice); //console.log("formattedItemLinePriceTotal: " + formattedItemLinePriceTotal);
    //Price after discount

    var showPrice = "";
    var itemPriceAfterDiscountStatus = false;
    var discountedMessage = "";
    var discountedMessageElement = "";

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
    formattedItemPriceAfterDiscount = formatter.format(formattedItemPriceAfterDiscount); // if itemPriceAfterDiscount > 0 then set the status to true so you can interchange the values

    if (this.discounts.length > 0) {
      itemPriceAfterDiscountStatus = true;
    } //console.log("itemPriceAfterDiscount STATUS: " + itemPriceAfterDiscountStatus)
    // if it's true; then show the compared price as the main price this.price and main price as discounted price


    if (itemPriceAfterDiscountStatus) {
      //comparePriceHtml
      showPrice = '<span class="price-wrapper js__raw-line-item-price"  data-attr-compare-price="0"><s>' + formattedItemPrice + '</s><span class="price" data-key="' + itemID + '">' + formattedItemPriceAfterDiscount + "</span><span class='forMiniCart'>" + formattedFinalLineItemPrice + "</span></span>" + discountedMessageElement;
    } else {
      showPrice = '<span class="price-wrapper js__raw-line-item-price"  data-attr-compare-price="0">' + comparePriceHtml + '<span class="price" data-key="' + itemID + '">' + formattedItemPrice + "</span><span class='forMiniCart'>" + formattedFinalLineItemPrice + "</span></span>";
    }
    /* Bind the properties */


    var itemProperties = "";
    var itemPropertiesElement = "";
    var itemPropertiesMainElement = "";
    var boolItemBoxType = false;
    var hideElementClass = "";
    var readonly = "";
    var justifyCenter = "";
    var formattedItemPriceMiniCart = formattedItemPrice;
    /* Item properties */

    if (this.properties != null) {
      itemProperties = this.properties; //console.log(itemProperties);

      if (Object.keys(itemProperties).length > 0) {
        itemPropertiesElement = "<ul>";
        $.each(itemProperties, function (key, value) {
          /* If box ID exists, then remove quantity + -  working */
          if (key == boxID) {
            // CUSTOM: 2 below lines are used if you want to remove the quantity + -
            // hideElementClass = "hide";
            // readonly = "readonly='readonly'";
            boolItemBoxType = true;
            justifyCenter = "justify-center "; // CUSTOM: if you do not want to show the price and compared price in cart and mini cart then open the below variables
            // formattedItemPrice="-";
            // formattedcomparePrice="-";
            // formattedItemLinePriceTotal="-";
            // formattedItemPriceMiniCart="";
          }

          if (key.indexOf("_") > -1) {} else {
            if (key != boxID) {
              itemPropertiesElement += "<li class='flex'><span>" + key + ": </span><span style='padding-left: 5px'>" + value + "</span>";
              itemPropertiesElement += "</li>";
            }
          } // Recharge - when subscription is via properties for older recharge version before November 2020


          recharge2020(key, value);
        }); // Recharge 2020, check if it's a subscription, then bind the value in the UL

        if (recurringchecked) {
          itemPropertiesElement += "<li class='flex'><span>Recurring Delivery every " + frequency + " " + frequency_unit + ". Change or cancel anytime</span>";
          itemPropertiesElement += "</li>";
        }

        itemPropertiesElement += "</ul>"; //console.log(itemPropertiesElement);

        itemPropertiesMainElement = itemPropertiesElement;
      } else {
        itemPropertiesElement = "";
      }
    }

    var sellingPlayInformation = "";

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


    if (this.product_title.toLowerCase().indexOf("bag") >= 0 && cartBundleBoxID != "" || this.product_title.toLowerCase().indexOf("bag") >= 0 && boolPromoOffer) {
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


    var removeAnchorElement = '<div class="remove js__cart-item-remove ' + removeExtraClass + '" data-cart-line-count="' + lineCount + '" data-variant-id="' + itemID + '"  data-cart-remove-variant="' + this.id + '" data-cart-line-count=' + lineCount + ">" + removeMiniCartTextOrIcon + "</div>"; //quantity element

    var quantityElement = '<div class="cart-quantity-outer ' + disabled + justifyCenter + '"> <a  tabindex="0"  class="minus-qty ' + hideElementClass + '  font-zero" onclick="minusQuantity(' + lineCount + ')"   data-variant-id="' + itemID + '">' + minusIcon + '</a> <input aria-label="Quantity"  tabindex="-1"  data-limit="' + boolItemBoxType + '"  ' + readonly + '   onkeydown="return isNumeric(event);" type="text"  data-attr-raw-variant-quantity="94" data-cart-line-count="' + lineCount + '" class="cart__quantity-selector js__cart__quantity-selector" name="updates[]" id="updates_' + itemID + '" value="' + this.quantity + '" maxlength="3" size="3"> <a  tabindex="0"  class="plus-qty ' + hideElementClass + '  font-zero" onclick="plusQuantity(' + lineCount + ')"     data-variant-id="' + itemID + '">' + plusIcon + "</a> </div>"; //vendor element

    var vendorElement = '<span class="subheading uppercase">' + this.vendor + "</span>";
    var lineItem;
    lineItem = '<li class="flex-wrap js__cart-table-item-row" data-cart-line-count=' + lineCount + ' data-handle="' + handle + '" data-variant-id=' + itemID + '><div class="image-section"> <a href="' + this.url + '"><img alt="' + imageAlt + '" src="' + imageURL + '""> </a> </div>';
    lineItem += '<div class="content"><h5><a href="' + this.url + '">' + this.product_title + "</a></h5>" + removeAnchorElement + "";

    if (sellingPlayInformation != "") {
      lineItem += '<p class="capitalize">' + sellingPlayInformation + "</p>";
    }

    if (itemPropertiesElement != "") {
      lineItem += '<p class="capitalize">' + itemPropertiesElement + "</p>";
    }

    if (variantTitle != "") {
      lineItem += '<p class="capitalize">' + variantTitle + "</p>";
    }

    lineItem += showPrice + '<div class="flex-space-between"><p class="hide">Qty ' + this.quantity + "</p>" + quantityElement; //lineItem += removeAnchorElement + "</div></div>";
    // !! NEED TO CHECK WITH DEV - why we using this variable here

    lineItem += "<span class='price'>" + formattedItemPriceAfterDiscount + "</span></div></div>";
    lineItem += "</li>";
    /* Bind the line item to the list */

    $(".js__ajax-products-bind").append(lineItem); //LINE ITEM FOR THE CART PAGE

    if ($(".cart-list")[0]) {
      //classLineItem = ".js__set-line-item-price";
      var cartLineItem = "";
      cartLineItem = '<div class="cart-list__items cart-table-body js__cart-table-item-row flex" data-cart-line-count="' + lineCount + '" data-attr-compare-price="" data-variant-id="' + itemID + '"><div class="cart-list__items__columns"><div class="image-section "><img class="img-responsive img-thumbnail item-image" src="' + imageURL + '" alt="' + imageAlt + '"></div> <div class="content">'; // show vendor on cart page

      if (showVendorOnCartPage) {
        cartLineItem += vendorElement;
      }

      cartLineItem += '<a class="item-name" href="' + this.url + '"> <span class="item-title">' + this.product_title + " </span></a>";
      cartLineItem += '<div class="cart-list__variant-properties">';

      if (sellingPlayInformation != "") {
        cartLineItem += '<span class="capitalize">' + sellingPlayInformation + "</span>";
      }

      if (itemPropertiesElement != "") {
        cartLineItem += '<span class="capitalize">' + itemPropertiesElement + "</span>";
      }

      if (variantTitle != "") {
        cartLineItem += '<span class="capitalize">' + variantTitle + "</span>";
      }

      cartLineItem += "</div>";
      cartLineItem += '<a class="remove btn-border-small-black" data-cart-line-count="' + lineCount + '" data-variant-id="' + itemID + '" href="javascript:;">remove</a>  </div>  </div>  <div class="cart-list__items__columns">';
      cartLineItem += showPrice;
      cartLineItem += "</div>";
      cartLineItem += '<div class="cart-list__items__columns quantity" data-variant-id="' + itemID + '"> ' + quantityElement + '  <span class="js__out-of-stock"></span>'; // ** Remove action is added here too

      cartLineItem += "</div>";
      cartLineItem += '<div class="cart-list__items__columns total-price price-wrapper" data-head="Total"> <span class="js__set-line-item-price" data-attr-price="' + itemPrice + '" data-attr-compare-price=' + totalListItemComparePrice + '><s class="hide">' + totalListItemComparePrice + '</s><span class="price" data-key="' + itemID + '">' + formattedItemLinePriceTotal + "</span> </span>"; // ** Remove element is added here too
      //cartLineItem +="<a class=' remove btn-border-small-black ipad-block ' data-cart-line-count='" +lineCount +"' data-variant-id='" +itemID +"' href='javascript:;'>remove</a> ";

      cartCountEmptyValue += " </div></div>";
      $(".cart-list").append(cartLineItem);
    }

    lineCount++;
  });
} //CALCULATE TOTAL OF THE CART


function quickCartTotal(data) {
  if (data == undefined) {
    cartObject = CartJS.cart;
  } else {
    cartObject = data;
  }

  var total = cartObject.items_subtotal_price;
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
  var subTotal = 0;
  var discount = 0;
  var total = 0;
  var lineItemComparePrice = 0;
  var itemPrice = 0;
  var quantity = 0;
  /* loop through eachcart item and get the compared price and actual price */

  if (typeof cartLib !== "undefined") {
    $.each(cartLib, function (key, value) {
      quantity = parseInt(value.quantity); //console.log("quantity: " + quantity);

      if (value.comparePrice != "") {
        lineItemComparePrice = parseInt(value.comparePrice) * quantity + lineItemComparePrice;
        console.log("lineItemComparePrice: " + lineItemComparePrice);
      } else {
        lineItemComparePrice = parseInt(value.price) * quantity;
      }

      itemPrice = parseInt(value.price) * quantity; //console.log("itemPrice: " + itemPrice);

      subTotal += lineItemComparePrice; //console.log("subTotal: " + subTotal);

      discount += lineItemComparePrice - itemPrice; //console.log("discount: " + discount);
    });
    total = CartJS.cart.total_price; //format

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

    $(".free-shipping").show(); //show/hide js__cartSubtotalDiscountWraper - if you want to show subtotal and discount

    showCartSubTotalDiscountSection ? $(".js__cartSubtotalDiscountWraper").removeClass("hide") : console.log("SubTotal Discount Wrapper: NOT visible");
  } else {
    /* 
    update cart item count = 0
    hide the totals
    hide checkout buttons
    update the icon cart with a different icon
    */
    $(".js__ajax-products-bind").html('<li><div class="width-100"> <p class="uppercase text-center">Your cart is empty</p> </div></li>');
    $(".freq-product-list").hide();
    $(".free-shipping").hide();
    $(".js__ajax-cart-count").html(cartCountEmptyValue);
    $(".js__ajax-cart-total").hide();
    $(".js__top-cart-form-actions").hide();
    $(".js__show-cart-items-section").hide();
    $(".empty-cart-section").show();
    $(".js__cart-expand ").addClass("empty-cart"); //change the icon for the top cart, if required

    showEmptyCartIcon ? $(".js__update-cart-icon").addClass("empty-cart") : console.log("Top Cart Icon: NOTchanged");
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
  var variantID = parseInt($(this).attr("data-variant-id"));
  var itemLineCount = parseInt($(this).attr("data-cart-line-count")); //console.log("itemLineCount: " + itemLineCount);

  var extraItemLineCount = 1;
  /* offer main product ID and bool*/

  var productID = ""; //Run properties loop and set clickRemove status = true if BoxID is found

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

    extraItemLineCount = extraItemLineCount + 1; //console.log("clickedRemoveItemStatus: " + clickedRemoveItemStatus);

    if (clickedRemoveItemStatus) {
      //console.log("clickedRemoveItemStatus: " + true);
      clickedRemoveItemStatus = false;
      return false;
    }
  });
  extraItemLineCount = 1;
  /* CUSTOM: Loop through items and properties */

  $(CartJS.cart.items).each(function () {
    currentItemID = this.id; //console.log("LoopCurrentItemID: " + currentItemID);

    $.each(this.properties, function (key, value) {
      //console.log("key4: " + key);
      //console.log("boxID4: " + boxID);
      if (key == boxID) {
        //console.log("Property Match");
        currentItemPropertyBoxID = value; //console.log("currentItemPropertyBoxID: " + currentItemPropertyBoxID);
        //console.log("savedItemPropertyBoxID: " + savedItemPropertyBoxID);

        if (currentItemPropertyBoxID == savedItemPropertyBoxID) {
          //console.log("remove the current item");
          extraItemLineCount = 1;
          howManyItemsToDelete = howManyItemsToDelete + 1;
          howManyVariantIDToDelete.push(currentItemID); //Remove the product that clicked
        } else {
          extraItemLineCount = extraItemLineCount + 1;
        }
      } else {//console.log("BOX ID ISN'T THERE IN PRODUCT");
        //removeItem(itemLineCount);
      }
    }); //console.log("howManyVariantIDToDelete: " + howManyVariantIDToDelete);
  }); //console.log("TOTAL: howManyVariantIDToDelete: " + howManyVariantIDToDelete);
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
    var currentItemLoop = 1; // NOTE: used "removeItemById" as for this particular project ..

    for (var n = 0; n < howManyVariantIDToDelete.length; ++n) {
      removeItemById(howManyVariantIDToDelete[n]); //debugger;
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
      freeShippingPercentage = totalAmount * 100 / freeShippingAmount;
      $(".js__free-shipping-limit-message").show();
      $(".js__free-shipping-message").hide();
    } else {
      $(".js__free-shipping-limit-message").hide();
      $(".js__free-shipping-message").show();
    }

    $(".js__free-shipping-remaning-amount").html(formatter.format(freeShippingRemaningAmount));
    $(".js__free-shipping__progress-bar").attr("data-percentage", freeShippingPercentage);
    $(".js__free-shipping__progress-bar").children("span").css("width", freeShippingPercentage + "%");
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
    var quantity = 1;
    var addonSelectedVariantID = $(this).attr("data-attr-variantid");
    cartAddItemAddon(addonSelectedVariantID, quantity);
  });
  $(".js__addon-add-to-cart").keypress(function () {
    var keycode = event.keyCode || event.which;

    if (keycode == "13") {
      event.preventDefault();
      var quantity = 1;
      var addonSelectedVariantID = $(this).attr("data-attr-variantid");
      cartAddItemAddon(addonSelectedVariantID, quantity);
    }
  });
});

function cartAddItemAddon(addonSelectedVariantID, addonQuantity) {
  CartJS.addItem(addonSelectedVariantID, addonQuantity, {}, {
    success: function success(data, textStatus, jqXHR) {//console.log("success");

      /* Pending - Remove the selected addon when add to cart is clicked */
    },
    error: function error(jqXHR, textStatus, errorThrown) {//console.log("error");
    }
  });
}

function addons() {
  //console.log("addons");

  /*Hide repeating addons*/
  var cartAddons = "";
  $(".js__top-cart-addons li").each(function (index) {
    // update this with variantID
    var addoneHandle = $(this).attr("data-handler"); // if cartAddon is null,

    if (cartAddons == "") {
      // save the addonHandle
      cartAddons = addoneHandle;
    } else {
      //set bool value to see if the addons is present in the addon list or not
      // by default it's false
      var boolCartAddons = false; // going through the string and checking if the current addon handle = the addon
      //handle present in the string

      var cartAddons2 = cartAddons.split(",");

      for (var a = 0; a < cartAddons2.length; a++) {
        if ($(this).attr("data-handler") == cartAddons2[a]) {
          // if present, then hide it
          $(this).hide();
          boolCartAddons = true;
        }
      } // add the new addon handle to the string


      if (boolCartAddons == false) {
        cartAddons = cartAddons + "," + addoneHandle;
      }
    } //console.log(cartAddons);

    /* Hide the addons from the addon list, if the addon is present in the cart */


    var boolItemCartAddon = false;
    $(".js__ajax-products-bind li").each(function (index) {
      var itemHandle = $(this).attr("data-handle"); //console.log("itemHandle"+itemHandle);
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
  }); //console.log("boolAddonExist"+boolAddonExist);

  if (boolAddonExist == false) {
    //console.log("if");
    $(".js__freq-bought-products").hide();
  } else {
    //console.log("else");
    $(".js__freq-bought-products").show();
  }
} //Addons are fetched from the schemas; Varies from theme to theme


setTimeout(function () {
  addons();
}, 1000); //loop through cart items to get property on the basis of variant ID

function loopThroughCartItems_on_VariantID(variantID) {
  var currentVariantID = "";
  var properties = "";
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
  var variantID = "";
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
"use strict";

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
    adaptiveHeight: true
  });
  $(".js__product-slider-section").not(".slick-initialized").slick({
    dots: false,
    arrows: true,
    slidesToShow: 2,
    infinite: false,
    speed: 500,
    draggable: false,
    cssEase: "ease-in-out",
    autoplay: false,
    adaptiveHeight: true,
    responsive: [{
      breakpoint: 1260,
      settings: {
        variableWidth: true,
        slidesToShow: 1
      }
    }]
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
    adaptiveHeight: true
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
    responsive: [{
      breakpoint: 981,
      settings: {
        slidesToShow: 7
      }
    }, {
      breakpoint: 769,
      settings: {
        slidesToShow: 5
      }
    }, {
      breakpoint: 481,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    }]
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
    responsive: [{
      breakpoint: 769,
      settings: {
        arrows: true
      }
    }]
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
  } catch (_unused) {}
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
    draggable: true
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
      $("html, body").stop().animate({
        scrollTop: target.offset().top - 150
      }, 1000);
    }
  });
  $(".js__accordian").children("li:first-child").addClass("active");
  /* accordion working about content in small screen*/

  $(".js__accordian").children("li").children("h5,h6,h3").click(function (e) {
    if ($(this).parent("li").children(".content").css("display") == "none") {
      $(this).parent("li").parent(".js__accordian").children("li").children(".content").hide();
      $(this).parent("li").parent(".js__accordian").children("li").removeClass("active");
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
    var dropdown = $(".dropdown-select").val(); //first hide all tabs again when a new option is selected

    $(".tab-content").hide(); //then show the tab content of whatever option value was selected

    $("#" + "tab-" + dropdown).show();
  });
});
"use strict";

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
  reloadAjaxCartItemUsingCartAjaxObject(cart); //Progress Bar of shipping in cart and mini cart; Varies from theme to theme

  progressBar(); //Show and hide empty cart depending upon the cart items

  setTimeout(function () {
    calculateSubTotalWithDiscount();
    addons();
  }, 1000);
}); // $(document).on("cart.requestStarted", function (event, cart) {console.log("Request started"); });
//$(document).on("cart.ready", function (event, cart) {});

/* currency formatter */

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});
"use strict";

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
      draggable: true
    });
  }
});
"use strict";

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
    adaptiveHeight: false
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
    $(".has-sub-nav .site-nav__link,.has-sub-nav .sub-nav").mouseover(function () {
      $(".has-sub-nav .site-nav__link").addClass("hover-submenu");
      $(".has-sub-nav .sub-nav").css("visibility", "visible");
      $(".has-sub-nav .sub-nav").css("opacity", "1");
    });
    $(".has-sub-nav .site-nav__link,.has-sub-nav .sub-nav").mouseout(function () {
      $(".has-sub-nav .site-nav__link").removeClass("hover-submenu");
      $(".has-sub-nav .sub-nav").css("visibility", "hidden");
      $(".has-sub-nav .sub-nav").css("opacity", "0");
    });
    $(".has-big-nav .site-nav__link,.has-big-nav .big-nav").mouseover(function () {
      $(".has-big-nav .site-nav__link").addClass("hover-submenu");
      $(".has-big-nav .big-nav").css("visibility", "visible");
      $(".has-big-nav .big-nav").css("opacity", "1");
    });
    $(".has-big-nav .site-nav__link,.has-big-nav .big-nav").mouseout(function () {
      $(".has-big-nav .site-nav__link").removeClass("hover-submenu");
      $(".has-big-nav .big-nav").css("visibility", "hidden");
      $(".has-big-nav .big-nav").css("opacity", "0");
    });
  }
  /* SubMenu
  Accordion JS */


  (function ($) {
    $(function () {
      var navLink = false;
      $(".accordion-toggle").on("mousedown", function (e) {
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
      }).focus(function (e) {
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
      $(".accordion-toggle-inner").on("mousedown", function (e) {
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
      }).focus(function (e) {
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
      document.getElementById("navbarNavDropdown").classList.add("fixed"); // add padding top to show content behind navbar

      var navbar_height = document.querySelector(".navbar-collapse").offsetHeight;
      document.body.style.paddingTop = navbar_height + "px";
    } else {
      document.getElementById("navbarNavDropdown").classList.remove("fixed"); // remove padding top from body

      document.body.style.paddingTop = "0";
    }
  });
});
/** Mobile Navigation Open Close **/

(function ($) {
  $(function () {
    var navLink = false;
    $("#hamburger").mousedown(function (e) {
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
    }).focus(function (e) {
      "use strict";

      if (navLink) {} else {
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
"use strict";

$(document).ready(function ($) {
  /*Slider working Start*/

  /* Main SLIDER  initialization */
  $(".pdp-slider").not(".slick-initialized").slick({
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
    $(".js__pdp-thumbnail-slider").not(".slick-initialized").slick({
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
          slidesToShow: 3
        }
      }, {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          verticalSwiping: false,
          vertical: false,
          variableWidth: true
        }
      }]
    });
  } else {
    $(".js__pdp-thumbnail-slider").not(".slick-initialized").slick({
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
          variableWidth: true
        }
      }]
    });
  }
  /*PDP tab section drop down change*/


  $(".js__pdp-tab-select").change(function () {
    $(".tab-content").removeClass("active");
    $(".tab-content").hide();
    $("#" + $(this).val()).show();
    $("#" + $(this).val()).addClass("active");
    $(".tab-link").removeClass("active");
    $("#tab-link-" + $(this).val()).addClass("active");
  });
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
        scrollTop: target.offset().top - 200
      }, 500);
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
      $("html, body").animate({
        scrollTop: target.offset().top - 350
      }, 500);
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
        var colorValue = getVariantColor(color); //$(this).children("div.color").css("background-color", colorValue);

        if (colorValue == "") {
          $(this).children("img").css("opacity", "0");
        }

        $(this).children("img").attr("src", colorValue);
      });
    }
  }
});
/*PENDING Get Variant Color*/

function getVariantColor(color) {
  try {
    var variantColorValue = "";
    $.each(prodColor, function (key, value) {
      if (color.toLowerCase() == value.title.toLowerCase()) {
        variantColorValue = value.color;
      }
    });
    /* $.each(prodLib, function (key, value) {
       if (color.toLowerCase() == value.option1.toLowerCase()) {
         variantColorValue = value.image;
       }
     });*/

    return variantColorValue;
  } catch (_unused) {}
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
  });
  $(document).on("mouseleave", ".js__product-cart-color li", function () {
    var productID = $(this).attr("data-product-id");
    var featuredImage = $(".js__product-image-" + productID).attr("data-src");
    $(".js__product-image-" + productID).attr("src", featuredImage);
  });
});
"use strict";

var colorSelected = "";
var secondOptionVariantValue = "";
var thirdOptionVariantValue = "";
var selectedVariantID;
$(document).ready(function ($) {
  /* if no varient then active class added in product image section*/
  if (prodLib.length == 0) {
    $(".js-pdp-media").addClass("active");
    $(".js__pdp-thumbnail-slider li:first-child").addClass("active");
  }

  var colorPosition = $("#colorPosition").val();
  var numberOfAvailableOptions = parseInt($("#optionSize").val()); // on page load check the color position, and set 2nd and 3rd options values

  checkColorPosition();

  function checkColorPosition() {
    getColorPosition();
    /* 
    if only color and no other options
    */

    if (colorPosition != undefined && numberOfAvailableOptions == 1) {
      SoldOutUnavailableOnColorSwatches(colorSelected);
    }
  }
  /*
  PENDING Merge  - Plus and Minus
  */

  /*Quantity Plus Minus*/


  $(".js-product-single__quantity .js-plus-minus-qty").click(function () {
    var type = $(this).attr("data-type");
    var productQuantity = $(".js-quantity-selector").val();

    if (type == "minus") {
      if (productQuantity > 1) {
        productQuantity--;
      }
    } else {
      productQuantity++;
    }

    $(".js-quantity-selector").val(productQuantity);
  }); // On DD change, fire the form DD element and also run the soldoutColorSwatches function

  $(".js__pdp-variant-select").change(function () {
    var optionIndex = $(this).attr("data-option");
    var optionValue = $(this).val();
    $("#product .product__form .options .option.option-" + optionIndex + " .label span").text(optionValue); // button  - Sold out and add to cart

    $("#product-select-option-" + optionIndex).val(optionValue).trigger("change"); //color swatch - sold out working

    SoldOutUnavailableOnColorSwatches(colorSelected);
  }); // main sold out and unavailable working

  function SoldOutUnavailableOnColorSwatches(colorSelected) {
    getColorPosition(); // Remove out of stock and unavailable from color swatches

    $(".js__color-swatches").removeClass("out-of-stock");
    $(".js__color-swatches").removeClass("unavailable");
    var colorLength = $(".js__color-swatches").length;
    var colorCount = 1;
    /*
    Loop Through each input radio for the color
    */
    // we are using color swatch working for other options when they are radio buttons

    $(".js__color-swatches").each(function (index) {
      var colorValue = $(this).attr("data-value");
      var checkColorOptionExists = false;
      /* 
       Loop through product library object for variant 
       and if variant select matches and quantity = 0 then show out of stock message
       */

      /*
      PENDING - Merge - ProdLib Each Function
      */

      $.each(prodLib, function (key, value) {
        var itemQuantity = value.quantity;
        var itemAvailable = value.available;
        var prodColorOptionValue = "";
        var prodSecondOptionValue = "";
        var prodThirdOptionValue = "";

        if (colorPosition == "1") {
          prodColorOptionValue = value.option1;
          prodSecondOptionValue = value.option2;
          prodThirdOptionValue = value.option3;
        }

        if (colorPosition == "2") {
          prodColorOptionValue = value.option2;
          prodSecondOptionValue = value.option1;
          prodThirdOptionValue = value.option3;
        }

        if (colorPosition == "3") {
          prodColorOptionValue = value.option3;
          prodSecondOptionValue = value.option1;
          prodThirdOptionValue = value.option2;
        }

        var colorOption = prodColorOptionValue.toLowerCase();
        colorOption = colorOption.replace(/[^a-zA-Z0-9 ]/g, "-"); // Pending - Reduce these 3 lines

        colorOption = colorOption.replace(/ /g, "-");
        colorOption = colorOption.replace(/--/g, "-");
        colorOption = colorOption.replace(/---/g, "-");
        /*Checking each color  size quantity and which have 0 then added out of stock class*/

        if (numberOfAvailableOptions == 3) {
          /*three matching option checking quantity if 0 then showing out of stock */
          if (secondOptionVariantValue.toLowerCase() == prodSecondOptionValue.toLowerCase() && thirdOptionVariantValue.toLowerCase() == prodThirdOptionValue.toLowerCase()) {
            {
              //check if quantity>1 then set the color swatch - Out of stock
              setColorSwatchOutofStock(colorOption, itemQuantity, itemAvailable);
            }
          }
        } else if (numberOfAvailableOptions == 2) {
          /*two matching option checking quantity if 0 then showing out of stock */
          if (prodSecondOptionValue.toLowerCase() == secondOptionVariantValue.toLowerCase()) {
            {
              //check if quantity>1 then set the color swatch - Out of stock
              setColorSwatchOutofStock(colorOption, itemQuantity, itemAvailable);
            }
          }
        } else {
          //check if quantity>1 then set the color swatch - Out of stock
          setColorSwatchOutofStock(colorOption, itemQuantity, itemAvailable);
        }

        if (prodColorOptionValue == colorValue) {
          if (numberOfAvailableOptions == 3) {
            if (prodSecondOptionValue.toLowerCase() == secondOptionVariantValue.toLowerCase() && prodThirdOptionValue.toLowerCase() == thirdOptionVariantValue.toLowerCase()) {
              checkColorOptionExists = true;
            }
          } else if (numberOfAvailableOptions == 2) {
            if (prodSecondOptionValue.toLowerCase() == secondOptionVariantValue.toLowerCase()) {
              checkColorOptionExists = true;
            }
          } else {
            checkColorOptionExists = true;
          }
        }
      });

      if (checkColorOptionExists == false) {
        var colorOption = colorValue;
        colorOption = colorOption.replace(/[^a-zA-Z0-9 ]/g, "-");
        colorOption = colorOption.replace(/ /g, "-");
        colorOption = colorOption.replace(/--/g, "-");
        colorOption = colorOption.replace(/---/g, "-");
        colorOption = colorOption.toLowerCase();
        $(".js__color-swatches[data-type-value=" + colorOption + "]").removeClass("out-of-stock");
        $(".js__color-swatches[data-type-value=" + colorOption + "]").addClass("unavailable");

        if ($(".js__color-swatches[data-type-value=" + colorOption + "]").hasClass("active")) {
          var nextColor = colorCount + 1;

          if (colorCount < colorLength) {
            $(".js__color-swatches:nth-child(" + nextColor + ")").click();
          } else {
            $(".js__color-swatches:nth-child(1)").click();
          }
        }
      }

      colorCount++;
    });
  }

  function getColorPosition() {
    if (colorPosition != undefined && numberOfAvailableOptions > 1) {
      if (colorPosition == "1") {
        secondOptionVariantValue = $(".js__pdp-variant-select1").val();

        if (numberOfAvailableOptions > 2) {
          thirdOptionVariantValue = $(".js__pdp-variant-select2").val();
        }
      }

      if (colorPosition == "2") {
        secondOptionVariantValue = $(".js__pdp-variant-select0").val();

        if (numberOfAvailableOptions > 2) {
          thirdOptionVariantValue = $(".js__pdp-variant-select2").val();
        }
      }

      if (colorPosition == "3") {
        secondOptionVariantValue = $(".js__pdp-variant-select0").val();

        if (numberOfAvailableOptions > 2) {
          thirdOptionVariantValue = $(".js__pdp-variant-select1").val();
        }
      }
    } else {
      secondOptionVariantValue = $(".js__pdp-variant-select0").val();

      if (numberOfAvailableOptions > 1) {
        thirdOptionVariantValue = $(".js__pdp-variant-select1").val();
      }
    }

    try {
      colorSelected = colorSelected.toLowerCase();
    } catch (_unused) {}
  }

  function setColorSwatchOutofStock(prodColor, prodQuantity, prodAvailability) {
    if (prodQuantity < 1 && prodAvailability == "false") {
      $(".js__color-swatches[data-type-value=" + prodColor + "]").addClass("out-of-stock");
    }
  }
});