const { User } = require("../models");
const { validationResult } = require("express-validator");

const UserController = {
  // GET all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // GET a single user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // POST a new user
  createUser: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: "Bad Request" });
    }
  },

  // PUT (update) a user by ID
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: "Bad Request" });
    }
  },

  // DELETE a user by ID
  deleteUser: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndRemove(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: "Bad Request" });
    }
  },

  // Add a friend to a user
  addFriend: async (req, res) => {
    try {
      console.log("req.params.userId", req.params.userId); // Corrected log
      console.log("req.params.friendId", req.params.friendId); // Corrected log

      const userId = req.params.userId;
      const friendId = req.params.friendId;

      //   const userId = mongoose.Types.ObjectId(req.params.userId);
      //   const friendId = mongoose.Types.ObjectId(req.params.friendId);

      // if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      //   res.status(400).json({ message: "Invalid ***** ID format" });
      //   return;
      // }

      // console.log('userId:', userId);
      // console.log('friendId:', friendId);
      const dbUserData = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { friends: friendId } },
        { new: true, runValidators: true }
      );

      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this Id" });
        return;
      }

      res.json(dbUserData);
    } catch (error) {
      res.status(400).json({ message: "Invalid ID format" });
    }
  },
  getUserFriends: async (req, res) => {
    try {
      const userId = req.params.userId;

      // Fetch the user by ID and populate the "friends" field to get the friend details
      const user = await User.findById(userId).populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Extract the friend data from the user's populated "friends" field
      const friends = user.friends;

      res.status(200).json(friends);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};

module.exports = UserController;
