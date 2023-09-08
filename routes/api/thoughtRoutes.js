const router = require('express').Router();
const {
  createThought,
  getThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
  getReactions,
} = require('../../controllers/thoughtController'); // Import your thought controller functions

// Define routes for thoughts
router.route('/')
  .get(getThoughts) // Get all thoughts
  .post(createThought); // Create a new thought

router.route('/:thoughtId')
  .get(getThoughtById) // Get a specific thought by ID
  .put(updateThought) // Update a thought by ID
  .delete(deleteThought); // Delete a thought by ID

router.route('/:thoughtId/reactions')
  .post(addReaction); // Add a reaction to a thought

router.route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction); // Remove a reaction from a thought

router.route('/:thoughtId/reactions')
  .get(getReactions); // Get reactions for a thought

module.exports = router;
