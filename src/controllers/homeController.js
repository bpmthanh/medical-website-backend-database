import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("Post crud to sever");
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUsers();
  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let editCRUD = async (req, res) => {
  let userId = req.query.id;
  let userData = await CRUDService.getUserInfoById(userId);
  if ((userId = userData.id)) {
    return res.render("editCRUD.ejs", {
      userData: userData,
    });
  } else {
    return res.send("User not found!");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDService.updateUserData(data);
  return res.render("displayCRUD.ejs", {
    dataTable: allUser,
  });
};

module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  editCRUD: editCRUD,
  putCRUD: putCRUD,
};
