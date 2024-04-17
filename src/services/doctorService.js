const { where } = require("sequelize");
const db = require("../models");

const getDetailsDoctorById = async (inputId) => {
  console.log("🚀 ~ getDetailsDoctorById ~ inputId:", inputId);
  try {
    if (!inputId) {
      return { errCode: 403, errMessage: "Missing require parameters" };
    } else {
      let data = await db.User.findOne({
        where: { id: inputId },

        attributes: {
          exclude: ["password", "image"], //bỏ field này đi
        },
        include: [{ model: db.Markdown }], //lấy hết markdown
        raw: true,
        nest: true, // khi trả ra api nó sẽ nhìn clean .. nằm trong {}
      });

      return { errCode: 0, data: data };
    }
  } catch (error) {}
};

module.exports = {
  getDetailsDoctorById: getDetailsDoctorById,
};
