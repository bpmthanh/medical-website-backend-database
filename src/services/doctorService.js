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
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcodes,
            as: "positionData",
            attributes: ["value_en", "value_vi"],
          },
          {
            model: db.Allcodes,
            as: "genderData",
            attributes: ["value_en", "value_vi"],
          },
        ],
        raw: true,
        nest: true,
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

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // lấy limit thằng, lấy theo createdAt, bỏ trường password
      let res = {};
      let users = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
        raw: true,
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

let saveDetailDoctorInfo = (doctorDataDetail) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !doctorDataDetail.doctorId ||
        !doctorDataDetail.contentHTML ||
        !doctorDataDetail.contentMarkdown ||
        !doctorDataDetail.action
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        if (doctorDataDetail.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: doctorDataDetail.contentHTML,
            contentMarkdown: doctorDataDetail.contentMarkdown,
            description: doctorDataDetail.description,
            doctorId: doctorDataDetail.doctorId,
          });
          resolve({
            errCode: 0,
            errMessage: "Create doctor information successfully!",
          });
        } else if (doctorDataDetail.action === "EDIT") {
          let doctorInfo = await db.Markdown.findOne({
            where: { doctorId: doctorDataDetail.doctorId },
          });
          if (doctorInfo) {
            doctorInfo.contentHTML = doctorDataDetail.contentHTML;
            doctorInfo.contentMarkdown = doctorDataDetail.contentMarkdown;
            doctorInfo.description = doctorDataDetail.description;
            await doctorInfo.save();
            resolve({
              errCode: 0,
              errMessage: "Edit the doctor information successfully",
            });
          } else {
            resolve({
              errCode: 1,
              errMessage: "The doctor information is not exist!",
            });
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailsDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let res = {};
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: [
                "description",
                "contentHTML",
                "contentMarkdown",
                "doctorId",
              ],
            },
            {
              model: db.Allcodes,
              as: "positionData",
              attributes: ["value_en", "value_vi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        res.errCode = 0;
        res.errMessage = "Get doctor by id successfully!";
        res.data = data;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailDoctorInfo: saveDetailDoctorInfo,
  getDetailsDoctorById: getDetailsDoctorById,
};
