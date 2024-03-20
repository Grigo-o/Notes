import mongoose from "mongoose";
import bcrypt from "bcrypt";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  text: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

noteSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
