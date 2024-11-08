import mongoose from "mongoose";

//userSchema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          // Simple email regex validation
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email format!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://www.google.com/imgres?q=IMAGES%20FOR%20DP&imgurl=https%3A%2F%2Fwww.gims-gulbarga.com%2Fwp-content%2Fuploads%2F2024%2F05%2FCute-Angel-Girls-dp-1024x1024.webp&imgrefurl=https%3A%2F%2Fwww.gims-gulbarga.com%2Fgirls-dp-images%2F&docid=tRHLd5IS1R04aM&tbnid=-_n3EP48Bs31GM&vet=12ahUKEwjE2MjZ_MqJAxXo4zQHHc7pF5cQM3oECGgQAA..i&w=1024&h=1024&hcb=2&ved=2ahUKEwjE2MjZ_MqJAxXo4zQHHc7pF5cQM3oECGgQAA",
    },
    location: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
      default: Date.now,
    },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
