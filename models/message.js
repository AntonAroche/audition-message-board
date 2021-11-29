const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isPalindrome: {
        type: Boolean,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', messageSchema)