const nodemailer = require("nodemailer");
const ErrorResponse = require("../utils/errorResponse");

exports.sendEmail = async (emailCriteria) => {

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail(emailCriteria);

    const response = {
      status: "success",
      code: 200,
      message: "Email Sent successfully",
    };
    return response;
  } catch (error) {
    const err = error?.response?.body?.errors || error;
    return new ErrorResponse(err || 'Somthing went wrong', 500);
  }
};
