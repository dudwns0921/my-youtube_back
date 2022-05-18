import UserModel from '../models/User'
import app from '../server'

const postJoin = async (req, res) => {
  const { email, username, password } = req.body
  try {
    await UserModel.create({
      email,
      username,
      password,
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
const postLogin = (req, res) => {
  console.log(req.body)
  return res.send('로그인 완료')
}

app.post('/join', postJoin)
app.post('/login', postLogin)
