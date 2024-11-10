// models/Channel.js
import mongoose, { Schema } from "mongoose";

const channelSchema = new Schema({
  channelName: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  description: String,
  channelBanner: String,
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  channelURL: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);
