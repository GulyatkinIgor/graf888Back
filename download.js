const download = (data, path) => {
  data.map((item) => {
    const itemName = item.Id._text;
    let fs = require("fs");
    // fs.mkdir(path + "\\" + itemName, (err) => {
    //   if (err) throw err; // не удалось создать папку
    //   console.log("Папка ", { itemName }, " успешно создана");
    // });

    const arrayImage = item.Images.Image;
    const isArray = Array.isArray(arrayImage);
    if (isArray === true) {
      const count = arrayImage.length - 1;
      for (var i = 0; i <= count; i++) {
        getImage(arrayImage, path, itemName, i);
        console.log(arrayImage);
      }
    } else if (isArray === false) {
      axios({
        method: "get",
        url: arrayImage._attributes.url,
        responseType: "stream",
      })
        .then(function (response) {
          response.data.pipe(fs.createWriteStream(i + ".jpg"));
          console.log("Загрузка файла:" + filePath);

          arrayImage._attributes.url = path + itemName + 1;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    }
  });
};

getImage = async (arrayImage, path, itemName, i) => {
  await axios({
    method: "get",
    url: arrayImage[i]._attributes.url,
    responseType: "stream",
  })
    .then(function (response) {
      response.data.pipe(
        fs.createWriteStream(path + "\\" + itemName + "\\" + i + ".jpg")
      );
      console.log(
        "Загрузка файла:" + path + "\\" + itemName + "\\" + i + ".jpg"
      );

      //arrayImage[i]._attributes.url = path + itemName + i;
    })
    .catch(function (error) {
      console.log(error);
    });
};
