import VideoModel from '../models/Video'
import app from '../server'

app.get('/', handleGetHome)
app.post('/upload', handlePostVideo)
app.post('/video/:id', handleFindVideo)

async function handleGetHome(req, res) {
  try {
    const videos = await VideoModel.find({})
    return res.send(videos)
  } catch (e) {
    return res.send(e)
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
    console.log(e)
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
