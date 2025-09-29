import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: false },
  icon: { type: String , required: true },
  color: { type: String, required: true, default: 'blue' },
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);

export default Service;