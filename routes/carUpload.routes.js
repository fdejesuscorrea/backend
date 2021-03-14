const { BillPolicy } = require("../policies");
const { Car } = require("../data/db");
const { Router } = require("express");
const VerifyToken = require("../middlewares/authorize.middleware");
const router = Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Verify } = require("crypto");
const { CWD } = require("../config");
const xlsxFile = require("read-excel-file/node");
var inputPlates = [];
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./excel");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
router.post("/upload", VerifyToken, upload.single("excel"), async(req, res) => {
  
  await Car.update({disabled:true},{where:{}});
  console.log("justo ahora se va a tratar de abrir el archivo");
  xlsxFile(path.join(__dirname, "/../excel/excel.xlsx"))
    .then((rows) => {
      rows.slice(1).forEach(async (row) => {
        const licensePlate = row[0];
        if (licensePlate == null) {
          return;
        }
        inputPlates.push(licensePlate);
        const carModel = row[1];
        const carBrand = row[2];
        const carDetail = row[3];
        const repairDetail = row[4];
        var cari = {};
        const car = await Car.findAll({
          where: { licensePlate: licensePlate },
        });
        if (car.length == 0) {
          const repairCost = BillPolicy(carModel);
          await Car.create({
            licensePlate,
            carBrand,
            carModel,
            carDetail,
            repairDetail,
            repairCost,
            disabled: false,
            carImage: "",
          });
        } else {
          cari.licensePlate = licensePlate;
          if (carBrand != null) {
            cari.carBrand = carBrand;
          }
          if (carDetail != null) {
            cari.carDetail = carDetail;
          }
          if (repairDetail != null) {
            cari.repairDetail = repairDetail;
          }
          if (carModel != null) {
            cari.carModel = carModel;
            cari.repairCost = BillPolicy(carModel);
          }
          cari.disabled=false;
          await Car.update(cari, { where: { licensePlate: licensePlate } }).catch();
        }
      });
      try{
        fs.unlinkSync(path.join(__dirname+ "/../excel/excel.xlsx"));
      }catch{

      }
      return res.status(200).json({message:"cargao"});

    })
    .catch(console.log);
    
}

);

module.exports = router;
