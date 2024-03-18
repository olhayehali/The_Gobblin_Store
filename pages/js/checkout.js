//setup firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAnOhTqBrR80l5VjytR_hiIES5bmdIKhw8",
  authDomain: "olkashop.firebaseapp.com",
  databaseURL: "https://olkashop-default-rtdb.firebaseio.com",
  projectId: "olkashop",
  storageBucket: "olkashop.appspot.com",
  messagingSenderId: "22499407695",
  appId: "1:22499407695:web:4b84dc3f9ba1f7db7a373a",
  measurementId: "G-E1MYHWH9TG"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// console.log(app)

//send data to firebase
const db = firebase.database(app);

// this boolean var is used to check if the user has submitted the form and the modal is shown
//if true when the user close the modal the page will be redirected to the shop page
//if false when the user close the modal the page will not be redirected to the shop page
var redirect = false;

function formValidation(event){
  let form = $("#checkoutForm");
  if (form[0].checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  }
  form.addClass('was-validated');
}
function checkinputvalue(input,value,normalValue){
  if (value.match(normalValue)) {
    $(input).addClass('is-valid');
    $(input).removeClass('is-not-valid');
  } else {
    $(input).addClass('is-not-invalid');
    $(input).removeClass('is-valid');
  }
}
function inputCheck(object){
  let text = $(object).val();
  let id = $(object).attr('id');
  //regex patterm fpr name
  let namePattern = /^[a-zA-Z ]+$/;
  //regex pattern for email
  let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //regex pattern for address
  let addressPattern = /^[a-zA-Z0-9\s,'-]*$/;
  //regex pattern for city
  let cityPattern = /^[a-zA-Z]+$/;
  //regex pattern for state
  let statePattern = /^[a-zA-Z]+$/;
  //regex pattern for zip
  let zipPattern = /^[0-9]{5}$/;
  //regex pattern for card name
  let cardNamePattern = /^[a-zA-Z ]+$/;
  //regex pattern for card number
  let cardNumberPattern = /^[0-9]{16}$/;
  //regex pattern for card cvv
  let cvvPattern = /^[0-9]{3}$/;

  //we switch over the id of the input to check the value of the input
  switch (id) {
    case 'firstName':
      checkinputvalue(object,text,namePattern);
      break;
    case 'lastName':
      checkinputvalue(object,text,namePattern);
      break;
    case 'email':
      checkinputvalue(object,text,emailPattern);
      break;
    case 'address':
      checkinputvalue(object,text,addressPattern);
      break;
    case 'city':
      checkinputvalue(object,text,cityPattern);
      break;
    case 'state':
      checkinputvalue(object,text,statePattern);
      break;
    case 'zip':
      checkinputvalue(object,text,zipPattern);
      break;
    case 'card-name':
      checkinputvalue(object,text,cardNamePattern);
      break;
    case 'card-number':
      checkinputvalue(object,text,cardNumberPattern);
      break;
    case 'card-cvv':
      checkinputvalue(object,text,cvvPattern);
      break;    
    default:
      break;
  }
}
//function for rendering product in the checkout cart page
function renderCheckoutCart(){
  if (localStorage.getItem("items").length > 0) {
    let products = JSON.parse(localStorage.getItem("items"));
    //calculate total
    let total = 0;
    products.map((product) => {total += product.price * product.quantity;});
    let shipping = $("#shipping").text();
    //save to localstorage
    localStorage.setItem("totalPrice", total.toFixed(2));
    total =total + Number(shipping);
    $("#totalPrice2").text("$"+total.toFixed(2));

      let modalBody = $(".cart-list");
      modalBody.empty(); // empty the initial contents of modal body before adding new items
  
      // render products name, price, and quantity
      products.map((product) => {
        modalBody.append(
          `
              <li class="list-group-item d-flex justify-content-between lh-condensed" id="${product.name}}">
              <div class='d-flex'>
                  <img src="${product.image}" height="30" width="30"/>
                  <h6 class="my-0">${product.name}  
                  <small class="text-muted">x ${product.quantity}</small>
                  </h6>
              </div>
              <span class="text-muted">$${product.price}</span>
              </li>
              `
        );
      });
    }    
}

$("#checkoutForm input[type='text']").on('input',(e) => {
  inputCheck(e.target);
});

// $("#checkoutForm").submit(function(e){
//   formValidation(e);
// });


//for the checkout form submission event:will sent data to firebase database then trigger the modal to show success submission
//the trigger will also clear the localstorage
//the trigger will also trigger email api sender to sent email to the user
//the trigger will also redirect to the shop page
$('#checkoutForm').submit(function(e){
  e.preventDefault();
  let form = $(this);
  if (form[0].checkValidity() === false) 
  {
    e.stopPropagation();
  } 
  else 
  {
    let products = JSON.parse(localStorage.getItem("items"));
    let totalPrice = Number(localStorage.getItem("totalPrice"));
    let totalItem = 0;
    products.map((product) => {
      totalItem += product.quantity;
    });
    let UUID= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //put data in array
    let productsArray = products.map((product) => {
      return {
        "name": product.name,
        "price": product.price,
        "quantity": product.quantity,
        "totalPrice": product.price * product.quantity
      }
    });

    let data = {
      "uuid": ""+UUID,
      "products": products,
      "totalItem": totalItem,
      "totalPrice": totalPrice.toString(),
      "firstName": $("#firstName").val(),
      "lastName": $("#lastName").val(),
      "email": $("#email").val(),
      "address": $("#address").val(),
      "city": $("#city").val(),
      "state": $("#state").val(),
      "zip": $("#zip").val(),
      "same_address": $("#same-address").val(),
      "paymentMethod": $("#paymentMethod").val(),
      "cardname": $("#card-name").val(),
      "cardnumber": $("#card-number").val(),
      "expmonth": $("#expmonth").val(),
      "expyear": $("#expyear").val(),
      "cvv": $("#card-cvv").val()
    };
    const productsRef = db.ref('checkout'+UUID);
    productsRef.set(
      data
    );
    data.products = productsArray;
    //trigger emailler api
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/email",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function(response){
      console.log(response);
      if(response.status == 200){
        localStorage.setItem("items", JSON.stringify([]));
        redirect = true
        $(".modal-body").html(`
        <p>Thank you for your purchase</p>
        <p>you will get email</p>
        `);
        $("#checkoutModal").modal("show");
        renderCheckoutCart();
      }
      else if(response.status == 500){
        $(".modal-body").text("server error in sending");
        redirect = false
        $("#checkoutModal").modal("show");
        renderCheckoutCart();
      }
      },
      error: function(e){
        $(".modal-body").text("error in sending email");
        $("#checkoutModal").modal("show");
        renderCheckoutCart();
        console.log(e);
      }
    });

  }

});


//on document load jquery
$(document).ready(function() {
  // Load the header.html into the header div, once it's loaded execute callback to add class to headerHome div
  $("#header").load("/template/header/header.html");

  // Load shoppingCart.html
  $("#shoppingCart").load("/template/shoppingCart/shoppingCart.html");

  $("#checkoutModal").on('hidden.bs.modal', function () {
    if (redirect == true){
      window.location.href = "/pages/shop/shop.html";      
    }

  });
  //document jquery on every event
  renderCheckoutCart(); 
});