// models/Video.js
import mongoose, { Schema } from "mongoose";

// Define schema for video data
const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
    default: "https://youtu.be/tBgNpc39FJk?t=15",
  }, // URL for the video file
  description: String,
  thumbnailUrl: String, // URL for the video's thumbnail image
  channelId: {
    type: Schema.Types.ObjectId,
    ref: "Channel", // Reference to the uploader's channel
    required: true,
  },
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the user who uploaded the video
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to users who liked the video
      },
    },
  ],
  dislikes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to users who disliked the video
      },
    },
  ],
  comments: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the user who made the comment
      },
      commentText: String, // Text of the comment
    },
  ],
  uploadDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);
