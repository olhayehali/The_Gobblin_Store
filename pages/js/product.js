function renderProducts(products) {

  Object.keys(products).forEach((key) => {
    let product = products[key];
    $("#products").append(
      `
      <div class="col-lg-8  m-auto my-2">
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.name}" width=300 height=300>
          <div class="card-body">
            <h5 class="card-title
            ">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">$${product.price}</p>
            <button class="btn btn-primary">Add to cart</button>
          </div>
        </div>
      </div>
      `);
  });
}
async function getProducts() {
  // Get the products from the server
  let data = await fetch("http://localhost:3000/products");
  let productsResponse = await data.json();
  renderProducts(productsResponse);
}

function ready(){
    // Load the header.html into the header div, once it's loaded execute callback to add class to headerHome div
  $("#header").load("/template/header/header.html", () => {
    $("#headerProduct")
      .removeClass()
      .addClass("nav-link active text-black fw-bold");
  });

  // Load the footer.html into the footer div, once it's loaded execute callback to add class to footerHome div
  $("#footer").load("/template/footer/footer.html", () => {
    $("#footerProduct")
      .removeClass()
      .addClass("nav-link active text-black fw-bold");
  });

  // Get the products
  getProducts();

}



//on document load jquery
$(document).ready(ready);
