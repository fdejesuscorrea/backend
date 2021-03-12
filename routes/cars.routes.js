const {Router} =require("express");
const router = Router();
const {Car} = require("../data/db");
const {VerifyToken} =require("../middlewares");
const {BillPolicy} =require("../policies");
const {SECRETKEY,CWD} =require("../config");
const jwt =require("jsonwebtoken");
const fs = require("fs");
//
const multer =require("multer");
const path = require("path");
const { Verify } = require("crypto");
const carModel = require("../models/car.model");
let storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./upload');
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '-'+Date.now()+path.extname(file.originalname));
    }
});
const upload = multer({storage});


router.delete("/cars/:id",VerifyToken,async(req,res)=>{
    if(req.params.id.length==0){
        return res.status(401).json({message:"la cadena vacia no es in identificador"});
    }
    const car = await Car.findAll({where:{id:req.params.id}});
    if(!car){
        return res.status(401).json({message:"el id ingresado no existe"});
    }
    await Car.destroy({where:{id:req.params.id}});
    return res.status(200).json({message:"borrao"});
});
router.get("/cars",VerifyToken,async(req,res)=>{
    const cars = await Car.findAll({where:{disabled:false}});
    return res.json({cars:cars});
});
router.put("/cars/:id",upload.single("file"),VerifyToken,async(req,res)=>{
    console.log(req.params.id);
    var car ={};
    var newCarImage;
    if(req.body.licensePlate!=undefined){
        const cara = await Car.findAll({where:{licensePlate:req.body.licensePlate}});
        if(cara[0]!=undefined){ 
            return res.status(401).json({message:"la placa no puede estar ya registrada en el sistema"});
        }
       
    }
    const edittedCar=await Car.findAll({where:{id:req.params.id}});
    const oldImage = edittedCar[0].carImage;
    if(edittedCar.length==0){
        res.status(400).json({message:"este objeto no existe"});
    }
    if(req.file!=undefined){
        newCarImage = req.file.filename;
        const fp = CWD+"upload\\"+oldImage;
        try{
            fs.unlinkSync(fp);
        }catch{
    
        }
    }else{
        newCarImage=oldImage;
    }
    
    for (prop in req.body){
        if(req.body[prop]!=undefined){
            car[prop]=req.body[prop];
        }
    }
    if(car.carModel!=undefined){
        const repairCost=BillPolicy(car.carModel);
        car.repairCost=repairCost;
    }
    car.carImage=newCarImage;
    await Car.update(car,{where:{id:req.params.id}})
    res.status(200).json({message:"actualizao pai"});
    
});
router.post("/cars",upload.single("file"),async(req,res)=>{
    const car = await Car.findAll({where:{licensePlate:req.body.licensePlate}});
    if(car.length!=0){
        console.log(car)
        return res.status(406).json({message:"ya existe un auto con esa placa"})
    }
    var carImage;
    if(req.file!=undefined){
        carImage = req.file.filename;
    }else{
        carImage=" ";
    }
    const {licensePlate,carBrand,carModel,carDetail,repairDetail} = req.body;
    const repairCost = BillPolicy(carModel);
    const disabled = false;
    console.log(licensePlate,carBrand,carModel,carDetail,repairDetail);
    await Car.create({licensePlate,carBrand,carModel,carDetail,repairDetail,carImage,repairCost,disabled});
    return res.status(200).json({message:"tobien pai creao"}); 
});
module.exports=router;