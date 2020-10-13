const mongoose = require("mongoose");

const { Schema } = mongoose;

const FileSchema = new Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  // hash: { type: String, required: true },
  type: { type: String, enum: ["tmp", "avatar"] },
  creator: { type: Schema.Types.ObjectId, ref: "Contact" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", FileSchema);
