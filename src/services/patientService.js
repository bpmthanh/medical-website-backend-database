import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();
import _ from "lodash";
import emailService from "../services/emailService";
import { v4 as uuidv4 } from "uuid";
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

let buildURLEmail = (doctorId, token) => {
  let result = `${process.env.REACT_APP_BACKEND_URL}/api/patient-verify-book-appointment?token=${token}&doctorId=${doctorId}`;
  return result;
};
let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.timeType || !data.date) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let res = {};
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });

        //create a booking record
        if (user && user[0]) {
          let token = uuidv4();
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
          await emailService.sendASimpleEmail({
            name: data.fullName,
            email: data.email,
            appointmentTime: data.timeString,
            infoDoctor: data.infoDoctor,
            language: data.language,
            reason: data.reason,
            phoneNumber: data.phoneNumber,
            address: data.address,
            redirectLink: buildURLEmail(data.doctorId,token),
          });
          res.errCode = 0;
          res.errMessage = "Save patient booking successfully!";
          resolve(res);
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let res = {};
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if(appointment){
          appointment.statusId="S2"
          await appointment.save()
          res.data = appointment;
          res.errCode = 0;
          res.errMessage = "Verify patient booking successfully!";
          resolve(res);
        }
        else{
          res.errCode = 2;
          res.errMessage = "Users can only verify once!";
          resolve(res);
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
