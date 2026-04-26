import mongoose from "mongoose"

const followSchema = new mongoose.Schema(
  {
    followby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogusers",
      required: true,
    },
    followto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogusers",
      required: true,
    },
  },
  { timestamps: true }
)

followSchema.index({ followby: 1, followto: 1 }, { unique: true })

export default mongoose.models.follows ||
  mongoose.model("follows", followSchema)