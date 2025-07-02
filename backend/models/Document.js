import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  wardNumber: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  countryCode: {
    type: String,
    required: true,
    default: '+91',
  },
  issues: {
    type: [String],
    default: [],
  },
  problems: {
    type: [
      {
        category: {
          type: [String],
          required: true,
        },
        description: {
          english: {
            type: String,
            required: true,
          },
          hindi: {
            type: String,
            required: true,
          },
        },
      },
    ],
    default: [],
  },
}, { timestamps: true });

const model = mongoose.model("Document", DocumentSchema);

export default model;