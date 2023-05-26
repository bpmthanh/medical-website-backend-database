import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./src/public")); // cho phép phía client nó có thể truy cập vào những file nào
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
}

module.exports = configViewEngine;