const doctorService = require("../services/doctorService");

const getDetailsDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getDetailsDoctorById(req.body.id);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: 500,
      errMessage: "Error from the server",
    });
  }
};

module.exports = {
  getDetailsDoctorById: getDetailsDoctorById,
};
