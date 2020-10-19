const mongoose = require("mongoose");

const { Schema } = mongoose;

const FileSchema = new Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["tmp", "avatar"] },
  small: { type: Boolean, default: false },
  origin: { type: Schema.Types.ObjectId, ref: "File" },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", FileSchema);
