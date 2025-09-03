const express =  require('express')
const colors = require('colors')
const connectDB = require('./config/dbconfig')
const errorhandler = require('./midldleware/errorhandler')
require ('dotenv').config()
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000;
app.use(cors())

// Connect Data Base
connectDB()

// Body Parse
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.json({
        msg: 'WELCOME TO E-COMMERCE API 1.0'
    })
})

app.use('/api/auth', require('./routes/authRoutes'))

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT ${PORT}`.bgBlue)
})

// Error Handler
app.use(errorhandler)