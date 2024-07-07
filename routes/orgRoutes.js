const { Router } = require("express");
const router = Router();
const orgController = require("../controllers/orgController");
const auth = require("../middleware/auth");

router.get("/", auth, orgController.getOrganisations); //get
router.post("/", auth, orgController.createOrganisation); //post (remove create later)
router.get("/:orgId", auth, orgController.getOrganisationById); //get
router.post("/:orgId/users", orgController.addUserToOrganisation); //post

module.exports = router;
