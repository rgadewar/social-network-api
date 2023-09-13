const mongoose = require('mongoose');
const User = require('./models/User'); // Import your User model here

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/socialnetworkdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const testUser = new User({
  username: 'testuser6',
  email: 'testuser6@example.com',
  thoughts: [], // Add some thoughts if needed
  friends: [], // Add some friends if needed
});

testUser.save()
  .then((user) => {
    // Delete the user using the remove() method to trigger middleware
    return User.deleteOne({ _id: user._id }); // Call remove() method on the user document
  })
  .then(() => {
    console.log('User deleted successfully');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
