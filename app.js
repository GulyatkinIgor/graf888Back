const express = require("express");
const path = require("path");
const axios = require("axios").default;
var convert = require("xml-js");
const app = express();

var jsonDataKvartus = [];
const people = [
  { firstName: "Elson", lastName: "Correia", info: { age: 24 } },
  { firstName: "John", lastName: "Doe", info: { age: 18 } },
  { firstName: "Jane", lastName: "Doe", info: { age: 34 } },
  { firstName: "Maria", lastName: "Carvalho", info: { age: 22 } },
  { firstName: "Kelly", lastName: "Correia", info: { age: 23 } },
  { firstName: "Don", lastName: "Quichote", info: { age: 39 } },
  { firstName: "Marcus", lastName: "Correia", info: { age: 0 } },
  { firstName: "Bruno", lastName: "Gonzales", info: { age: 25 } },
  { firstName: "Alonzo", lastName: "Correia", info: { age: 44 } },
];

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
    });
};

const getDataKvartus = setInterval(function () {
  getDataApparts();
  console.log("data json", jsonDataKvartus);
}, 6000);

app.get("/api/aparts", (req, res) => {
  res.status(200).json(jsonDataKvartus);
});
app.get("/api/people", (req, res) => {
  res.status(200).json(people);
});

app.use(express.static(path.resolve(__dirname, "web-build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "web-build", "index.html"));
});

app.listen(3000, () => console.log("server has been started..."));
