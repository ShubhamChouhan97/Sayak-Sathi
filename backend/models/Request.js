const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    name: {
    type: String, 
    required: true, 
    },
    description: { 
    type: String, 
    required: true
    },
    documentCount: { 
    type: Number,
    default:0,
    required: true
    },
    status: {
      type: String,
      enum: ["Draft", "In Progress", "Completed"],
      default: "Draft",
    },
    uploadedFileUrl: {
    type: String, 
    default: "" ,
    required: true
   },
    actions: [
      {
        type: {
          type: String,
          enum: ["Preview", "Generate", "Delete"],
        },
        performedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
