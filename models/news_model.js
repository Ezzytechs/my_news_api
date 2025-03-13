const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: String,
  text: String,
  pictures: [String],
  tags: [String],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("News", NewsSchema);