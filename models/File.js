const { profile } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");
//schema
const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
