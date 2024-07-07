const { orgModel, userModel } = require("../models");

exports.getOrganisations = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await userModel.findOne({ where: { email } });

    const organisations = await user.getOrganisations();

    return res.status(200).json({
      status: "success",
      message: "User Organisations",
      data: {
        organisations: organisations,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Bad Request",
      message: "Could not get user's organisations",
      statusCode: 400,
    });
  }
  //protected, get
};

exports.createOrganisation = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(422).json({
        errors: [
          {
            field: "name",
            message: "Name is required",
          },
        ],
      });
    }

    const orgId = `organisation-${Date.now()}`;
    const org = await orgModel.create({
      orgId,
      name,
      description,
    });
    return res.status(200).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Client Error",
      statusCode: 400,
    });
  }
};

exports.getOrganisationById = async (req, res) => {
  //protected, get
  try {
    const { orgId } = req.params;

    const org = await orgModel.findOne({ where: { orgId } });

    if (!org) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Organisation Details",
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Could not get organisations",
      statusCode: 400,
    });
  }
};

exports.addUserToOrganisation = async (req, res) => {
  //post
  try {
    const { orgId } = req.params;
    const { userId } = req.body;

    const user = await userModel.findOne({ where: { userId } });
    const org = await orgModel.findOne({ where: { orgId } });

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    if (!org) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    await org.addUser(user);
    res.status(200).json({
      status: "success",
      message: "User added to organization successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Could not add user to organisation",
      statusCode: 400,
    });
  }
};
