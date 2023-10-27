const User = require("../models/userSchema");
const Board = require("../models/boardSchema");

const helloWorld = (req, res) => {
  return res.send("Welcome to syncboard server");
};

const saveUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({ message: "User already saved" });
    }

    const newUser = new User({
      email,
      name,
    });

    await newUser.save();

    return res.status(201).json({ message: "User saved" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createBoard = async (req, res) => {
  try {
    const { boardId, boardName, user } = req.body;
    const userDoc = await User.findOne({ email: user });

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBoard = new Board({
      boardId,
      boardName: boardName || "untitled",
      hostID: userDoc._id,
    });

    await newBoard.save();

    userDoc.myBoards.push(newBoard._id);
    await userDoc.save();

    return res.status(201).json({ message: "Board created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateBoard = async (req, res) => {};

const deleteBoard = async (req, res) => {
  try {
    const { boardId, userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const board = await Board.findOne({ boardId: boardId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.hostID.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. This board doesn't belong to the user.",
      });
    }

    user.myBoards.pull(board._id);

    await board.remove();
    await user.save();

    res.status(200).json({ message: "Board removed from the user's account" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addParticipants = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { participants } = req.body;

    const board = await Board.findOne({ boardId: boardId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const findUserPromises = participants.map(async (email) => {
      const user = await User.findOne({ email });
      return user ? user._id : null;
    });

    const userIds = await Promise.all(findUserPromises);
    const validUserIds = userIds.filter((userId) => userId !== null);
    board.participants = [...board.participants, ...validUserIds];

    await board.save();

    return res.status(200).json({ message: "Participants added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getBoardDetails = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findOne({ boardId: boardId })
      .populate("hostID")
      .populate("participants");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.status(200).json(board);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyBoards = async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const user = await User.findOne({ email: userEmail }).populate("myBoards");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.myBoards);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  helloWorld,
  saveUser,
  createBoard,
  addParticipants,
  deleteBoard,
  getBoardDetails,
  getMyBoards,
};
