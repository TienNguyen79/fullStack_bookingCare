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

const getUserService = async (limit = 10, page) => {
  console.log("🚀 ~ getUserService ~ data:", limit);

  try {
    let results = null;

    if (limit && page) {
      let offset = (page - 1) * limit;
      results = await db.User.findAll({ offset: offset, limit: limit });

      let totalPage = await db.User.findAll();

      results = { results, totalPage: totalPage.length, perPage: limit };
    } else {
      results = await db.User.findAll({ raw: true }); //raw: true để format về kiểu array object
    }

    console.log("🚀 ~ getUserService ~ results:", results);
    return results;
  } catch (error) {
    console.log("🚀 ~ postUserService ~ error:", error);
    return null;
  }
};

const getUserWithParamService = async (id) => {
  try {
    let results = await db.User.findOne({ where: { id: id } });
    return results;
  } catch (error) {
    console.log("🚀 ~ getUserWithParamService ~ error:", error);
    return null;
  }
};

const updateUserService = async (data) => {
  const {
    id,
    email,
    password,
    firstName,
    lastName,
    address,
    phoneNumber,
    gender,
    image,
    roleId,
    positionId,
  } = data;
  try {
    let results = null;
    let findUser = await db.User.findOne({ where: { id: id } });

    if (findUser) {
      results = await db.User.update(
        {
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          firstName,
          lastName,
          address,
          phoneNumber,
          gender,
          image,
          roleId,
          positionId,
        },
        {
          where: {
            id: id,
          },
        }
      );
    } else {
      results = null;
    }

    return results;
  } catch (error) {
    console.log("🚀 ~ updateUserService ~ error:", error);
  }
};

const deleteUserService = async (id) => {
  try {
    let results = await db.User.destroy({ where: { id: id } }); //force: true nếu muốn xóa mất luôn
    return results;
  } catch (error) {
    console.log("🚀 ~ deleteUserService ~ error:", error);
  }
};
module.exports = {
  postUserService,
  getUserService,
  getUserWithParamService,
  updateUserService,
  deleteUserService,
};
