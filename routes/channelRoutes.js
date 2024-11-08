// controllers/channelController.js
import Channel from "../models/Channel.js";

export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;
    const ownerId = req.user._id; // Authenticated user ID

    // Check if the user already has a channel
    const existingChannel = await Channel.findOne({ owner: ownerId });
    if (existingChannel) {
      return res.status(400).json({
        success: false,
        message: "User already has a channel.",
      });
    }

    // Create a new channel
    const newChannel = new Channel({
      channelName,
      description,
      channelBanner,
      owner: ownerId,
    });

    await newChannel.save();

    res.status(201).json({
      success: true,
      message: "Channel created successfully.",
      channel: newChannel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
