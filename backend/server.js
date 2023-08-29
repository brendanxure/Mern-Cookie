const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
dotenv.config()
const PORT = process.env.PORT

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use(cookieParser())

app.use('/api/user', require('./routes/userRoutes'))

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))