const User = require("../models/userSchema");
const Board = require("../models/boardSchema");
const BoardIdTracker = require("../models/BoardIdTrackerSchema");

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

const updateBoard = async (req, res) => {
  try {
    const { boardId, boardName, boardData } = req.body;
    const board = await Board.findOne({ boardId: boardId });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (boardData) board.boardData = boardData;
    if (boardName) board.boardName = boardName;
    await board.save();

    return res.status(200).json({ message: "Board updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

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

    await BoardIdTracker.updateOne({ boardId }, { isValid: false });

    await user.myBoards.pull(board._id);

    await board.deleteOne({ boardId: boardId });
    await user.save();

    res.status(200).json({ message: "Board removed from the user's account" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// const addParticipants = async (req, res) => {
//   try {
//     const boardId = req.params.boardId;
//     const { participants } = req.body;

//     const board = await Board.findOne({ boardId: boardId });
//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     const findUserPromises = participants.map(async (email) => {
//       const user = await User.findOne({ email });
//       return user ? user._id : null;
//     });

//     const userIds = await Promise.all(findUserPromises);
//     const validUserIds = userIds.filter((userId) => userId !== null);
//     board.participants = [...board.participants, ...validUserIds];

//     await board.save();

//     return res.status(200).json({ message: "Participants added successfully" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

const addParticipants = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { participant } = req.body;

    const board = await Board.findOne({ boardId: boardId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const hostId = board.hostID;

    const user = await User.findOne({ email: participant });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user._id.toString() !== hostId.toString() &&
      !board.participants.includes(user._id)
    ) {
      board.participants.push(user._id);
      await board.save();

      user.participatedBoards.push(board._id);
      await user.save();

      return res
        .status(200)
        .json({ message: "Participant added successfully" });
    } else {
      return res
        .status(200)
        .json({ message: "Invalid participant or already added" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getBoardDetails = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findOne({ boardId: boardId });

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

    const myBoards = user.myBoards;

    const populatedList = await Promise.all(
      myBoards.map(async (board) => {
        if (board.participants.length === 0) {
          let boards = {
            ...board._doc,
            oneParticipantName: null,
            remainingCount: null,
          };
          return boards;
        }
        const oneParticipantId = board.participants[0];
        const oneParticipant = await User.findById(oneParticipantId);
        const oneParticipantName = oneParticipant.name;
        let boards = {
          ...board._doc,
          oneParticipantName: oneParticipantName,
          remainingCount: board.participants.length - 1,
        };
        return boards;
      })
    );
    return res.status(200).json(populatedList);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const saveBoardID = async (req, res) => {
  try {
    const { boardId, hostType } = req.body;
    const newTracker = new BoardIdTracker({ boardId, hostType });
    await newTracker.save();
    return res.status(201).json({ message: "Board ID saved successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeID = async (req, res) => {
  try {
    const { boardId } = req.body;
    const tracker = await BoardIdTracker.findOne({ boardId });
    if (tracker) {
      tracker.isValid = false;
      await tracker.save();
      return res.status(200).json({ message: "Board ID marked as invalid" });
    } else {
      return res.status(404).json({ message: "Board ID not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkValidation = async (req, res) => {
  try {
    const { boardId } = req.params;
    const tracker = await BoardIdTracker.findOne({ boardId });
    if (tracker) {
      return res.status(200).json(tracker);
    }
    return res.status(404).json({ message: "Board ID not found" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const participateBoards = async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const user = await User.findOne({ email: userEmail }).populate(
      "participatedBoards"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const participatedBoards = user.participatedBoards;

    const populatedList = await Promise.all(
      participatedBoards.map(async (board) => {
        const host = await User.findById(board.hostID);
        const populatedBoard = {
          ...board._doc,
          hostID: {
            _id: host._id,
            name: host.name,
          },
        };
        return populatedBoard;
      })
    );

    return res.status(200).json(populatedList);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const userHasBoards = async (req, res) => {
  const userEmail = req.params.userEmail;
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const myBoards = user.myBoards;
  if (myBoards.length > 0) {
    return res.status(200).json({ hasBoards: true });
  } else {
    return res.status(200).json({ hasBoards: false });
  }
};

module.exports = {
  helloWorld,
  saveUser,
  createBoard,
  updateBoard,
  addParticipants,
  deleteBoard,
  getBoardDetails,
  getMyBoards,
  saveBoardID,
  removeID,
  checkValidation,
  participateBoards,
  userHasBoards,
};
