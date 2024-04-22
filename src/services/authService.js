import bcrypt from "bcrypt";
import { raw } from "body-parser";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../commom/token";
import { configs } from "../config/app.config.js";
import sendMail from "../utils/mailer.js";
const db = require("../models");
const Joi = require("joi");
let refreshTokensTemp = [];

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .message("Email không hợp lệ hoặc bị thiếu.")
    .required(),
  password: Joi.string()
    .min(6)
    .max(10)
    .required()
    .messages({
      "string.base": "Mật khẩu phải là một chuỗi.",
      "string.empty": "Mật khẩu không được để trống.",
      "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự.",
      "string.max": "Mật khẩu không được vượt quá {#limit} ký tự.",
      "any.required": "Mật khẩu không được để trống.",
    })
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,10}$"))
    .message("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt, 1 chữ viết hoa"),
});

const registerService = async (data, res) => {
  const validationResult = registerSchema.validate(data);
  console.log("🚀 ~ registerService ~ validationResult:", validationResult);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ error: validationResult.error.details[0].message });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(data.password, salt);

  const user = await db.User.findOne({
    where: { email: data.email },
    raw: true,
  });
  console.log("🚀 ~ registerService ~ user:", user);

  if (user) {
    return res.status(403).json({ ms: "Email đã tồn tại !" });
  }

  let results = await db.User.create({ email: data.email, password: hashed });

  //nếu muốn làm chức năng xác thực mail mới đăng kí được
  // if (results) {
  //   bcrypt
  //     .hash(results.email, parseInt(process.env.BCRYPT_SALT_ROUND))
  //     .then((hashedEmail) => {
  //       console.log(
  //         `${process.env.APP_URL}/verify?email=${results.email}&token=${hashedEmail}`
  //       );
  //       sendMail(
  //         results.email,
  //         "Verify Email",
  //         `<a href="${process.env.APP_URL}/verify?email=${results.email}&token=${hashedEmail}"> Verify </a>`
  //       );
  //     });
  // }
  return res.status(200).json({ ms: "Register successfully!", data: results });
};

const LoginService = async (data, res) => {
  try {
    const user = await db.User.findOne({
      where: { email: data.email },
      raw: true,
    });

    if (!user) {
      return res.status(403).json({ ms: "Wrong email" });
    }
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      return res.status(403).json({ ms: "Wrong password" });
    }
    if (user && validPassword) {
      const { email, roleId, id } = user;
      const payload = { email, roleId, id };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(id);

      refreshTokensTemp.push(refreshToken);

      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //thời gian cookie sống 7d

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "",
        expires: expiryDate,
      });

      const { password, ...rest } = user;
      return res.status(200).json({
        ms: "Login success !",
        user: rest,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    return res.status(500).json(err);
  }
};

const refreshTokenService = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // lấy refreshToken trong cookie xử lý ở login
  console.log("🚀 ~ refreshTokenService ~ refreshToken:", refreshToken);

  if (!refreshToken) return res.status(401).json("You are not authenticated!");

  if (!refreshTokensTemp.includes(refreshToken)) {
    //nếu có refresh token nhưng không phải của mình
    return res.status(403).json("Refresh token is not valid");
  }

  // const dataVerify = jwt.verify(refreshToken, configs.key.public, {
  //   algorithms: "RS256",
  // });

  // key public ở verify
  jwt.verify(refreshToken, configs.key.public, async (err, data) => {
    if (err) {
      console.log(err);
    }

    refreshTokensTemp = refreshTokensTemp.filter(
      (token) => token != refreshToken
    );

    const idUser = data.id;

    const user = await db.User.findOne({
      where: { id: idUser },
      raw: true,
    });

    const { email, roleId, id } = user;
    const payload = { email, roleId, id };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(id);
    refreshTokensTemp.push(newRefreshToken);
    // res.cookie("refreshToken", newRefreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   path: "/",
    //   samsite: "strict",
    // });

    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //thời gian cookie sống 7d

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "",
      expires: expiryDate,
    });
    return res.status(200).json({ accessToken: accessToken });
  });
};

const LogoutService = async (res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json("Logout successfully!");
};

const sendMailService = async (req, res) => {
  try {
    const { email } = req.body;

    // const response = await db.User.findOne({ where: { email: email } });

    bcrypt
      .hash(email, parseInt(process.env.BCRYPT_SALT_ROUND))
      .then((hashedEmail) => {
        console.log(
          `${process.env.APP_URL}/verify?email=${email}&token=${hashedEmail}`
        );

        res.cookie("tokenForgotPass", hashedEmail, {
          httpOnly: true,
          secure: false,
          sameSite: "",
          maxAge: 30000,
        });

        // res.cookie("refreshToken", newRefreshToken, {
        //   httpOnly: true,
        //   secure: false,
        //   sameSite: "",
        //   expires: expiryDate,
        // });

        sendMail(
          email,
          "Xác nhận Email",
          // `<a href="${process.env.APP_URL}/verify?email=${email}&token=${hashedEmail}"> Verify </a>`

          `    <p>Xin Chào,</p>
               <p>Bạn đã yêu cầu thay đổi mật khẩu cho tài khoản của mình.</p>
               <p>Vui lòng nhấn vào liên kết dưới đây để xác nhận thay đổi:</p>
               <p><a  href="${process.env.APP_URL}/verify?email=${email}&token=${hashedEmail}"> Xác Nhận </a></p>
               <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
               <p>Trân trọng,</p>
               <p>Đội ngũ quản trị viên MTSHOP</p>`
        );
        return res.status(200).json("Send Mail successfully !");
      })
      .catch((error) => {
        console.log("🚀 ~ sendMailService ~ error:", error);
        return res.status(500).json({ error: "Internal server error" });
      });
  } catch (error) {
    console.log("🚀 ~ sendMailService ~ error:", error);
  }
};

const verifyEmail = (req, res) => {
  // console.log("🚀 ~ verifyEmail ~ reqemail:", req.query.email);
  // console.log("🚀 ~ verifyEmail ~ reqToken:", req.query.token);
  bcrypt.compare(req.query.email, req.query.token, async (err, result) => {
    if (result == true) {
      const response1 = await db.User.update(
        { email_verified_at: true },
        {
          where: {
            email: req.query.email,
          },
        }
      );
      console.log("🚀 ~ bcrypt.compare ~ response1:", response1);

      return res.status(200).json("OK email đã xác thực");
    } else {
      return res.status(200).json("Not found");
    }
  });
};

const forgotPassService = async (req, res) => {
  const tokenForgotPass = req.cookies.tokenForgotPass;

  console.log("🚀 ~ forgotPassService ~ tokenForgotPass:", tokenForgotPass);
  if (!tokenForgotPass) return res.status(401).json("Token đã hết hạn!");
  const { email, password, token } = req.body;
  try {
    const response = await db.User.findOne({
      where: { email: email },
      raw: true,
    });

    if (response) {
      bcrypt.compare(email, token, async (err, result) => {
        const salt = await bcrypt.genSalt(10);
        const PassHashed = await bcrypt.hash(password, salt);

        if (result == true) {
          await db.User.update(
            { password: PassHashed },
            {
              where: {
                email: email,
              },
            }
          );
          return res.status(200).json("Change Password Successfully!!");
        } else {
          return res.status(200).json("Đừng nghịch linh tinh");
        }
      });
    } else {
      return res.status(401).json("Email is not valid!");
    }
  } catch (error) {
    console.log("🚀 ~ forgotPassService ~ error:", error);
  }
};

module.exports = {
  registerService: registerService,
  LoginService: LoginService,
  refreshTokenService: refreshTokenService,
  LogoutService: LogoutService,
  verifyEmail: verifyEmail,
  sendMailService: sendMailService,
  forgotPassService: forgotPassService,
};
