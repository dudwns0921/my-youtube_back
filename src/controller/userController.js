import app from '../server'

app.post('/login', handleLogin)

function handleLogin(req, res) {
  console.log(req.body)
  return res.send('로그인 완료')
}
