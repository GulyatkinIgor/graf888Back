const express = require("express");
const path = require("path");
const axios = require("axios").default;
var convert = require("xml-js");
const app = express();

var jsonDataKvartus = [];

getDataApparts = async () => {
  const dataKvartus = axios
    .get("https://base.kvartus.ru/reklama/xml/base/2790/kazned.xml")
    .then(function (response) {
      // handle success
      console.log("data update!");
      const dataJson = JSON.parse(
        convert.xml2json(response.data, { compact: true, spaces: 2 })
      );
      jsonDataKvartus = dataJson;
    });
};

const getDataKvartus = setInterval(function () {
  getDataApparts();
  console.log("data json", jsonDataKvartus);
}, 6000);

app.get("/api/aparts", (req, res) => {
  res.status(200).json(jsonDataKvartus);
});

app.use(express.static(path.resolve(__dirname, "web-build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "web-build", "index.html"));
});

app.listen(3000, () => console.log("server has been started..."));
