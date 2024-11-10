// controllers/videoController.js
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";

// Fetch video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params._id).populate(
      "uploader channelId comments.userId"
    );
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new video
export const addVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl } = req.body;
    const userId = req.user._id; // Assume `req.user` contains authenticated user info

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

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
      videoUrl,
      channelId: userChannel._id, // Link video to the user's channel
      uploader: userId, // Set uploader to the current user's ID
    });

    userChannel.videos.push(newVideo._id);

    // Save the new video and update the user's channel
    await Promise.all([newVideo.save(), userChannel.save()]);

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully.",
      data: newVideo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like a video
export const likeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const video = await Video.findById(req.params.id);

    // check if the user has already liked the video
    const isLiked = video.likes.some((like) => like.userId == userId);

    if (isLiked) {
      // if liked remove the like
      video.likes = video.likes.filter((like) => like.userId != userId);
    } else {
      // if not liked add the like
      video.likes.push({ userId });
      // if the user has previously disliked the video remove the dislike also
      video.dislikes = video.dislikes.filter((dislike) => dislike.userId != userId);
    }

    await video.save();
    res.status(200).json({
      success: true,
      message: "Video liked successfully.",
      data: video,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dislike a video
export const dislikeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const video = await Video.findById(req.params.id);

    // check if the user has already disliked the video
    const isDisliked = video.dislikes.some((dislike) => dislike.userId == userId);

    if (isDisliked) {
      // if disliked remove the dislike
      video.dislikes = video.dislikes.filter((dislike) => dislike.userId != userId);
    } else {
      // if not disliked add the dislike
      video.dislikes.push({ userId });
      // if the user has previously liked the video remove the like also
      video.likes = video.likes.filter((like) => like.userId != userId);
    }

    await video.save();
    res.status(200).json({
      success: true,
      message: "Video disliked successfully.",
      data: video,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a comment to a video
export const addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;

    // Find the video and the user
    const video = await Video.findById(req.params.id);
    const user = await User.findById(userId);

    // Check if the user and video exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    // Add the comment to the video
    video.comments.push({ userId, text });

    await video.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: video,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get comments of a video by ID
export const getComments = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id, { comments: 1, title: 1 }).populate("comments.userId");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    res.status(200).json({ success: true, data: video.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
