import app from './server'
import './database'
import './models/Video'
import './controller/userController'
import './controller/globalController'

app.listen(4000, () => {
  console.log('Connected to PORT 4000')
})
