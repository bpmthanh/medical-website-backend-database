import express from "express";
import bodyParser from "body-parser"; //giúp ra lấy được các tham số mà clients gửi cho chúng ta
import configViewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
require('dotenv').config();

let app = express();

//config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

configViewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 6969;
//Port === undefined => port = 6969

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is runing on the port : " + port)
})