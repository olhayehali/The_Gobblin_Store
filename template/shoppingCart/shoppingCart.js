var products = Array();
var totalPrice = 0;

function renderTotal() {
  if(localStorage.getItem("totalPrice")){
    $("#totalPrice").text(localStorage.getItem("totalPrice"));
    $("#totalPrice2").text("$"+localStorage.getItem("totalPrice"));
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
  try {
    renderCheckoutCart();
    
  } catch (error) {
    console.log("No items in cart");        
  }

}
function renderItemsQuantity(){
  let itemNumber = 0;
  if (localStorage.getItem("items")) {
    products = JSON.parse(localStorage.getItem("items"));
    products.map((product) => {
      itemNumber += product.quantity;
    });
  }
  $(".numberOfItems").text(itemNumber);  
  $("#totalItemsValue").text(itemNumber.toFixed(0));
  try {
    renderCheckoutCart();
    
  } catch (error) {
    console.log("No items in cart");        
  }
}
function goToCheckout(){
  //check if there are items in the cart
  if(localStorage.getItem("totalPrice")> 0){
    window.location.href = "/pages/checkout/checkout.html";
  }
  else{
    $(".modal-body").text("No items in cart");
  }
}

$(document).ready(function () {

  // when the user clicks the shopping cart button, update .modal-body with the items in the cart
  calculTotalPrice();

  renderItemsQuantity();
  
  $(".buttonWrapper").click(function () {
    if (localStorage.getItem("items").length > 0) {

      products = JSON.parse(localStorage.getItem("items"));

      let modalBody = $(".modal-body");
      modalBody.empty(); // empty the initial contents of modal body before adding new items

      // render products name, price, and quantity
      products.map((product) => {
        modalBody.append(
          `<div class="productWrapper" id="${product.name}">
                <div id="productInfo">
                  <img src='${product.image}' height='30' width='30'/>
                  <span class="name">${product.name} - $${product.price}/item</span><br/>
                </div>
                <div id="actions" class='display:flex'>
                  <button class="btn btn-primary increaseQuantity" id="${product.name}">
                    +
                  </button>
                  <span class="quantity">${product.quantity}</span>
                  <button class="btn btn-secondary decreaseQuantity" id="${product.name}">
                    -
                  </button>    
                  <button class='btn btn-danger deleteItem' id='${product.name}' >
                  <img src="/pics/trash-solid.svg" width="10" height="10" class='img' alt="trash">
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
          .text(` ${product.quantity}`); // update the text of the quantity

        // update the items in localStorage
        localStorage.setItem("items", JSON.stringify(products));
        calculTotalPrice();
        renderItemsQuantity();
      });

      $(".decreaseQuantity").click(function () {
        let productName = $(this).attr("id");
        let product = products.find((product) => product.name === productName);
        if (product.quantity > 1) {
          product.quantity--;
          $(this)
            .closest(".productWrapper")
            .find(".quantity")
            .text(` ${product.quantity}`);
        } 
        else if(product.quantity === 1){
          // products = products.filter((product) => product.name !== productName);
          // $(this).closest(".productWrapper").remove();
        }
        else {
          // remove the product from the array
          products = products.filter((product) => product.name !== productName);
          $(this).closest(".productWrapper").remove();
        }
        localStorage.setItem("items", JSON.stringify(products));
        calculTotalPrice();
        renderItemsQuantity();
      });

      $(".deleteItem").click(function () {
        let productName = $(this).attr("id");
        products = products.filter((product) => product.name !== productName);
        $(this).closest(".productWrapper").remove();
        localStorage.setItem("items", JSON.stringify(products));
        calculTotalPrice();
        renderItemsQuantity();
      });
      
      calculTotalPrice();
      renderItemsQuantity();
    }
    else{
      $(".modal-body").text("No Items... Please add items to your cart.");
    }
  });
  $("#checkoutButton").click(goToCheckout);
});
