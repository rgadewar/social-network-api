const mongoose = require("mongoose");
const Reaction = require("../models/Reaction"); // Adjust the path to your Reaction model

const reactionData = [
  {
    reactionBody: "Like!",
    username: "user1", // Reference to an existing user
  },
  {
    reactionBody: "Wow!",
    username: "user2", // Reference to an existing user
  },
  // Add more reaction data as needed
];

async function seedReactions() {
  try {
    // Clear existing reactions data (optional)
    // await Reaction.deleteMany({});

    // Seed reactions
    const reactions = await Reaction.insertMany(reactionData, {
      timeout: 30000,
    }); // Increase timeout to 30 seconds

    console.log("Reactions seeded successfully.");
  } catch (error) {
    console.error("Error seeding reactions:", error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
}

// Call the seedReactions function to populate the database with reactions
seedReactions();
