const cron = require('node-cron');
const User = require('../Models/UserModel'); 
const moment = require('moment');

cron.schedule('0 * * * *', async () => { 
  try {
    const users = await User.find({ 'subscriptions.active': true });
    for (const user of users) {
      for (const subscription of user.subscriptions) {
        if (subscription.active && subscription.expirationDate && moment().isAfter(subscription.expirationDate)) {
          subscription.active = false;
          subscription.action = 'expired';
          await user.save();
        }
      }
    }
  } catch (error) {
    console.error('Error checking subscriptions:', error);
  }
});

module.exports = {};