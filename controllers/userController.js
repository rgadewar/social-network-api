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
  // DELETE a user by ID
deleteSingleUser: async (req, res) => {
  try {
    const { params } = req;
    console.log('Starting user deletion process...');
    
    // Find the user by ID
    const user = await User.findById(req.params.id);
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "No user found with this id" });
    }

    // Delete the user to trigger the middleware
    await User.deleteOne({ _id: user._id });
    console.log('User deleted:', user);

    res.json({ message: "Successfully deleted user, associated friend(s), and associated thought(s)" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
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
  // DELETE a friend from a user by user ID and friend ID
deleteFriend: async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "No user found with this ID" });
    }

    // Check if the friendId exists in the user's friends list
    const friendIndex = user.friends.indexOf(friendId);
    if (friendIndex === -1) {
      return res.status(404).json({ message: "Friend not found in user's friend list" });
    }

    // Remove the friend from the user's friends list
    user.friends.splice(friendIndex, 1);
    await user.save();

    res.json({ message: "Successfully deleted friend from user's friend list" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
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
