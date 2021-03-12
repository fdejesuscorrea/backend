const Sequelize = require("sequelize");
const{user,dbName,password,connectionConfig}=require(".");
const {carModel,userModel}=require("../models");

const sequelize = new Sequelize(dbName,user,password,connectionConfig);
const Car = carModel(sequelize,Sequelize);
const User = userModel(sequelize,Sequelize);
sequelize.sync({force:false});
module.exports={
    Car,User
}