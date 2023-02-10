const express = require('express')
const index = express()
require('dotenv').config()
const connectDB = require('./connect')
const notFoundPage = require('./middleware/notFound')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/Jobs')
const authenticateUser = require('./middleware/authentication')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
// const rateLimiter = require('express-rate-limit')


//package
// index.set('trust proxy', 1) 
// index.use(
//     rateLimiter({
//         windowMs: 15 * 60 * 1000, // 15 minutes
//         max: 100 // limit each API request by 100 per windowMs
//     })
//     )
index.use(express.json())
index.use(helmet())
index.use(cors())
index.use(xss())

index.get('/', (req, res) => {
    res.send('job api')
})
//routes
index.use('/api/v1/auth',authRouter)
index.use('/api/v1/jobs', authenticateUser, jobsRouter)


//middleware
index.use(notFoundPage)



const port = process.env.PORT || 8000


const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        index.listen(port, console.log(`server is listening at port ${port}`))
        
    } catch (error) {
        console.log(error)
    }
}


start()

// stop at 8:52:50

