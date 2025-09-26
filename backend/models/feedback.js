import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    subject: {
      type: String,
      required: false,
      maxlength: 100,
      minlength: 3,
      default: "",
    },
    message: {
      type: String,
      required: false,
      maxlength: 5000,
      minlength: 10,
      default: "",
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;