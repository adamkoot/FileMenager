var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku
var path = require("path");
var hbs = require("express-handlebars");
var formidable = require("formidable");


app.use(express.static("static"));

var data = [];

var last= [];

app.get("/", function (req, res) {
  res.render("view1.hbs");
});

app.get("/filemenager", function (req, res) {
  res.render("view2.hbs", { context: data });
});


app.get("/info", function (req, res) {
  res.render("view3.hbs", { context: last });
});

app.post("/delete/:index", function (req, res) {
  let index = req.params.index;
  data.splice(index, 1)
  res.redirect("/filemenager");
})

app.post("/download/:index", function (req, res) {
  let index = req.params.index;
  res.download(data[index].path)
})

app.post("/info/:index", function (req, res) {
  let index = req.params.index;
  last = []

  last = data[index]
  last.index = index

  console.log(last)
  res.redirect("/info");
})

app.get("/deleteInfo", function (req, res) {
  data=[];
  res.redirect("/filemenager");
});

app.post("/handleUpload", function (req, res) {
  let form = formidable({});
  form.keepExtensions = true; // zapis z rozszerzeniem pliku
  form.multiples = true;
  form.uploadDir = __dirname + "/static/upload/"; // folder do zapisu zdjęcia

  form.parse(req, function (err, fields, files) {
    console.log("----- przesłane pola z formularza ------");

    console.log(fields);

    console.log("----- przesłane formularzem pliki ------");

    console.log(Object.keys(files.imagetoupload).length);
    try {
      for (let i = 0; i < Object.keys(files.imagetoupload).length; i++) {
        let arr = {
          name: files.imagetoupload[i].name,
          size: files.imagetoupload[i].size,
          type: files.imagetoupload[i].type,
          path: files.imagetoupload[i].path,
          date: Date.now()
        };
        data.push(arr);
        
      }
      console.log(data);
      res.redirect("/");
    } catch {
      let arr = {
        name: files.imagetoupload.name,
        size: files.imagetoupload.size,
        type: files.imagetoupload.type,
        path: files.imagetoupload.path,
        date: Date.now()
      };
      data.push(arr);
      console.log(data);
      res.redirect("/");
    }
    
  });
  
});

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", hbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs");

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
