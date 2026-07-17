const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Please add age'],
      min: [18, 'Age must be at least 18'],
      max: [100, 'Age must be under 100'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'User', 'Guest'],
      default: 'User',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized search, filter, and unique lookups
memberSchema.index({ email: 1 });
memberSchema.index({ city: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ name: 1 });

module.exports = mongoose.model('Member', memberSchema);
