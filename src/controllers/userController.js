const {
  postUserService,
  getUserService,
  getUserWithParamService,
  updateUserService,
  deleteUserService,
} = require("../services/userService");

const postUserApi = async (req, res) => {
  let data = req.body;

  let results = await postUserService(data);

  if (results) {
    return res
      .status(200)
      .json({ ms: "Post users successfully!", data: results });
  } else {
    return res.status(500).json({ ms: "Post users failed!", data: null });
  }
};

const getUserApi = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);

    let results = await getUserService(limit, page);
    return res
      .status(200)
      .json({ ms: "Get users Successfully!", data: results });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getUserWithParamsApi = async (req, res) => {
  let id = parseInt(req.params.id);
  let results = await getUserWithParamService(id);
  return res.status(200).json({ ms: "Successfully!", data: results });
};

const updateUserApi = async (req, res) => {
  let data = req.body;

  let results = await updateUserService(data);
  if (results) {
    return res.status(200).json({ ms: "Update successfully!" });
  } else {
    return res.status(500).json({ ms: "User does not exist" });
  }
};

const deleteUserApi = async (req, res) => {
  let id = parseInt(req.params.id);
  let results = await deleteUserService(id);
  if (results) {
    return res.status(200).json({ ms: "Successfully!" });
  } else {
    return res.status(500).json({ ms: "Delete User does not exist" });
  }
};

module.exports = {
  postUserApi,
  getUserApi,
  getUserWithParamsApi,
  updateUserApi,
  deleteUserApi,
};
