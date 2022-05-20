import jwt from 'jsonwebtoken'

const generateAccessToken = (userEmail) => {
  return jwt.sign({ userEmail }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRATION_DATE,
  })
}

const authenticateToken = (req, res, next) => {
  const headerAuth = req.headers.authorization
  const token = headerAuth && headerAuth.split(' ')[1]
  if (token === null) return res.status(400).send()
  jwt.verify(token, process.env.SECRET_KEY, (e) => {
    if (e) {
      console.log(e)
      return res.status(403).send()
    }
    next()
  })
}

export { generateAccessToken, authenticateToken }
