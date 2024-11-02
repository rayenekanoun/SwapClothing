// const conversationSchema = new mongoose.Schema({
//     participants: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     }],
//     lastMessage: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Message', // Reference to the last message in this conversation
//     },
//     lastMessageTime: {
//       type: Date,
//       default: Date.now,
//     },
//   });

//   const Conversation = mongoose.model('Conversation', conversationSchema);
