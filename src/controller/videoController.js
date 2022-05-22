import VideoModel from '../models/Video'
import app from '../server'
import { authenticateToken } from '../utils/auth'
import { formatHashtags } from '../utils/utils'

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
  const { title, description, hashtags } = req.body
  try {
    await VideoModel.create({
      title,
      description,
      hashtags: formatHashtags(hashtags),
    })
    return res.json({
      result: 'success',
    })
  } catch (e) {
    return res.status(400).json({
      result: 'failed',
    })
  }
}
const postEditVideo = async (req, res) => {
  const { data } = req.body
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
app.get('/videoFindAll', getFindAllVideos)
app.post('/videoFind', postFindVideo)
app.post('/videoUpload', authenticateToken, postUploadVideo)
app.post('/videoEdit', authenticateToken, postEditVideo)
app.post('/videoDelete', authenticateToken, postDeleteVideo)
app.post('/videoSearch', postSearchVideo)
