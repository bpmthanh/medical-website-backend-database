import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = parseInt(req.query.limit);
  console.log(limit)
  if (!limit) {
    limit = 10;
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

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
};
