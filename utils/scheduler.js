const cron = require('node-cron');
const User = require('../models/userModel');
const Item = require('../models/itemModel');

// Schedule a task to run every 30 days at midnight
cron.schedule('0 0 0 */30 * *', async () => {
  try {
    console.log('Scheduled cleanup started...');

    // Find all inactive users
    const inactiveUsers = await User.find({ active: false });
    const inactiveUserIds = inactiveUsers.map(user => user._id);

    // Delete inactive users
    await User.deleteMany({ active: false });
    console.log('Inactive users deleted successfully');

    // Delete all items owned by inactive users
    await Item.deleteMany({ owner: { $in: inactiveUserIds } });
    console.log('Items owned by inactive users deleted successfully');

    // Define the expiration date for device sessions (e.g., 30 days ago)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 30);

    // Remove expired device sessions for all users
    await User.updateMany({}, {
      $pull: { deviceSessions: { lastActiveAt: { $lt: expirationDate } } }
    });

    console.log('Expired device sessions deleted successfully');
  } catch (err) {
    console.error('Error during scheduled cleanup:', err);
  }
});
