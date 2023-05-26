// mỗi lần truy cập vào 1 đường link thì nó sẽ vào đây đầu tiên

import express from "express";
import homeController from "../controllers/homeController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    return app.use("/", router);
}

module.exports = initWebRoutes;