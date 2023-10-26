const express = require("express")
const router = express.Router();
const controllers = require("../controllers/controllers")

router.get("/",controllers.helloWorld);
router.post("/saveuser",controllers.saveUser);
router.post("/create-board",controllers.createBoard);
router.post("/add-participants/:boardId",controllers.addParticipants);
router.get("/board-details",controllers.getBoardDetails);
router.post("/delete-board",controllers.deleteBoard)

module.exports = router;