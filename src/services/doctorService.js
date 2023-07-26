import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();
import _ from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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
  console.log(doctorDataDetail);
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !doctorDataDetail.doctorId ||
        !doctorDataDetail.contentHTML ||
        !doctorDataDetail.contentMarkdown ||
        !doctorDataDetail.action ||
        !doctorDataDetail.selectedPrice ||
        !doctorDataDetail.selectedPayment ||
        !doctorDataDetail.selectedProvince ||
        !doctorDataDetail.nameClinic ||
        !doctorDataDetail.addressClinic ||
        !doctorDataDetail.note
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

        let doctorMoreInfo = await db.Doctor_Infor.findOne({
          where: { doctorId: doctorDataDetail.doctorId },
        });
        if (doctorMoreInfo) {
          doctorMoreInfo.priceId = doctorDataDetail.selectedPrice;
          doctorMoreInfo.paymentId = doctorDataDetail.selectedPayment;
          doctorMoreInfo.provinceId = doctorDataDetail.selectedProvince;
          doctorMoreInfo.nameClinic = doctorDataDetail.nameClinic;
          doctorMoreInfo.addressClinic = doctorDataDetail.addressClinic;
          doctorMoreInfo.note = doctorDataDetail.note;
          await doctorMoreInfo.save();
          resolve({
            errCode: 0,
            errMessage: "Edit the doctor information successfully",
          });
        } else {
          await db.Doctor_Infor.create({
            priceId: doctorDataDetail.selectedPrice,
            paymentId: doctorDataDetail.selectedPayment,
            provinceId: doctorDataDetail.selectedProvince,
            nameClinic: doctorDataDetail.nameClinic,
            addressClinic: doctorDataDetail.addressClinic,
            note: doctorDataDetail.note,
            doctorId: doctorDataDetail.doctorId,
          });
          resolve({
            errCode: 0,
            errMessage: "Create doctor information successfully!",
          });
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
            {
              model: db.Doctor_Infor,
              include: [
                {
                  model: db.Allcodes,
                  as: "provinceTypeData",
                  attributes: ["value_en", "value_vi", "keyMap"],
                },
                {
                  model: db.Allcodes,
                  as: "priceTypeData",
                  attributes: ["value_en", "value_vi", "keyMap"],
                },
                {
                  model: db.Allcodes,
                  as: "paymentTypeData",
                  attributes: ["value_en", "value_vi", "keyMap"],
                },
              ],
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

let getScheduleDoctorByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let res = {};
        let data = await db.Schedule.findAll({
          where: {
            doctorId,
            date,
          },
          include: [
            {
              model: db.Allcodes,
              as: "timeTypeData",
              attributes: ["value_en", "value_vi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) {
          data = [];
          res.errCode = -1;
          res.errMessage = "Can't find doctor's appointment";
          res.data = data;
          resolve(res);
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

let getInfoDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let res = {};
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId,
          },
          include: [
            {
              model: db.Allcodes,
              as: "provinceTypeData",
              attributes: ["value_en", "value_vi", "keyMap"],
            },
            {
              model: db.Allcodes,
              as: "priceTypeData",
              attributes: ["value_en", "value_vi", "keyMap"],
            },
            {
              model: db.Allcodes,
              as: "paymentTypeData",
              attributes: ["value_en", "value_vi", "keyMap"],
            },
          ]
        });
        if (!data) {
          data = [];
          res.errCode = -1;
          res.errMessage = "Can't find doctor's information";
          res.data = data;
          resolve(res);
        }
        res.errCode = 0;
        res.errMessage = "Get doctor information successfully!";
        res.data = data;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let schedule;
        if (data.arrSchedule && data.arrSchedule.length > 0) {
          schedule = data.arrSchedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        let existingSchedule = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        let toCreate = _.differenceWith(schedule, existingSchedule, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          errMessage: "Post data successfully!",
          data: schedule,
        });
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
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleDoctorByDate: getScheduleDoctorByDate,
  getInfoDoctorById: getInfoDoctorById,
};
