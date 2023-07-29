import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let response = await patientService.postBookAppointment(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};

let postVerifyBookAppointment = async (req, res) => {
  try {
    let response = await patientService.postVerifyBookAppointment(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from sever!",
    });
  }
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
