const router = require("express").Router();
const dataController = require("../../controllers/dataController");

// --------------------- Matches with "/api/data" --------------------------
// ------------------------------- data ------------------------------------

router.route("/slideAmt").post(dataController.slideAmt) // get slide amount

module.exports = router;
