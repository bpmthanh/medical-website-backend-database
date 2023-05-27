// mỗi lần truy cập vào 1 đường link thì nó sẽ vào đây đầu tiên

import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  return app.use("/", router);
};

module.exports = initWebRoutes;
