const { Schema, model } = require('mongoose');
const Thought = require('./Thought'); // Import the Thought model here


//defining User Schema
const userSchema = new Schema(
  {
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,

        //validator for email address
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },
      thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }],
      friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }],
  },
  {
    toJSON: {
      // TODO: Mongoose will not include virtuals by default, so add a `virtuals` property and set it's value to true
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// virtual method to get total friends count
userSchema.virtual('friendCount').get(function () {
  return `friends: ${this.friends.length}`;
  });

// Add the 'remove' middleware to remove user's thoughts when the user is deleted
// Add the 'remove' middleware to remove user's thoughts and reactions when the user is deleted
userSchema.pre('remove', async function (next) {
  try {
    // Import the Thought and Reaction models here, inside the middleware function
    const Thought = require('./Thought');
    const Reaction = require('./Reaction');

    // Log the execution of the middleware
    console.log('Removing user and associated thoughts and reactions...');

    // Delete user's thoughts
    await Thought.deleteMany({ username: this.username });

    // Delete user's reactions
    await Reaction.deleteMany({ username: this.username });

    // Remove user from their friends' lists (if applicable)
    await User.updateMany(
      { _id: { $in: this.friends } },
      { $pull: { friends: this._id } }
    );

    // Continue with the middleware execution
    next();
  } catch (error) {
    console.error('Error in remove middleware:', error);
    next(error); // Pass the error to the next middleware
  }
});


// Initialize our User model
const User = model('User', userSchema);

//export User Model
module.exports = User;