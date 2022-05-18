import app from '../server'

const postLogin = (req, res) => {
  console.log(req.body)
  return res.send('로그인 완료')
}

app.post('/login', postLogin)
