const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "TICKET_CREATED",
        "STATUS_CHANGED",
        "PRIORITY_CHANGED",
        "ASSIGNED",
        "COMMENT_ADDED",
      ],
      required: true,
    },

    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    at: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { versionKey: false },
);

// Prevent Updates (Immutable Logs)

activitySchema.pre("findOneAndUpdate", function () {
  throw new Error("Activity logs are immutable");
});

activitySchema.pre("updateOne", function () {
  throw new Error("Activity logs are immutable");
});

module.exports = mongoose.model("Activity", activitySchema);
