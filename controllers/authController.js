const { userModel, orgModel } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validateRegistration, validateLogin } = require("../utils/index")

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
        statusCode: 409
      })
    }

    //hashpassword and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone
    });

    //create organisation
    const org = await orgModel.create({
      name: `${firstName}'s Organisation`,
      description: `This is ${firstName}'s organisation`
    });

    //add user to organisation
    await user.addOrganisations(org);

    //generate jwt_token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' })

    //on successful registration
    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        }
      }
    });

  } catch (err) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Registration unsuccessful",
      statusCode: 400
    })
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
    console.log(email, password)

    const user = await userModel.findOne({ where: { email } });
    console.log(user)
    if (user && bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken: token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          }
        }
      });
    }
    return res.status(400).json({
      status: "Bad Request",
      message: "Authentication failed",
      statusCode: 400
    })

  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: "Bad Request",
      message: "Authentication failed",
      statusCode: 400
    })
  }
};
