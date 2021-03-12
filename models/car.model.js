const { Sequelize, INTEGER, BOOLEAN} = require("sequelize");

module.exports=(sequelize,type)=>{
    return sequelize.define("car",{
        id:{
            type:INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        licensePlate:{
            type:type.STRING,
            primaryKey:true
        },
        carBrand:{
            type: type.STRING
        },
        carModel:{
            type:type.STRING
        },
        repairCost:{
            type:type.INTEGER
        },
        repairDetail:{
            type:type.STRING
        },
        carDetail:{
            type:type.STRING
        },
        carImage:{
            type:type.STRING
        },
        disabled:{
            type:type.BOOLEAN
        }
    });
};