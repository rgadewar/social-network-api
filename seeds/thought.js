const mongoose = require('mongoose');
const Thought = require('../models/Thought'); // Adjust the path to your Thought model

const thoughtData = [
  {
    thoughtText: 'This is a sample thought 1.',
    username: 'user1', // Reference to an existing user
  },
  {
    thoughtText: 'Another thought here 2.',
    username: 'user2', // Reference to an existing user
  },
  // Add more thought data as needed
];

async function seedThoughts() {
  try {
    // Clear existing thoughts data (optional)
    await Thought.deleteMany({});

    // Seed thoughts
    const thoughts = await Thought.insertMany(thoughtData);

    console.log('Thoughts seeded successfully.');
  } catch (error) {
    console.error('Error seeding thoughts:', error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
}

// Call the seedThoughts function to populate the database with thoughts
seedThoughts();
