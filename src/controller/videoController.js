import VideoModel from '../models/Video'
import app from '../server'
import { formatHashtags } from '../utils/utils'

const getFindAllVideos = async (req, res) => {
  try {
    const videos = await VideoModel.find({})
    return res.send(videos)
  } catch (e) {
    return res.send({ result: 'failed', message: e._message })
  }
}
const postFindVideo = async (req, res) => {
  const { id } = req.body
  try {
    const video = await VideoModel.findById(id)
    return res.send(video)
  } catch (e) {
    return res.send(e)
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
    return res.send({
      result: 'success',
    })
  } catch (e) {
    return res.send({
      result: 'failed',
      message: e._message,
    })
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
    res.send({ result: 'success' })
  } catch (e) {
    console.log(e)
    return res.send({
      result: 'failed',
      message: e._message,
    })
  }
}
const postDeleteVideo = async (req, res) => {
  const { id } = req.body
  try {
    await VideoModel.findOneAndDelete(id)
    return res.send({
      result: 'success',
    })
  } catch (e) {
    return res.send({
      result: 'failed',
      message: e._message,
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
    return res.send({
      result: 'success',
      videos,
    })
  } catch (e) {
    console.log(e)
    return res.send({
      result: 'failed',
      message: e._message,
    })
  }
}
app.get('/videoFindAll', getFindAllVideos)
app.post('/videoFind', postFindVideo)
app.post('/videoUpload', postUploadVideo)
app.post('/videoEdit', postEditVideo)
app.post('/videoDelete', postDeleteVideo)
app.post('/videoSearch', postSearchVideo)
