import VideoModel from '../models/Video'
import app from '../server'
import { authenticateToken } from '../utils/auth'
import { formatHashtags } from '../utils/utils'
import multer from 'multer'

const uploadVideo = multer({
  dest: 'uploads/videos',
  limits: {
    fileSize: 10000000,
  },
}).single('videoFile')

const getFindAllVideos = async (req, res) => {
  try {
    const videos = await VideoModel.find({})
    return res.json(videos)
  } catch (e) {
    return res.status(400).json({ result: 'failed' })
  }
}
const postFindVideo = async (req, res) => {
  const { id } = req.body
  try {
    const video = await VideoModel.findById(id)
    return res.json(video)
  } catch (e) {
    return res.status(400).json(e)
  }
}
const postUploadVideo = async (req, res) => {
  const videoFile = req.file
  const { title, description, hashtags, ownerId } = req.body

  try {
    await VideoModel.create({
      videoURL: videoFile.path,
      title,
      description,
      hashtags: formatHashtags(hashtags),
      ownerId,
    })
    return res.json({
      result: 'success',
    })
  } catch (e) {
    console.log(e)
  }
}
const postEditVideo = async (req, res) => {
  const data = req.body
  try {
    await VideoModel.findByIdAndUpdate(data.id, {
      title: data.title,
      description: data.description,
      hashtags: formatHashtags(data.hashtags),
    })
    res.json({ result: 'success' })
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      result: 'failed',
    })
  }
}
const postDeleteVideo = async (req, res) => {
  const { id } = req.body
  try {
    await VideoModel.findOneAndDelete(id)
    return res.json({
      result: 'success',
    })
  } catch (e) {
    return res.status(400).json({
      result: 'failed',
    })
  }
}
const postSearchVideo = async (req, res) => {
  const { keyword } = req.body
  try {
    const videos = await VideoModel.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    })
    return res.json({
      result: 'success',
      videos,
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      result: 'failed',
    })
  }
}

const postFindMyVideos = async (req, res) => {
  const { userId: ownerId } = req.body
  const myVideos = await VideoModel.find({ ownerId })
  return res.json(myVideos)
}
app.get('/videoFindAll', getFindAllVideos)
app.post('/videoFind', postFindVideo)
app.post('/videoUpload', authenticateToken, uploadVideo, postUploadVideo)
app.post('/videoEdit', authenticateToken, uploadVideo, postEditVideo)
app.post('/videoDelete', authenticateToken, postDeleteVideo)
app.post('/videoSearch', postSearchVideo)
app.post('/myvideos', authenticateToken, postFindMyVideos)
