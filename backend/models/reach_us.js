import mongoose from "mongoose";

const reachUsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000,
      minlength: 10,
    },
  },
  { timestamps: true }
);

const ReachUs = mongoose.model("ReachUs", reachUsSchema);
export default ReachUs;