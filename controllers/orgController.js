// router.get("/", orgController.getOrganisations);
// router.get("/", orgController.createOrganisation);
// router.get("/:orgId", orgController.getOrganisation);
// router.get("/:orgId/users", orgController.addUserToOrganisation);

exports.getOrganisations = (req, res) => {
  //protected, get
  return res.status(200).send("get all organisation");
};

exports.createOrganisation = (req, res) => {
  //protected, post
  return res.status(200).send("create an organisation ");
};

exports.getOrganisation = (req, res) => {
  //protected, get
  return res.status(200).send("get single organisation by orgId");
};

exports.addUserToOrganisation = (req, res) => {
  //post
  return res.status(200).send("add user to an existing organisation");
};
