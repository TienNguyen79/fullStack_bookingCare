import db from "../models/index";

const getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    console.log("🚀 ~ getHomePage ~ data:", data);
    return res.render("homepage.ejs", { data: JSON.stringify(data) });
  } catch (error) {
    console.log("🚀 ~ getHomePage ~ error:", error);
  }
};

module.exports = { getHomePage };
