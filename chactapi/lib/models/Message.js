const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  timestamp: Number,
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  type: String, // 1,群聊 2，私聊
  content: String,
});

module.exports = mongoose.model('Message', MessageSchema);