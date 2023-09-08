const connection = require("../config/connection");
const User = require("../models/User");
const Thought = require("../models/Thought");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  try {
    // Drop existing thoughts and users (if needed)
    await Thought.deleteMany({});
    await User.deleteMany({});

    // Create an array of users
    const users = [
      {
        username: "abcd",
        email: "abcd@hotmail.com",
      },
      {
        username: "john",
        email: "john@gmail.com",
      },
    ];

    // Create an array of thoughts
    const thoughts = [
      {
        thoughtText: "Many, many moons ago...",
        username: "Steve",
      },
      {
        thoughtText: "How many times must I ...",
        username: "Linda",
      },
    ];

    // Insert users into the User collection
    const insertedUsers = await User.insertMany(users);

    

    console.table(insertedUsers);
    // Log out the user data in a table format
    console.table(
        insertedUsers.map((user) => ({
        username: user.username,
        email: user.email,
        _id: user._id,
        }))
    );
    // Insert thoughts into the Thought collection
const insertedThoughts = await Thought.insertMany(thoughts);

// Log out the thought data in a table format
console.table(
  insertedThoughts.map((thought) => ({
    thoughtText: thought.thoughtText,
    username: thought.username,
    createdAt: thought.createdAt,
    _id: thought._id,
  }))
);

    console.info("Seeding complete! ");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    process.exit(0);
  }
});
