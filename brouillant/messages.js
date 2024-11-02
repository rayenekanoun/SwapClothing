// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to the User schema
//     required: true,
//   },
//   recipient: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   conversationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Conversation', // Link to Conversation for easier retrieval
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   status: {
//     type: String,
//     enum: ['sent', 'read'],
//     default: 'sent',
//   },
// });
