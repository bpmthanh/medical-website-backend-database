import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });

        if (user) {
          let check = await bcrypt.compareSync(password, user.password); // true
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "User true password!";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "User wrong password!";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User not found!";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your's email is not exist in our system. Please try other email!`;
      }
      resolve(userData);
    } catch (err) {
      reject(e);
    }
  });
};

let checkUserEmail = (emailData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email: emailData } });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = "";
      if (userId == "All") {
        user = await db.User.findAll({
          attributes: { exclude: ["password"] },
          raw: true,
        });
      }
      if (userId && userId !== "All") {
        user = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
          raw: true,
        });
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email is exist ??
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Email is already exist, please try other email",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phone,
          gender: data.gender,
          roleId: data.role,
          positionId: data.position,
          image: data.avatar,
        });
        resolve({
          errCode: 0,
          errMessage: "Create a new user successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        resolve({
          errCode: 1,
          errMessage: "The user is not exist!",
        });
      } else {
        await user.destroy();
        resolve({
          errCode: 0,
          errMessage: "Delete the user successfully!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.role || !data.position) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phone;
        user.gender = data.gender;
        user.positionId = data.position;
        user.roleId = data.role;
        user.image = data.avatar;
        await user.save();
        resolve({
          errCode: 0,
          errMessage: "Edit the user successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "The user is not exist!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = {};
      let allCode = await db.Allcodes.findAll({
        where: { type: typeInput },
      });
      res.errCode = 0;
      res.errMessage = "Successfully loaded all";
      res.data = allCode;
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  editUser: editUser,
  getAllCodeService: getAllCodeService,
};
