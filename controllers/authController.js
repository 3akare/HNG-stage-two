const { userModel, orgModel } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validateRegistration, validateLogin } = require("../utils/index");

exports.register = async (req, res) => {
  try {
    // validation of fields
    const { firstName, lastName, email, password, phone } = req.body;
    const errors = validateRegistration(firstName, lastName, email, password);

    if (errors.length > 0) {
      return res.status(422).json({ errors });
    }

    // checking if user exists
    const userExists = await userModel.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({
        status: "Bad Request",
        message: "User already exists",
        statusCode: 409,
      });
    }

    //
    const userId = `${firstName}-${Date.now()}`;

    //hashpassword and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    //create organisation
    const org = await orgModel.create({
      orgId: `${firstName}-org-${Date.now()}`,
      name: `${firstName}'s Organisation`,
      description: `This is ${firstName}'s organisation`,
    });

    //add user to organisation
    await user.addOrganisations(org);

    //generate jwt_token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    //on successful registration
    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "Bad Request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  //validation of fields
  try {
    const { email, password } = req.body;
    const errors = validateLogin(email, password);

    if (errors.length > 0) {
      return res.status(422).json({ errors });
    }

    //find and validate user
    const user = await userModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    //compare password
    const confirmPassword = await bcrypt.compare(password, user.password);

    if (!confirmPassword) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Authentication failed",
        statusCode: 400,
      });
    }

    //generate jwt_token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    //response
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Authentication failed",
      statusCode: 400,
    });
  }
};
