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
  var numberOfAvailableOptions = parseInt($("#optionSize").val());

  // on page load check the color position, and set 2nd and 3rd options values
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
  var type=$(this).attr("data-type");
  var productQuantity = $(".js-quantity-selector").val();
  if(type=="minus")
  {
    if (productQuantity > 1) {
      productQuantity--;
    }
  }
  else
  {
    productQuantity++;
  }
    $(".js-quantity-selector").val(productQuantity);
  });
  

  // On DD change, fire the form DD element and also run the soldoutColorSwatches function
  $(".js__pdp-variant-select").change(function () {
    var optionIndex = $(this).attr("data-option");
    var optionValue = $(this).val();
    $(
      "#product .product__form .options .option.option-" +
        optionIndex +
        " .label span"
    ).text(optionValue);
    // button  - Sold out and add to cart
    $("#product-select-option-" + optionIndex)
      .val(optionValue)
      .trigger("change");
    //color swatch - sold out working
    SoldOutUnavailableOnColorSwatches(colorSelected);
  });
  // main sold out and unavailable working
  function SoldOutUnavailableOnColorSwatches(colorSelected) {
    getColorPosition();

    // Remove out of stock and unavailable from color swatches
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
        let itemQuantity = value.quantity;
        let itemAvailable = value.available;
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
        colorOption = colorOption.replace(/[^a-zA-Z0-9 ]/g, "-");
        // Pending - Reduce these 3 lines
        colorOption = colorOption.replace(/ /g, "-");
        colorOption = colorOption.replace(/--/g, "-");
        colorOption = colorOption.replace(/---/g, "-");
        /*Checking each color  size quantity and which have 0 then added out of stock class*/
        if (numberOfAvailableOptions == 3) {
          /*three matching option checking quantity if 0 then showing out of stock */
          if (
            secondOptionVariantValue.toLowerCase() ==
              prodSecondOptionValue.toLowerCase() &&
            thirdOptionVariantValue.toLowerCase() ==
              prodThirdOptionValue.toLowerCase()
          ) {
            {
              //check if quantity>1 then set the color swatch - Out of stock
              setColorSwatchOutofStock(
                colorOption,
                itemQuantity,
                itemAvailable
              );
            }
          }
        } else if (numberOfAvailableOptions == 2) {
          /*two matching option checking quantity if 0 then showing out of stock */
          if (
            prodSecondOptionValue.toLowerCase() ==
            secondOptionVariantValue.toLowerCase()
          ) {
            {
              //check if quantity>1 then set the color swatch - Out of stock
              setColorSwatchOutofStock(
                colorOption,
                itemQuantity,
                itemAvailable
              );
            }
          }
        } else {
          //check if quantity>1 then set the color swatch - Out of stock
          setColorSwatchOutofStock(colorOption, itemQuantity, itemAvailable);
        }

        if (prodColorOptionValue == colorValue) {
          if (numberOfAvailableOptions == 3) {
            if (
              prodSecondOptionValue.toLowerCase() ==
                secondOptionVariantValue.toLowerCase() &&
              prodThirdOptionValue.toLowerCase() ==
                thirdOptionVariantValue.toLowerCase()
            ) {
              checkColorOptionExists = true;
            }
          } else if (numberOfAvailableOptions == 2) {
            if (
              prodSecondOptionValue.toLowerCase() ==
              secondOptionVariantValue.toLowerCase()
            ) {
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
        $(
          ".js__color-swatches[data-type-value=" + colorOption + "]"
        ).removeClass("out-of-stock");
        $(".js__color-swatches[data-type-value=" + colorOption + "]").addClass(
          "unavailable"
        );
       
        if (
          $(
            ".js__color-swatches[data-type-value=" + colorOption + "]"
          ).hasClass("active")
        ) {
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
    } catch {}
  }

  function setColorSwatchOutofStock(prodColor, prodQuantity, prodAvailability) {
    if (prodQuantity < 1 && prodAvailability == "false") {
      $(".js__color-swatches[data-type-value=" + prodColor + "]").addClass(
        "out-of-stock"
      );
    }
  }
});
