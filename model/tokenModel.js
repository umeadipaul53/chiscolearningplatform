const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: "1d" }, // optional auto-expiry
});

const refreshTokenModel = mongoose.model("authToken", refreshTokenSchema);

const registrationTokenSchema = new mongoose.Schema({
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1d" }, // expires after 1 day
});

const registrationTokenModel = mongoose.model(
  "verifytoken",
  registrationTokenSchema
);

module.exports = { refreshTokenModel, registrationTokenModel };
