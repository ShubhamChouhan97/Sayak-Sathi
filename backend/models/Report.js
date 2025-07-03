import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    requestId: {
        type: String,
        required: true
        },
    commonProblems: [
      {
        problem: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
        reporters: [
          {
            docname: {
              type: String,
              required: true,
            },
            wardNumber: {
              type: String,
              required: true,
            },
            id: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
            },
          },
        ],
      },
    ],
    wardWiseProblems: [
      {
        ward: {
          type: String,
          required: true,
        },
        problems: [
          {
            problem: {
              type: String,
              required: true,
            },
            category: {
              type: String,
              required: true,
            },
            count: {
              type: Number,
              required: true,
            },
            reporters: [
              {
                docname: {
                  type: String,
                  required: true,
                },
                id: {
                  type: mongoose.Schema.Types.ObjectId,
                  required: true,
                },
              },
            ],
          },
        ],
      },
    ],
    analytics: [
      {
        ward: {
          type: String,
          required: true,
        },
        totalProblems: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;