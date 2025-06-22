const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//* * Utils and utils */
const { sendEmail } = require("../library/EmailLibrary");
const jwtLibrary = require("../library/jwtLib");
const ErrorResponse = require("../utils/errorResponse");
const {
  userSignupSchema,
  userSignInSchema,
} = require("../utils/validator/user");
const User = require("../models/User");

exports.signUp = async (req, res, next) => {
  try {
    const { error, value } = userSignupSchema.validate(req.body);
    let { firstName, lastName, email, password, role} = value;

    if (error) return next(new ErrorResponse(error, 400));
  
    const userExist = await User.findOne({
     usr_email : email
    });

    if (userExist) {
      return next(new ErrorResponse(`${role === 'admin' ? 'ADMIN': role} ALREADY EXIST`, 409));
    }
    
    const user = await User.create({
      usr_fname: firstName,
      usr_lname: lastName,
      usr_email: email,
      usr_password : password,
      usr_role : role
    });
    console.log('user :', user);

    // ? <--------------- Email Code Here ------------------> //

    const objJwt = { id: user._id, email: user.usr_email };

    const token = await jwtLibrary.jwtSign(objJwt, { expiresIn: false });
    console.log('token :', token);

    const emailCriteria = {
      from: process.env.EMAIL_USER,
      to: user.usr_email,
      subject: "Email Verification",
      html: `<p>Please click on the following link to verify your email address:</p>
      <a href="${process.env.FRONT_URL}/verify-email?token=${token}">
      http://localhost:${process.env.FRONT_URL}/verify-email?token=${token} </a>`,
    };

    const data = await sendEmail(emailCriteria);

    if (data?.code === 200 && data?.status === "success") {
      console.log(data?.message || "Email Sent successfully");
    }

    return res.status(201).send({
      status: "success",
      statusCode: 201,
      message: `${role} create successfully`,
    });
  } catch (error) {
    console.log('error :', error);
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next(new ErrorResponse("Missing token.", 409));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400));
    }

    if (user.usr_email_verified === true) {
      return next(new ErrorResponse("Account Already verified", 400));
    }

    user.usr_email_verified = true;
    await user.save();

    return res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("error :", error);
    if (error?.message === "jwt expired") {
      next(new ErrorResponse("Token expire!", 401));
    }
    next(new ErrorResponse("Unauthorized", 403));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = userSignInSchema.validate(req.body);

    if (error) return next(new ErrorResponse(error, 400));
    const { email, password } = value;
    console.log('password :', password);

    if (!email || !password) {
      return next(
        new ErrorResponse("Please enter valid email and password.", 400)
      );
    }

    const user = await User.findOne({ usr_email : email });

    if (!user) {
      return next(new ErrorResponse("Sorry but this email is not part of our system! Try signing up!", 404));
    }

    // if (user.usr_role !== "user") {
    //   return next(new ErrorResponse("You are not allowd to login here", 401));
    // }

    if (user.usr_email_verified !== true) {
      return next(new ErrorResponse("Please verify your email first.", 401));
    }

    const passwordMatch = await bcrypt.compare(password, user.usr_password);
    console.log('passwordMatch :', passwordMatch);

    if (!passwordMatch) {
      return next(new ErrorResponse("Invalid email and password.", 401));
    }

    const objJwt = { id: user._id, email: user.usr_email };
    const accessToken = await jwtLibrary.jwtSign(objJwt, { expiresIn: false });

    return res.status(200).send({
      // status: "success",
      // statusCode: 200,
      _id: user._id,
      name: user.usr_name,
      email: user.usr_email,
      role: user.usr_role,
      token: accessToken,
    });
  } catch (error) {
  console.log('error :', error);
    next(error);
  }
};
