import UserModel from '../models/User'
import app from '../server'
import bcrypt from 'bcrypt'
import { authenticateToken, generateAccessToken } from '../utils/auth'

const postJoin = async (req, res) => {
  const { email, username, password } = req.body
  try {
    const emailExists = await UserModel.exists({ email })
    const usernameExists = await UserModel.exists({ username })
    if (emailExists) {
      return res.status(400).send({
        result: 'failed',
        message: 'duplicated email',
      })
    }
    if (usernameExists) {
      return res.status(400).send({
        result: 'failed',
        message: 'duplicated username',
      })
    }
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
    })
  }
}
const postLogin = async (req, res) => {
  const { email, password } = req.body
  try {
    const dbUserData = await UserModel.findOne({ email })
    const passwordCheck = await bcrypt.compare(password, dbUserData.password)
    if (dbUserData) {
      if (passwordCheck) {
        const token = generateAccessToken(dbUserData.email)
        res.json({
          token,
          user: {
            email: dbUserData.email,
            username: dbUserData.username,
          },
          result: 'success',
        })
      }
    }
  } catch (e) {
    console.log(e)
    return res.send({
      result: 'failed',
    })
  }
}

app.post('/join', postJoin)
app.post('/login', postLogin)
