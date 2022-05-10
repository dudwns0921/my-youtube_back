import app from '../server'

app.get('/', handleGetHome)

function handleGetHome(req, res) {
  return res.send('Home get 요청 받음')
}
