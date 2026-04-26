import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    youtube: {
      type: String,
    },
    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogusers",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "likes",
      },
    ],
  },
  {
    timestamps: true, // ✅ yaha hona chahiye
  }
);

export default mongoose.models.blogs || mongoose.model("blogs", blogSchema);