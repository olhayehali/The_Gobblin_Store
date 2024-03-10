$(document).ready(function () {
  var products = Array();
  var totalPrice = 0;
  if (localStorage.getItem("totalPrice")) {
    totalPrice = localStorage.getItem("totalPrice");
  }
  function renderTotal() {
    if(localStorage.getItem("totalPrice")){
      $("#totalPrice").text(localStorage.getItem("totalPrice"));
    }
  }
  function calculTotalPrice() {
    let total = 0;
    if (localStorage.getItem("items")) {
      products = JSON.parse(localStorage.getItem("items"));
      products.map((product) => {
        total += product.price * product.quantity;
      });
    }
    localStorage.setItem("totalPrice", total.toFixed(2));
    renderTotal();
  }
  calculTotalPrice();

  let itemNumber = 0;
  if (localStorage.getItem("items")) {
    products = JSON.parse(localStorage.getItem("items"));
    itemNumber = products.length;
  }
  $(".numberOfItems").text(itemNumber);
  // when the user clicks the shopping cart button, update .modal-body with the items in the cart
  $(".buttonWrapper").click(function () {
    if (localStorage.getItem("items")) {

      products = JSON.parse(localStorage.getItem("items"));

      let modalBody = $(".modal-body");
      modalBody.empty(); // empty the initial contents of modal body before adding new items

      // render products name, price, and quantity
      products.map((product) => {
        modalBody.append(
          `<div class="productWrapper" id="${product.name}">
                <div id="productInfo">
                  <div class="name">${product.name} - $${product.price}/item</div>
                  <div class="quantity">x ${product.quantity}</div>
                </div>
                <div id="actions">
                  <button class="btn btn-primary increaseQuantity" id="${product.name}">
                    +
                  </button>
                  <button class="btn btn-danger decreaseQuantity" id="${product.name}">
                    -
                  </button>               
              </div>
              `
        );
      });

      $(".increaseQuantity").click(function () {
        // get the id attribute of the button
        let productName = $(this).attr("id");
        // match the productName to the selected item inside products array
        let product = products.find((product) => product.name === productName);
        // then increase the selected item quantity by 1
        product.quantity++;

        // update the quantity div's text - go up to productWrapper level, and then find the div with .quantity class
        $(this)
          .closest(".productWrapper") // get the closest productWrapper div
          .find(".quantity") // get the quantity div
          .text(`x ${product.quantity}`); // update the text of the quantity

        // update the items in localStorage
        localStorage.setItem("items", JSON.stringify(products));
        calculTotalPrice();
        $(".numberOfItems").text(products.length);

      });

      $(".decreaseQuantity").click(function () {
        let productName = $(this).attr("id");
        let product = products.find((product) => product.name === productName);
        if (product.quantity > 1) {
          product.quantity--;
          $(this)
            .closest(".productWrapper")
            .find(".quantity")
            .text(`x ${product.quantity}`);
        } else {
          // remove the product from the array
          products = products.filter((product) => product.name !== productName);
          $(this).closest(".productWrapper").remove();
        }
        localStorage.setItem("items", JSON.stringify(products));
        calculTotalPrice();
        $(".numberOfItems").text(products.length);

      });
      calculTotalPrice();
      $(".numberOfItems").text(products.length);

    }
  });
});
