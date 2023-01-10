const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const colors = require("colors");
const { createCanvas, loadImage } = require("canvas");
const { addLayer, width, height } = require("./img/config");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
var bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 4000;

//body parser
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);

app.use(express.static("./dist"));

const saveImage = (_canvas, _edi, toggle) => {
  if (toggle) {
    fs.writeFileSync(`./output/${_edi}.png`, _canvas.toBuffer("image/png"));
  } else {
    let base64Image = _canvas.split(";base64,").pop();
    fs.writeFileSync(`./img/${_edi}.png`, base64Image, { encoding: "base64" });
  }
};
const drawLayer = async (_layer, _edi) => {
  try {
    // console.log(`${_layer.location}${_layer.bodyValues.fileName}.jpg`);

    ctx.clearRect(0, 0, width, height);
    const bodyimg = await loadImage(
      `${_layer.location}${_layer.bodyValues.fileName}.png`
    );
    // console.log(`${_layer.location}${_layer.bodyValues.fileName}.png`);
    ctx.drawImage(
      bodyimg,
      _layer.posittion.x,
      _layer.posittion.y,
      _layer.size.width,
      _layer.size.height
    );
    saveImage(canvas, _edi, true);
  } catch (err) {}
};

app.post("/assets", async (req, res, next) => {
  const bodydt = await req.body;
  // console.log(bodydt, "bodydt===>");
  await saveImage(bodydt.img, "cmg", false);
  // console.log(`${bodydt.bgid}`, "==>", bodydt);
  let arraylayer = [
    addLayer(
      1,
      "img",
      `${bodydt.bgid}`,
      { x: 0, y: 0 },
      { width: width, height: height }
    ),
    addLayer(1, "img", "cmg", { x: 0, y: 0 }, { width: width, height: height }),
  ];
  // console.log(arraylayer, "arraylayer===>");
  await arraylayer.forEach(async (item, i) => await drawLayer(item, 0));
  img = await fs.readFileSync(
    path.join(__dirname + "/output") + "/" + "0.png",
    "base64"
  );
  return res.status(200).json({
    img: `data:image/png;base64,${img}`,
    status: true,
  });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./dist/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`server is listning on port ${PORT}`);
});
process.on("unhandledRejection", (err, promise) => {
  // console.log(`Error:${err.message}`.red);
  server.close(() => process.exit(1));
});
