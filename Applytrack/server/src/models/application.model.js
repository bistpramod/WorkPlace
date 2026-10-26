import mongoose from 'mongoose';

export const APPLICATION_STATUSES = [
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'withdrawn',
];

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'applied',
    },
    appliedOn: {
      type: String,
      required: true,
    },
    jobUrl: {
      type: String,
      default: '',
      maxlength: 2048,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
  },
  {
    collection: 'applications',
    timestamps: true,
  },
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
