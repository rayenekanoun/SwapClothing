const cron = require('node-cron');
const User = require('../models/userModel');

// Schedule a task to run every 30 days
cron.schedule('0 0 0 */30 * *', async () => {
  try {
    await User.deleteMany({ active: false });
    console.log('Inactive users deleted successfully');
  } catch (err) {
    console.error('Error deleting inactive users:', err);
  }
});