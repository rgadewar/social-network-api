const { Schema, model } = require('mongoose');
const reactionSchema = require('../models/Reaction');
const moment = require('moment');

//Thought schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 280
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema]
  },
  { 
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// virtual method the get total reaction count
thoughtSchema.virtual('reactionCount').get(function () {
  return `reactions: ${this.reactions.length}`;
  });

  thoughtSchema.pre('remove', async function (next) {
    console.log('Middleware triggered: Thought remove');
    try {
      const Reaction = require('./Reaction');
  
      // Log the execution of the middleware
      console.log('Removing thought and associated reactions...');
  
      // Delete reactions associated with this thought
      await Reaction.deleteMany({ thoughtId: this._id });
  
      // Continue with the middleware execution
      next();
    } catch (error) {
      console.error('Error in thought remove middleware:', error);
      next(error);
    }
  });

// Initialize our Thought model
const Thought = model('Thought', thoughtSchema);

//export Thought model
module.exports = Thought;