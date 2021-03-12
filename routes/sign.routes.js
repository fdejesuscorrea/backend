const {Router} = require("express");
const router = Router();
const {User} =require("../data/db");
const {SECRETKEY} =require("../config");
const jwt = require("jsonwebtoken");
router.post("/signin",async(req,res)=>{
    const {email,password} = req.body;
    if(email==""){
        res.status(401).json({message:"ingrese un correo electronico"});
    }
    if(password==""){
        res.status(401).json({message:"ingrese una contraseña"});
    }
    const user = await User.findAll({where:{email:email}});
    console.log(user.length);
    if(user.length===0){
        return res.status(401).json({message:"El email ingresado no tiene una cuenta asociada"});
    }
    if(password==user[0].password){
        const token = jwt.sign({__id:req.body.email},SECRETKEY);
        return res.status(200).json({token});
    }else{
        return res.status(401).json({message:"contraseña incorrecta"});

    }
});
router.post("/signup", async(req,res)=>{
    let usr = await User.findAll({where:{email:req.body.email}});
    console.log(usr.length);
    if(req.body.email==""||req.body.password==""){
        return res.status(401).json({message:"no se puede registrar un usuario sin credenciales"});
    }
    if(usr.length===0){
        await User.create({email:req.body.email,password:req.body.password}).then(console.log("tolis"));
        const token = jwt.sign({__id:req.body.email},SECRETKEY);
        return res.status(200).json({token});
    }else{
        return res.status(406).json({message:`el correo electrónico ${req.body.email} ya existe en la base de datos`});
    }

 });
module.exports=router;