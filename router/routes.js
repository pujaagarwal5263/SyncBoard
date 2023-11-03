const express = require("express");
const router = express.Router();
const controllers = require("../controllers/controllers");

router.get("/", controllers.helloWorld);
router.post("/saveuser", controllers.saveUser);
router.post("/create-board", controllers.createBoard);
router.post("/update-board", controllers.updateBoardData);
router.post("/add-participants/:boardId", controllers.addParticipants);
router.get("/board-details/:boardId", controllers.getBoardDetails);
router.post("/delete-board", controllers.deleteBoard);
router.get("/get-my-boards/:userEmail", controllers.getMyBoards);
router.get("/get-participated-board/:userEmail", controllers.participateBoards);
router.post("/save-board-id-tracker", controllers.saveBoardID);
router.post("/remove-board-id", controllers.removeID);
router.get("/validate-boardid/:boardId", controllers.checkValidation);
router.get("/user-has-boards/:userEmail", controllers.userHasBoards);
router.post("/update-board-name", controllers.updateBoardName);

module.exports = router;
