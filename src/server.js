import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { handleLogin } from './controller/userController'

const app = express()

app.listen(4000)

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.post('/login', handleLogin)
