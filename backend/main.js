const { MailtrapClient } = require("mailtrap");
const express = require("express");
const cors = require('cors');
const fs = require('fs');


var  ENDPOINT;
var TOKEN ;
var client;


function init() {
  //read file config.env as json and get value of ENDPOINT and TOKEN
  //i used config.env file to store the endpoint and token for security reasons
  //i added config.env to .gitignore file so it will not be pushed to github

  fs.readFile('config.env', 'utf8', function (err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    ENDPOINT = obj.ENDPOINT;
    TOKEN = obj.TOKEN;    
    
    client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
  }); 
}

init();

//create express app
//use express.json() to parse incoming requests with JSON payloads
//use cors() to enable CORS with various options:because i used live server or react for a real work project so 
//i need to enable CORS to allow the frontend to access the backend
const app = express();
app.use(express.json());
//in this way it will accept requests from any origin
app.use(cors());


// console.log(client.testing)

//set port and address
let port = 3000;
let address = 'localhost';

//function to send email
//in fact it render sender and recipients as object
function sendEmail(data) {
  const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Store Support",
  };
  const recipients = [
    {
      email: data.email,
    }
  ];
  return {sender, recipients};
}

//mack data for products as the same as the data in the frontend
//because rawg.io api wasn't working
var products = {
  1: {
    id: 1,
    name: "Iphone 12",
    price: 1000,
    image: "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg",
    description : "The iPhone 12 and iPhone 12 mini are part of Apple's 2020 generation of smartphones, offering OLED displays, 5G connectivity, an A14 chip, improved cameras, and MagSafe, all in a new, squared-off design."
  },
  2: {
    id: 2,
    name: "Samsung Galaxy S21",
    price: 900,
    image: "https://t-mobile.scene7.com/is/image/Tmusprod/Samsung-Galaxy-S23-Phantom-Black-frontimage",
    description : "The Samsung Galaxy S21 is a series of Android-based smartphones designed, developed, marketed, and manufactured by Samsung Electronics as part of its Galaxy S series. They collectively serve as the successor to the Galaxy S20 series."
  },
  3: {
    id: 3,
    name: "Google Pixel 5",
    price: 800,
    image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6432/6432256cv13d.jpg;maxHeight=600;maxWidth=600",
    description : "The Google Pixel 5 is a smartphone developed by Google. It was announced on September 30, 2020 as a part of the Pixel 5 series. It serves as the successor to the Pixel 4 and is the first phone in the series to not feature the XL moniker."
  },
  4: {
    id: 4,
    name: "OnePlus 9",
    price: 700,
    image: "https://oasis.opstatics.com/content/dam/oasis/page/2021/9-series/compare/in/compare/9-pro/9pPineGreen.png",
    description : "The OnePlus 9 and 9 Pro are Android-based smartphones manufactured by OnePlus. The OnePlus 9 was announced on 23 March 2021 alongside the OnePlus 9 Pro and OnePlus 9R. The OnePlus 9 series is the successor to the OnePlus 8 series."
  },
};


//the endpoint that will be called when the user click on the buy button
//it will send an email to the user with the details of the order
//using mailtrap API
app.post("/email", (req, res) => {
  let data = req.body;
  //added shipping fee to total
  let shipping = 10;
  total = Number(data.totalPrice) + shipping;

  let cardNumber = data.cardnumber.slice(-4);
  //show only last 4 digit of card number
  cardNumber = "**** **** **** " + cardNumber;
  data = { ...data, total: String(total), cardnumber: cardNumber, };

  let sender = sendEmail(data).sender;
  let recipients = sendEmail(data).recipients;
  client.send({
    from: sender,
    to: recipients,
    template_uuid: "c93ca2f3-9645-4cbb-bf2f-8eb1bb3dce7c",
    template_variables:data
  })
  .then((result) => {
      console.log(result.success);
      if (result.success === true) {
        res.json({ status: "200" });
        console.log("email sent");          
      }
      else {
        res.json({ status: "500" });
        console.log("email not sent");
      }
    }).
    catch((error) => {
      console.log(error);
      res.json({ status: "500" });
    });  
});

//the products endpoint  just send the products data as json
app.get("/products", (req, res) => {   
  res.json(products);
});


app.listen(port,address, () => {
console.log('Server started! At http://'+address +':'+ port);
});
  