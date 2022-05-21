import UserModel from '../models/User'
import app from '../server'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../utils/auth'
import axios from 'axios'

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
        return res.json({
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
    console.log('error', e)
    return res.send({
      result: 'failed',
    })
  }
}

const postGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token'
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET_KEY,
    code: req.body.githubCode,
  }
  const params = new URLSearchParams(config).toString()
  try {
    const { data } = await axios({
      method: 'post',
      url: `${baseUrl}?${params}`,
      headers: {
        Accept: 'application/json',
      },
    })
    if (data.access_token) {
      const userData = await axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
          Authorization: `token ${data.access_token}`,
        },
      })
      const emailData = await axios({
        method: 'get',
        url: 'https://api.github.com/user/emails',
        headers: {
          Authorization: `token ${data.access_token}`,
        },
      })
      const username = userData.data.login
      const userEmail = emailData.data.find(
        (email) => email.primary === true,
      ).email
      const checkUserexists = await UserModel.findOne({ email: userEmail })

      if (checkUserexists) {
        return res.send({
          result: 'failed',
          message: 'Someone signed up with same email',
        })
      } else {
        const token = generateAccessToken(userEmail)
        return res.json({
          token,
          user: {
            email: userEmail,
            username,
          },
          result: 'success',
        })
      }
    }
  } catch (e) {
    console.log(e)
  }
}

app.post('/join', postJoin)
app.post('/login', postLogin)
app.post('/githubLogin', postGithubLogin)
