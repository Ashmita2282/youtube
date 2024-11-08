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
    unique: true, // Each user can only own one channel
  },
  description: String,
  channelBanner: String,
  subscribers: {
    type: Number,
    default: 0,
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);
