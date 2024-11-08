// controllers/videoController.js
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// Fetch video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params._id).populate(
      "uploader channelId comments.userId"
    );
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new video

export const addVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl } = req.body;
    const userId = req.user._id; // Assume `req.user` contains authenticated user info

    // Check if the user has a channel
    const userChannel = await Channel.findOne({ owner: userId });

    if (!userChannel) {
      return res.status(403).json({
        success: false,
        message: "You must create a channel before uploading videos.",
      });
    }

    // If the user has a channel, proceed to create a new video
    const newVideo = new Video({
      title,
      description,
      thumbnailUrl,
      channelId: userChannel._id, // Link video to the user's channel
      uploader: userId, // Set uploader to the current user's ID
    });

    // Save the new video
    await newVideo.save();

    // Add the new video ID to the user's channel's videos array
    userChannel.videos.push(newVideo._id);
    await userChannel.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully.",
      video: newVideo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like or dislike a video
export const likeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const video = await Video.findById(req.params.id);

    // Toggle like
    if (video.likes.some((like) => like.userId.toString() === userId)) {
      video.likes = video.likes.filter(
        (like) => like.userId.toString() !== userId
      );
    } else {
      video.likes.push({ userId });
    }

    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a comment to a video
export const addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const video = await Video.findById(req.params.id);
    video.comments.push({ userId, text });
    await video.save();
    res.status(201).json(video.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
