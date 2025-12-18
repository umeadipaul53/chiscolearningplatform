const mongoose = require("mongoose");

const twofactorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    code: { type: String },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Optional: TTL index to auto-delete expired docs (Mongo will delete after `expiresAt`)
twofactorSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

const twoFactorModel = mongoose.model("twoFactor", twofactorSchema);

module.exports = twoFactorModel;
