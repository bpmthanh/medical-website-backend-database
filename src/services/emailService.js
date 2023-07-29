require("dotenv").config();
const nodemailer = require("nodemailer");

const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
const EMAIL_APP = process.env.EMAIL_APP;

let getBodyHTMLLanguage = (data) => {
  let htmlContent;
  if (data.language === "vi") {
    const confirmationLink = data.redirectLink
    htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Xác nhận đặt lịch khám</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid #ccc;
    }
    h1 {
      color: #007BFF;
      margin-bottom: 20px;
    }
    h3 {
      color: #4CAF50;
      margin-top: 30px;
      border-bottom: 2px solid #4CAF50;
      padding-bottom: 5px;
    }
    ul {
      padding: 0;
      list-style-type: none;
    }
    li {
      margin-bottom: 10px;
    }
    a {
      color: #007BFF;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .confirmation-link {
      background-color: #FFF8AE;
      color: #000;
      padding: 10px 15px;
      display: inline-block;
      border-radius: 4px;
      margin-top: 10px;
      text-decoration: none;
    }
    .confirmation-link:hover {
      background-color: #FFE15E;
    }
    p.footer {
      margin-top: 30px;
      text-align: center;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Xác nhận đặt lịch khám</h1>
    <p>Xin chào ${data.name},</p>
    <p>Cảm ơn bạn đã đặt lịch khám với chúng tôi.</p>
    <h3>Thông tin đặt lịch:</h3>
    <ul>
      <li><strong>Tên:</strong> ${data.name}</li>
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Số điện thoại:</strong> ${data.phoneNumber}</li>
      <li><strong>Điạ chỉ:</strong> ${data.address}</li>
      <li><strong>Thời gian hẹn:</strong> <span style="color:red;font-style: italic;">${data.appointmentTime}</span></li>
      <li><strong>Giá khám:</strong> <span style="color:red;font-style: italic;">${data.infoDoctor.price}</span></li>
      <li><strong>Lý do khám bệnh:</strong> ${data.reason}</li>
    </ul>
    <h3>Thông tin Bác sĩ:</h3>
    <ul>
      <li><strong>Tên bác sĩ:</strong> ${data.infoDoctor.fullName}</li>
      <li><strong>Kinh nghiệm làm việc:</strong> ${data.infoDoctor.experiment}</li>
    </ul>
    <br>
    <br>
    <p>Xin vui lòng giữ lại email này làm phiếu xác nhận.</p>
    <p>Hãy nhấp vào liên kết sau để xác nhận đặt lịch:</p>
    <a class="confirmation-link" href="${confirmationLink}">Nhấn vào để xác nhận</a>
    <p>Nếu bạn không thực hiện đăng ký này, hãy bỏ qua email này.</p>
    <p class="footer">Trân trọng,<br>Booking care</p>
  </div>
</body>
</html>
`;
  } else {
    const confirmationLink = data.redirectLink
    htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Appointment Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid #ccc;
    }
    h1 {
      color: #007BFF;
      margin-bottom: 20px;
    }
    h3 {
      color: #4CAF50;
      margin-top: 30px;
      border-bottom: 2px solid #4CAF50;
      padding-bottom: 5px;
    }
    ul {
      padding: 0;
      list-style-type: none;
    }
    li {
      margin-bottom: 10px;
    }
    a {
      color: #007BFF;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .confirmation-link {
      background-color: #FFF8AE;
      color: #000;
      padding: 10px 15px;
      display: inline-block;
      border-radius: 4px;
      margin-top: 10px;
      text-decoration: none;
    }
    .confirmation-link:hover {
      background-color: #FFE15E;
    }
    p.footer {
      margin-top: 30px;
      text-align: center;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Appointment confirmation</h1>
    <p>Hello ${data.name},</p>
    <p>Thank you for booking an appointment with us.</p>
    <h3>Appointment information:</h3>
    <ul>
      <li><strong>Name:</strong> ${data.name}</li>
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Phone number:</strong> ${data.phoneNumber}</li>
      <li><strong>Address:</strong> ${data.address}</li>
      <li><strong>Appointment time:</strong> <span style="color:red;font-style: italic;">${data.appointmentTime}</span></li>
      <li><strong>Appointment price:</strong> <span style="color:red;font-style: italic;">${data.infoDoctor.price}</span></li>
      <li><strong>Reason for medical examination:</strong> ${data.reason}</li>
    </ul>
    <h3>Doctor information:</h3>
    <ul>
      <li><strong>Doctor's name:</strong> ${data.infoDoctor.fullName}</li>
      <li><strong>Experience:</strong> ${data.infoDoctor.experiment}</li>
    </ul>
    <br>
    <br>
    <p>Please keep this email as your appointment confirmation.</p>
    <p>Click the link below to confirm your appointment:</p>
    <a class="confirmation-link" href="${confirmationLink}">Click here to confirm</a>
    <p>If you did not make this booking, please ignore this email.</p>
    <p class="footer">Best regards,<br>Booking care</p>
  </div>
</body>
</html>
`;
  }
  return htmlContent;
};

let sendASimpleEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_APP,
      pass: EMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: 'Booking care" <ltvphuoctien@gmail.com>',
    to: data.email,
    subject: "Xác nhận đặt lịch",
    html: getBodyHTMLLanguage(data),
  });
};

module.exports = {
  sendASimpleEmail: sendASimpleEmail,
};
