function ready(){
    // Load the header.html into the header div, once it's loaded execute callback to add class to headerHome div
  $("#header").load("/template/header/header.html", () => {
    $("#headerShop")
      .removeClass()
      .addClass("nav-link active text-black fw-bold");
  });

  // Load the footer.html into the footer div, once it's loaded execute callback to add class to footerHome div
  $("#footer").load("/template/footer/footer.html", () => {
    $("#footerShop")
      .removeClass()
      .addClass("nav-link active text-black fw-bold");
  });
  // Load shoppingCart.html
  $("#shoppingCart").load("/template/shoppingCart/shoppingCart.html");
  function renderTotal() {
    if(localStorage.getItem("totalPrice")){
      $("#totalPrice").text(localStorage.getItem("totalPrice"));
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
    renderItemsQuantity();
  }  

  // if the user clicks the add to cart button or the card, add the item to the cart
  // it will save the cart info to localStorage
  //it will show the toast: "item has been added to your cart" momentarily
  //then render the number of items in the cart and the total price in the cart
  $(".card").click(function () {
  let products = [];
  //get items name, price and image

  // populate the products array with the current product's info
  if (localStorage.getItem("items")) {
  products = JSON.parse(localStorage.getItem("items"));
  }
  const itemElement = $(this).find(".card-text").text(); // Supreme Goblin$100
  const itemName = itemElement.split("$")[0]; // Supreme Goblin
  const itemPrice = itemElement.split("$")[1]; // 100
  const itemImage = $(this).find(".card-img-top").attr("src");

  //show the toast
  $('.toast-body').text(itemName + ":"+itemPrice+"$ has been added to your cart");
  $('.toast').toast('show');

  // check if the item is already in the cart
  let itemExists = false;
  products.forEach((product) => {
  if (product.name === itemName) {
    itemExists = true;
    product.quantity += 1;
  }
  });

  // if the item is not in the cart, add it to the cart
  if (!itemExists) {
  products.push({
    name: itemName,
    price: itemPrice,
    quantity: 1,
    image: itemImage,
  });
  }

  // save the products array to localStorage
  localStorage.setItem("items", JSON.stringify(products));
  calculTotalPrice();

  $(".numberOfItems").text(products.length);
  renderItemsQuantity();
});

}

// on document ready
$(document).ready(() => {
      ready();
  });
  