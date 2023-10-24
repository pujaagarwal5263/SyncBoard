const express = require("express")
const router = express.Router();
const controllers = require("../controllers/controllers")

router.get("/",controllers.helloWorld);
router.post("/saveuser",controllers.saveUser)

module.exports = router;