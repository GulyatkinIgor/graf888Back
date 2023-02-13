const { count } = require("console");
const express = require("express");
const path = require("path");
const axios = require("axios").default;
var convert = require("xml-js");
const app = express();

var jsonDataKvartus = [];
var jsonDataKvartusId = [];
var jsonDataKvartusRent = [];
var jsonDataKvartusSale = [];

var jsonData = [];
var jsonDataId = [];

var dataIsInit = false;

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // // Request methods you wish to allow
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  // );

  // // Request headers you wish to allow
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "X-Requested-With,content-type"
  // );

  // // Set to true if you need the website to include cookies in the requests sent
  // // to the API (e.g. in case you use sessions)
  // res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

getDataApparts = async () => {
  const dataKvartus = axios
    .get("https://base.kvartus.ru/reklama/xml/base/2790/kazned.xml")
    .then(function (response) {
      // handle success
      console.log("data update!");
      const dataJson = JSON.parse(
        convert.xml2json(response.data, {
          compact: true,
          spaces: 2,
        })
      );
      jsonDataKvartus = dataJson.Ads.Ad;
      jsonDataKvartusId = [];
      jsonDataKvartus.map((item) => {
        const id = item.Id._text;
        jsonDataKvartusId.push(id);
      });
    });
};

const getDataKvartus = setInterval(function () {
  getDataApparts();

  if (jsonDataId.length == 0) {
    jsonDataId = jsonDataKvartusId;
    const count = jsonDataId.length - 1;
    for (var i = 0; i <= count; i++) {
      const data = jsonDataKvartus.filter(function (appart) {
        return appart.Id._text == jsonDataId[i];
      });
    }
  }
}, 20000);

// GET request all

app.get("/api/aparts", (req, res) => {
  res.status(200).json(jsonDataKvartus);
});

// GET request RENT

app.get("/api/rent", (req, res) => {
  jsonDataKvartusRent = jsonDataKvartus.filter(function (appart) {
    return appart.OperationType._text == "Сдам";
  });
  res.status(200).json(jsonDataKvartusRent);
});

app.get("/api/rent/flat", (req, res) => {
  const JsonKvartusFlatsRent = jsonDataKvartusRent.filter(function (appart) {
    return appart.Category._text == "Квартиры";
  });
  res.status(200).json(JsonKvartusFlatsRent);
});

app.get("/api/rent/home", (req, res) => {
  const JsonKvartusHomeRent = jsonDataKvartusRent.filter(function (appart) {
    return appart.Category._text == "Дома, дачи, коттеджи";
  });
  res.status(200).json(JsonKvartusHomeRent);
});

app.get("/api/rent/commerce", (req, res) => {
  const JsonKvartusCommerceRent = jsonDataKvartusRent.filter(function (appart) {
    return appart.Category._text == "Коммерческая недвижимость";
  });
  res.status(200).json(JsonKvartusCommerceRent);
});

app.get("/api/rent/garage", (req, res) => {
  const JsonKvartusGarageRent = jsonDataKvartusRent.filter(function (appart) {
    return appart.Category._text == "Гаражи и машиноместа";
  });
  res.status(200).json(JsonKvartusGarageRent);
});

app.get("/api/rent/yard", (req, res) => {
  const JsonKvartusYardRent = jsonDataKvartusRent.filter(function (appart) {
    return appart.Category._text == "Земельные участки";
  });
  res.status(200).json(JsonKvartusYardRent);
});

app.get("/api/rent/room", (req, res) => {
  const JsonKvartusRoomRent = jsonDataKvartusRent.filter(function (appart) {
    return appart.Category._text == "Комнаты";
  });
  res.status(200).json(JsonKvartusRoomRent);
});

//GET request SALE

app.get("/api/sale", (req, res) => {
  jsonDataKvartusSale = jsonDataKvartus.filter(function (appart) {
    return appart.OperationType._text == "Продам";
  });
  res.status(200).json(jsonDataKvartusSale);
});

app.get("/api/sale/flat", (req, res) => {
  const JsonKvartusFlatsSale = jsonDataKvartusSale.filter(function (appart) {
    return appart.Category._text == "Квартиры";
  });
  res.status(200).json(JsonKvartusFlatsSale);
});

app.get("/api/sale/home", (req, res) => {
  const JsonKvartusHomeSale = jsonDataKvartusSale.filter(function (appart) {
    return appart.Category._text == "Дома, дачи, коттеджи";
  });
  res.status(200).json(JsonKvartusHomeSale);
});

app.get("/api/sale/commerce", (req, res) => {
  const JsonKvartusCommerceSale = jsonDataKvartusSale.filter(function (appart) {
    return appart.Category._text == "Коммерческая недвижимость";
  });
  res.status(200).json(JsonKvartusCommerceSale);
});

app.get("/api/sale/garage", (req, res) => {
  const JsonKvartusGarageSale = jsonDataKvartusSale.filter(function (appart) {
    return appart.Category._text == "Гаражи и машиноместа";
  });
  res.status(200).json(JsonKvartusGarageSale);
});

app.get("/api/sale/yard", (req, res) => {
  const JsonKvartusYardSale = jsonDataKvartusSale.filter(function (appart) {
    return appart.Category._text == "Земельные участки";
  });
  res.status(200).json(JsonKvartusYardSale);
});

app.get("/api/sale/room", (req, res) => {
  const JsonKvartusRoomSale = jsonDataKvartusSale.filter(function (appart) {
    return appart.Category._text == "Комнаты";
  });
  res.status(200).json(JsonKvartusRoomSale);
});

app.use(express.static(path.resolve(__dirname, "web-build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "web-build", "index.html"));
});

app.listen(3500, () => console.log("server has been started..."));
