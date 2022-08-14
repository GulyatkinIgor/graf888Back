const express = require("express");
const path = require("path");
const axios = require("axios").default;
var convert = require("xml-js");
const app = express();

var jsonDataKvartusSort = [];

var JsonKvartusFlats = [];
var JsonKvartusHome = [];
var JsonKvartusCommerce = [];
var JsonKvartusGarage = [];
var JsonKvartusYard = [];
var JsonKvartusRoom = [];
//var JsonKvartusNovostroiki = [];

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
        convert.xml2json(response.data, { compact: true, spaces: 2 })
      );
      jsonDataKvartus = dataJson.Ads.Ad;

      JsonKvartusFlats = jsonDataKvartus.filter(function (appart) {
        return appart.Category._text == "Квартиры";
      });

      JsonKvartusHome = jsonDataKvartus.filter(function (appart) {
        return appart.Category._text == "Дома, дачи, коттеджи";
      });

      JsonKvartusCommerce = jsonDataKvartus.filter(function (appart) {
        return appart.Category._text == "Коммерческая недвижимость";
      });

      JsonKvartusGarage = jsonDataKvartus.filter(function (appart) {
        return appart.Category._text == "Гаражи и машиноместа";
      });

      JsonKvartusYard = jsonDataKvartus.filter(function (appart) {
        return appart.Category._text == "Земельные участки";
      });

      JsonKvartusRoom = jsonDataKvartus.filter(function (appart) {
        return appart.Category._text == "Комнаты";
      });
    });

  // JsonKvartusNovostroiki = jsonDataKvartus.filter(function (appart) {
  //   return appart.MarketType._text == "Новостройка";
  // });
};

const getDataKvartus = setInterval(function () {
  getDataApparts();
  //console.log("data json", jsonDataKvartus);
}, 6000);

app.get("/api/aparts", (req, res) => {
  res.status(200).json(jsonDataKvartus);
});

app.get("/api/flats", (req, res) => {
  res.status(200).json(JsonKvartusFlats);
});

app.get("/api/home", (req, res) => {
  res.status(200).json(JsonKvartusHome);
});

app.get("/api/commerce", (req, res) => {
  res.status(200).json(JsonKvartusCommerce);
});

app.get("/api/garage", (req, res) => {
  res.status(200).json(JsonKvartusGarage);
});

app.get("/api/yards", (req, res) => {
  res.status(200).json(JsonKvartusYard);
});

app.get("/api/room", (req, res) => {
  res.status(200).json(JsonKvartusRoom);
});

// app.get("/api/novostroika", (req, res) => {
//   res.status(200).json(JsonKvartusNovostroiki);
// });

app.use(express.static(path.resolve(__dirname, "web-build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "web-build", "index.html"));
});

app.listen(3000, () => console.log("server has been started..."));
