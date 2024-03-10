      // on document ready
      $(document).ready(() => {
        // Load the header.html into the header div, once it's loaded execute callback to add class to headerHome div
        $("#header").load("/template/header/header.html", () => {
          $("#headerAboutUs")
            .removeClass()
            .addClass("nav-link active text-black fw-bold");
        });

        // Load the footer.html into the footer div, once it's loaded execute callback to add class to footerHome div
        $("#footer").load("/template/footer/footer.html", () => {
          $("#footerAboutUs")
            .removeClass()
            .addClass("nav-link active text-black fw-bold");
        });
        $("footer").text("© 2021 by Goblin Games");

        // Load shoppingCart.html
        $("#shoppingCart").load("/template/shoppingCart/shoppingCart.html");
      });
