var bcrypt = require("bcryptjs");
const db = require("../models/index");

const postUserService = async (data) => {
  try {
    let results = await db.User.create({
      email: data.email,
      password: bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)),
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender:
        data.gender === "Male" ? true : data.gender === "FeMale" ? false : null,
      image: data.image,
      roleId: data.roleId,
      positionId: data.positionId,
    });
    return results;
  } catch (error) {
    console.log("🚀 ~ postUserService ~ error:", error);
    return null;
  }
};

module.exports = { postUserService };
