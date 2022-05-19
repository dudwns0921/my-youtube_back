import jwt from 'jsonwebtoken'
import { SECRET_KEY, EXPIRATION_DATE } from '../config'

const generateAccessToken = (userEmail) => {
  return jwt.sign({ userEmail }, SECRET_KEY, { expiresIn: EXPIRATION_DATE })
}

const authenticateToken = (req, res, next) => {
  const headerAuth = req.headers.authorization
  const token = headerAuth && headerAuth.split(' ')[1]
  if (token === null) return res.status(400).send()
  jwt.verify(token, SECRET_KEY, (e) => {
    if (e) {
      console.log(e)
      return res.status(403)
    }
    next()
  })
}

export { generateAccessToken, authenticateToken }
