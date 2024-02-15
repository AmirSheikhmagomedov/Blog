import express, { Express } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import path from 'path'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { userRouter } from './routes/userRouter.js'
import { articleRouter } from './routes/articleRouter.js'

const app: Express = express()

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(
  cors({
    origin: process.env.CLIENT_LINK as string,
    credentials: true,
    exposedHeaders: ['set-cookie'],
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use(helmet())

app.use(bodyParser.json())
app.use(morgan('common'))
app.use(fileUpload())

app.use('/assets', express.static(path.join(__dirname, '..', 'public/assets')))

app.use('/message', (req, res) => {res.json({ message: 'Ok' })})

app.use('/api/user', userRouter)
app.use('/api/', articleRouter)

mongoose.connect(process.env.DATABASE_LINK as string)

app.listen(process.env.PORT)
