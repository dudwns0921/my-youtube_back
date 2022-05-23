import UserModel from '../models/User'
import app from '../server'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../utils/auth'
import axios from 'axios'
import multer from 'multer'

const upload = multer({ dest: 'uploads/' }).single('avartar')

const postJoin = async (req, res) => {
  const { email, username, password } = req.body
  try {
    const emailExists = await UserModel.exists({ email })
    const usernameExists = await UserModel.exists({ username })
    if (emailExists) {
      return res.status(400).json({
        result: 'failed',
        message: 'duplicated email',
      })
    }
    if (usernameExists) {
      return res.status(400).json({
        result: 'failed',
        message: 'duplicated username',
      })
    }
    await UserModel.create({
      email,
      username,
      password,
    })
    return res.json({
      result: 'success',
    })
  } catch (e) {
    return res.json({
      result: 'failed',
      message: e,
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
            avartarURL: dbUserData.avartarURL,
          },
          result: 'success',
        })
      }
    }
  } catch (e) {
    return res.json({
      result: 'failed',
      message: e,
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
        (email) => email.primary === true && email.verified === true,
      ).email
      const checkUserexists = await UserModel.exists({ email: userEmail })

      if (!userEmail) {
        return res.json({
          result: 'failed',
          message: 'Your email is not verified at github.',
        })
      }

      if (checkUserexists) {
        return res.json({
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

const postCheckPassword = async (req, res) => {
  const { email, password } = req.body
  const dbUserData = await UserModel.findOne({ email })
  const isPasswordCorrect = await bcrypt.compare(password, dbUserData.password)
  if (isPasswordCorrect) {
    return res.json({
      isPasswordCorrect: true,
    })
  } else {
    return res.json({
      isPasswordCorrect: false,
    })
  }
}

const postCheckUserData = async (req, res) => {
  const { email } = req.body
  const checkUserexists = await UserModel.exists({ email })
  if (checkUserexists) {
    return res.json({
      exist: true,
    })
  } else {
    return res.json({
      exist: false,
    })
  }
}

const postEditUser = async (req, res) => {
  const avartarFile = req.file
  const { oldEmail, oldUsername, oldAvartartURL, newEmail, newUsername } =
    req.body
  try {
    const emailExists = await UserModel.exists({ email: newEmail })
    const usernameExists = await UserModel.exists({ username: newUsername })
    if (oldEmail !== newEmail && emailExists) {
      return res.status(400).json({
        isDuplicated: true,
      })
    }
    if (oldUsername !== newUsername && usernameExists) {
      return res.status(400).json({
        isDuplicated: true,
      })
    }
    await UserModel.findOneAndUpdate(
      { email: oldEmail },
      {
        email: newEmail,
        username: newUsername,
        avartarURL: avartarFile ? avartarFile.path : oldAvartartURL,
      },
      {
        fields: {
          email: true,
          username: true,
          avartarURL: true,
        },
      },
    )
    const newDBUserData = await UserModel.findOne({ email: newEmail })
    return res.json({
      userData: newDBUserData,
      // 이후 password 제외한 상태로 수정 필요
    })
  } catch (e) {
    return res.json({
      message: e,
    })
  }
}

const postEditUserPwd = async (req, res) => {
  const { newPassword, userEmail } = req.body
  await UserModel.findOneAndUpdate(
    { email: userEmail },
    { password: await bcrypt.hash(newPassword, 5) },
    {
      fields: {
        password: true,
      },
    },
  )
  const DBUserData = await UserModel.findOne({ email: userEmail })
  const checkNewPassword = await bcrypt.compare(
    newPassword,
    DBUserData.password,
  )
  if (checkNewPassword) {
    return res.json({
      result: 'success',
      message: 'password modified',
    })
  }
}

app.post('/join', postJoin)
app.post('/login', postLogin)
app.post('/githubLogin', postGithubLogin)
app.post('/checkPassword', postCheckPassword)
app.post('/checkUserData', postCheckUserData)
app.post('/editUser', upload, postEditUser)
app.post('/editUserPwd', postEditUserPwd)
