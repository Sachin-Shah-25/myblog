import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },

    postid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
      required: true,
    },

    commentby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogusers",
      required: true,
    },
    parentcomment:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"comments",
      default:null
    }
  },
  { timestamps: true }
);

export default mongoose.models.comments ||
  mongoose.model("comments", commentSchema);