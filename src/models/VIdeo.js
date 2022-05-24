import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
  videoURL: { type: String },
  title: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String }],
  ownerId: { type: String },
  meta: {
    views: { type: Number, default: 0 },
  },
})

const VideoModel = mongoose.model('Video', videoSchema)
export default VideoModel
