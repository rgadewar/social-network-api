const router = require('express').Router();
const UserController = require('../../controllers/userController');

// GET all users
router.get('/', UserController.getAllUsers);

// GET a single user by ID
router.get('/:id', UserController.getUserById);

// POST a new user
router.post('/', UserController.createUser);

// PUT (update) a user by ID
router.put('/:id', UserController.updateUser);

// DELETE a user by ID
router.delete('/:id', UserController.deleteSingleUser);

// Add a new route to add a friend to a user by their IDs
router.post('/:userId/friends/:friendId', UserController.addFriend);

// Add a new route to add a friend to a user by their IDs
router.delete('/:userId/friends/:friendId', UserController.deleteFriend);

// Add a new route to get a user's friends by ID
router.get('/:userId/friends', UserController.getUserFriends);

module.exports = router;
