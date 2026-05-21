import mongoose from "mongoose";

const leadSchema =
  new mongoose.Schema(
    {
      name: String,

      email: String,

      status: {
        type: String,

        enum: [
          "New",
          "Contacted",
          "Qualified",
          "Lost",
        ],

        default: "New",
      },

      source: {
        type: String,

        enum: [
          "Website",
          "Instagram",
          "Referral",
        ],
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Lead",
  leadSchema
);