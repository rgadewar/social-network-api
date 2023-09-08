const { Thought, User } = require('../models');

const thoughtController = {
  // Create a new thought
  createThought: async (req, res) => {
    try {
      const { thoughtText, username } = req.body;
      const newThought = await Thought.create({ thoughtText, username });
      await User.findOneAndUpdate(
        { username },
        { $push: { thoughts: newThought._id } },
        { new: true }
      );
      res.status(201).json(newThought);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Bad Request' });
    }
  },

  // Retrieve all thoughts
  getThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 });
      res.status(200).json(thoughts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  // Retrieve a specific thought by its ID
  getThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      res.status(200).json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  // Update a thought by its ID
  updateThought: async (req, res) => {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { thoughtText: req.body.thoughtText },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      res.status(200).json(updatedThought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  // Delete a thought by its ID
  deleteThought: async (req, res) => {
    try {
      const deletedThought = await Thought.findByIdAndRemove(req.params.thoughtId);
      if (!deletedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      // Remove the thought from the associated user's thoughts array
      await User.findOneAndUpdate(
        { username: deletedThought.username },
        { $pull: { thoughts: req.params.thoughtId } }
      );
      res.status(200).json(deletedThought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  // Add a reaction to a thought by its ID
  addReaction: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      res.status(200).json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  // Remove a reaction from a thought by its ID and reaction ID
  removeReaction: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      res.status(200).json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  // Get reactions for a thought by thought ID
  getReactions: async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId;

      // Use Mongoose to find the thought by ID and populate the "reactions" field to get the reaction details
      const thought = await Thought.findById(thoughtId).populate('reactions');

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      // Extract the reaction data from the thought's populated "reactions" field
      const reactions = thought.reactions;

      res.status(200).json(reactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};

module.exports = thoughtController;
