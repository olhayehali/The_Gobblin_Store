  // on document ready
$(document).ready(() => {
  // Load the header.html into the header div, once it's loaded execute callback to add class to headerHome div
  $("#header").load("/template/header/header.html", () => {
    $("#headerContactUs")
      .removeClass()
      .addClass("nav-link active text-black fw-bold");
  });

  // Load the footer.html into the footer div, once it's loaded execute callback to add class to footerHome div
  $("#footer").load("/template/footer/footer.html", () => {
    $("#footerContactUs")
      .removeClass()
      .addClass("nav-link active text-black fw-bold");
  });

  // Load shoppingCart.html
  $("#shoppingCart").load("/template/shoppingCart/shoppingCart.html");

  //check if browser is laptop
  //if it is then add event listener to each image
  //else it's not laoptop then not add event listener
  if (window.innerWidth > 768 ) {
    //this two event listen to mouse movement on each image 
    //if mouse in big up the image
    //if mouse out big down the image
    $(".card-img").on("mouseover", function () {
      $(this).css("transition", "transform 0.5s");
      $(this).css("transform", "scale(1.2)");
    });
    $(".card-img").on("mouseout", function () {
      $(this).css("transition", "transform 0.5s");
      $(this).css("transform", "scale(1)");
    });
  }
 });
  