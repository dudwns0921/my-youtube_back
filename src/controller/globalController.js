import VideoModel from '../models/Video'
import app from '../server'

app.get('/', handleGetHome)
app.post('/upload', handlePostVideo)

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
  await VideoModel.create({
    title,
    description,
    hashtags: hashtags.split(',').map((word) => `#${word}`),
    createdAt: Date.now(),
    meta: {
      views: 0,
    },
  })
  return res.send('비디오 생성 완료!')
}
