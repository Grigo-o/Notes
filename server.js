import express from "express";
import mongoose from "mongoose";
import Note from "./models/schema.js";

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/note-one-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.post("/note", async (req, res) => {
  try {
    const { title, text, password } = req.body;
    const note = new Note({ title, text, password });
    await note.save();
    res.status(201).send("Note created successfully");
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/note/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const { password } = req.body;
    const note = await Note.findOne({ title });
    if (!note) {
      return res.status(404).send("Note not found");
    }

    const isPasswordValid = await note.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Incorrect password");
    }

    res.send(note);
  } catch (error) {
    console.error("Error fetching note info:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/note-status/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const note = await Note.findOne({ title });
    if (note) {
      return res.send("Note exists");
    }
    res.send("Note does not exist");
  } catch (error) {
    console.error("Error checking note status:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.send("Main Page");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
