const { Router } = require("express");
const router = Router();
const orgController = require("../controllers/orgController");

router.get("/", orgController.getOrganisations); //get
router.get("/", orgController.createOrganisation); //post
router.get("/:orgId", orgController.getOrganisation); //get
router.get("/:orgId/users", orgController.addUserToOrganisation); //post

module.exports = router;
