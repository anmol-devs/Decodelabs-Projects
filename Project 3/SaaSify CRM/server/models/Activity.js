const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'SIGNUP'],
    },
    details: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Expire logs automatically after 30 days (TTL Index) to keep the db clean
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Activity', activitySchema);
