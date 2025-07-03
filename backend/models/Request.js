import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    documentCount: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "In Progress", "Completed"],
      default: "Draft",
    },
    uploadedFileUrl: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleteStatus:{
      type:Number,
     required:true, // 0 for not deleted, 1 for deleted
    },
    documentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    reportId:{
      type: mongoose.Schema.Types.ObjectId, ref: "Report"
    }
  },
  { timestamps: true }
);

const model = mongoose.model("request", requestSchema);

export default model;
