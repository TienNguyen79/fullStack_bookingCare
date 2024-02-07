const { postUserService } = require("../services/userService");

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

module.exports = { postUserApi };
