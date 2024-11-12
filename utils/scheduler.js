const cron = require('node-cron');
const User = require('../models/userModel');

// Schedule a task to run every 30 days at midnight
cron.schedule('0 0 0 */30 * *', async () => {
  try {
    // Delete inactive users
    await User.deleteMany({ active: false });
    console.log('Inactive users deleted successfully');

    // Define the expiration date for device sessions (e.g., 30 days ago)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 30);

    // Remove expired device sessions for each user
    await User.updateMany({}, {
      $pull: { deviceSessions: { lastActiveAt: { $lt: expirationDate } } }
    });

    console.log('Expired device sessions deleted successfully');
  } catch (err) {
    console.error('Error during scheduled cleanup:', err);
  }
});
