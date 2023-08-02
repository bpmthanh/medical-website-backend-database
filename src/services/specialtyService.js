import db from "../models/index";
require("dotenv").config();

let createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionMarkdown ||
        !data.descriptionHTML
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "Create a new specialty successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item, index) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });

        resolve({
          data,
          errCode: 0,
          errMessage: "Get all specialty successfully!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Get all specialty failure!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailSpecialtyById = (specialtyId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!specialtyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: { id: specialtyId },
          attributes: {
            exclude: ["image", "descriptionMarkdown", "createdAt", "updatedAt"],
          },
          raw: true,
        });
        if (data) {
          let arrDoctorId = [];
          const whereCondition = {
            specialtyId: specialtyId,
          };

          if (location !== null && location !== "" && location !== undefined) {
            whereCondition.provinceId = location;
          }
          let doctorSpecialty = await db.Doctor_Infor.findAll({
            where: whereCondition,
            attributes: ["doctorId", "provinceId"],
          });
          data.arrDoctorId = doctorSpecialty;
          resolve({
            data,
            errCode: 0,
            errMessage: "Get all specialty by id successfully!",
          });
        } else {
          data = {};
          resolve({
            data,
            errCode: -1,
            errMessage: "Specialty is not found!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewSpecialty: createNewSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
};
