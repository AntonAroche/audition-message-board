const express = require('express')
const connectDB = require('./config/db')
const messages = require('./routes/messages')
const PORT = 3000
const app = express()

connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/messages', messages)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))