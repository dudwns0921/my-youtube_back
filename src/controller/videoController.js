import VideoModel from '../models/Video'
import app from '../server'

const handleEditVideo = async (req, res) => {
  const data = req.body
  try {
    const video = await VideoModel.findById(data.id)
    video.title = data.title
    video.description = data.description
    video.hashtags = data.hashtags
    await video.save()
    res.send({ result: 'success' })
  } catch (e) {
    return res.send({
      result: 'failed',
      message: e._message,
    })
  }
}

app.get('/', handleGetAllVideos)
app.post('/upload', handlePostVideo)
app.post('/video/:id', handleFindVideo)
app.post('/videoEdit/:id', handleEditVideo)

async function handleGetAllVideos(req, res) {
  try {
    const videos = await VideoModel.find({})
    return res.send(videos)
  } catch (e) {
    return res.send({ result: 'failed', message: e._message })
  }
}

async function handlePostVideo(req, res) {
  const { title, description, hashtags } = req.body
  try {
    await VideoModel.create({
      title,
      description,
      hashtags: hashtags.split(',').map((word) => `#${word}`),
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

async function handleFindVideo(req, res) {
  const { id } = req.body
  try {
    const video = await VideoModel.findById(id)
    return res.send(video)
  } catch (e) {
    return res.send(e)
  }
}
