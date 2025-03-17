const Subscription = require('../Models/SubscriptionModel');
const User = require('../Models/UserModel'); 
const moment = require('moment');

// Create Subscription
const createSubscription = async (req, res) => {
    try {
        if (req.body.isDefault) {
            const existingDefault = await Subscription.findOne({ isDefault: true });
            if (existingDefault) {
                return res.status(400).json({ success: false, message: 'Only one default subscription is allowed' });
            }
        }
        const subscription = new Subscription(req.body);
        await subscription.save();
        res.status(201).json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Subscriptions
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .populate('categories', 'name')
            .populate('testSessions', 'name'); 
        res.status(200).json({ success: true, subscriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Subscription by ID
const getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id)
            .populate('categories', 'name')
            .populate('testSessions', 'name'); 
        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.status(200).json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Subscription
const updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('categories', 'name')
            .populate('testSessions', 'name'); 
        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.status(200).json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Subscription
const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.status(200).json({ success: true, message: 'Subscription deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Calculate Expiration Date
const calculateExpirationDate = async (subscriptionId) => {
  try {
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
          return new Date();
      }
      let expirationDate = new Date();
      if (subscription.durationUnit === "months") {
          expirationDate.setMonth(expirationDate.getMonth() + subscription.duration);
      } else if (subscription.durationUnit === "days") {
          expirationDate.setDate(expirationDate.getDate() + subscription.duration);
      } else if (subscription.durationUnit === "years") {
          expirationDate.setFullYear(expirationDate.getFullYear() + subscription.duration);
      }
      return expirationDate;
  } catch (err) {
      console.log(err);
      return new Date();
  }
};

// Assign/Update Subscription
const assignSubscriptionToStudent = async (req, res) => {
  try {
      const { studentId } = req.params;
      const { subscriptionId } = req.body;

      const user = await User.findById(studentId);
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      const newExpirationDate = await calculateExpirationDate(subscriptionId);

      // Update or add the subscription
      user.subscriptions = [{
          subscriptionId: subscriptionId,
          action: 'assigned',
          date: new Date(),
          expirationDate: newExpirationDate,
          active: true,
      }];

      await user.save();

      res.status(200).json({ success: true, message: 'Subscription assigned/updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error assigning/updating subscription', error });
  }
};

// Get Student Subscriptions
const getStudentSubscriptions = async (req, res) => {
  try {
      const student = await User.findById(req.params.studentId).populate('subscriptions.subscriptionId', 'name duration durationUnit categories price isDefault');
      if (!student) {
          return res.status(404).json({ success: false, message: 'Student not found' });
      }
      res.status(200).json({ success: true, subscriptions: student.subscriptions });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

// Automatic Expiration Check (Background Task)
const checkAndExpireSubscriptions = async () => {
  try {
      const users = await User.find({ 'subscriptions.active': true });
      const now = new Date();

      for (const user of users) {
          if (user.subscriptions && user.subscriptions.length > 0) {
              const subscription = user.subscriptions[0];
              if (subscription.expirationDate && subscription.expirationDate < now) {
                  subscription.active = false;
                  const defaultSubscription = await Subscription.findOne({ isDefault: true });
                  if (defaultSubscription) {
                      user.subscriptions = [{
                          subscriptionId: defaultSubscription._id,
                          action: 'default_assigned',
                          date: new Date(),
                          expirationDate: await calculateExpirationDate(defaultSubscription._id),
                          active: true,
                      }];
                  } else {
                      user.subscriptions = [];
                  }
                  await user.save();
              }
          }
      }
  } catch (error) {
      console.error('Error checking and expiring subscriptions:', error);
  }
};

// Add Test Session to Subscription
const addTestSessionToSubscription = async (req, res) => {
    try {
        const { subscriptionId, testSessionId } = req.params;
        const subscription = await Subscription.findByIdAndUpdate(
            subscriptionId,
            { $addToSet: { testSessions: testSessionId } },
            { new: true }
        ).populate('testSessions', 'name');

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.status(200).json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove Test Session from Subscription
const removeTestSessionFromSubscription = async (req, res) => {
    try {
        const { subscriptionId, testSessionId } = req.params;
        const subscription = await Subscription.findByIdAndUpdate(
            subscriptionId,
            { $pull: { testSessions: testSessionId } },
            { new: true }
        ).populate('testSessions', 'name');

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.status(200).json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
  
module.exports = {
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    assignSubscriptionToStudent,
    getStudentSubscriptions,
    checkAndExpireSubscriptions,
    calculateExpirationDate,
    addTestSessionToSubscription,
    removeTestSessionFromSubscription
};