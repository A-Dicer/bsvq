const router = require("express").Router();
const dataController = require("../../controllers/dataController");

// --------------------- Matches with "/api/data" --------------------------
// ------------------------------- data ------------------------------------
router.route("/findAll").get(dataController.findAll) // get slide amount
router.route("/findOne").post(dataController.findOne) // get slide amount
router.route("/addFile").post(dataController.addFile) // get slide amount
router.route("/deleteFile").post(dataController.deleteFile) // get slide amount

module.exports = router;
