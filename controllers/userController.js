const { userModel } = require("../models/index");

exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: "success",
      message: "User details",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Get user details failed",
      statusCode: 400,
    });
  } //protected, get
};
