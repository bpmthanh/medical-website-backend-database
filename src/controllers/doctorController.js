import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = parseInt(req.query.limit);
  if (!limit) {
    limit = 100;
  }
  try {
    let responseDoctors = await doctorService.getTopDoctorHome(limit);
    return res.status(200).json(responseDoctors);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let responseDoctors = await doctorService.getAllDoctors();
    return res.status(200).json(responseDoctors);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};

let postInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailDoctorInfo(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};

let getDetailsDoctor = async (req, res) => {
  try {
    let id = parseInt(req.query.id);
    let response = await doctorService.getDetailsDoctorById(id);
    console.log(response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let response = await doctorService.bulkCreateSchedule(req.body);
    console.log(response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};

let getScheduleDoctorByDate = async (req, res) => {
  try {
    let response = await doctorService.getScheduleDoctorByDate(
      req.query.doctorId,
      req.query.date
    );
    console.log(response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};
let getInfoDoctorById = async (req, res) => {
  try {
    let response = await doctorService.getInfoDoctorById(
      req.query.doctorId,
    );
    console.log(response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInfoDoctor: postInfoDoctor,
  getDetailsDoctor: getDetailsDoctor,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleDoctorByDate: getScheduleDoctorByDate,
  getInfoDoctorById: getInfoDoctorById,
};
