import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likeby:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogusers",
    },


    postid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.likes ||
  mongoose.model("likes", likeSchema);