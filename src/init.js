import app from './server'
import './database'
import './models/Video'
import './controller/userController'
import './controller/videoController'
import dotenv from 'dotenv'

// 환경변수 로드
dotenv.config()

app.listen(4000, () => {
  console.log('Connected to PORT 4000')
})
