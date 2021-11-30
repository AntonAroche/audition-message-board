const mongoose = require('mongoose')
const db = 'mongodb://localhost/audition-message-board'

// Intiates the database connection
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB server connected')
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = connectDB
