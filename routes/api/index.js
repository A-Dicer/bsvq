const router      = require("express").Router();
const dataRoutes  = require("./data");

router.use("/data", dataRoutes); // Auth routes

module.exports = router;
