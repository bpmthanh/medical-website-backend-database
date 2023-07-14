import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let getTopDoctorHome = (limitData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // lấy limit thằng, lấy theo createdAt, bỏ trường password
      let res = {};
      let users = await db.User.findAll({
        limit: limitData,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        // raw:true
      });
      res.errCode = 0;
      res.errMessage = "Get data successfully!";
      res.data = users;
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
};
