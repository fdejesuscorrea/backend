const express = require("express");
const server = express();
const cors = require("cors");
const {PORT} = require("./config");
const {SignRouter,CarsRouter,CarUpRouter} =require("./routes");


require("./data/db");


server.use(cors());
server.use(express.json());

server.use("/api",SignRouter);
server.use("/api",CarsRouter);
server.use("/api/",CarUpRouter);
server.listen(PORT,()=>{
    console.log(`application running on port ${PORT}`);
});