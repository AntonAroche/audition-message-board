const express = require('express')
const router = express.Router()
const Message = require('../models/message')
const palindromeCheck = require('../operations/palindromeCheck')
const { errorMessages } = require('../constants')

const sendNotFound = (res) => {
    res.status(404).send({
        message: errorMessages.NOT_FOUND
    })
}

exports.textBodyValidationMiddleware = (req, res, next) => {
    const text = req?.body?.text
    console.log('SENDING')
    if (typeof text === 'string') {
        return next()
    } else {
        res.status(400).send({
            message: errorMessages.BAD_REQUEST
        })
    }
}

// Retrieve the list of messages
exports.listMessages = async (req, res) => {
    try {
        const messages = await Message.find()
        res.json(messages)
    } catch (err) {
        res.status(500).send(err)
    }
}

// Create a message
exports.createMessage = async (req, res) => {
    const text = req.body.text
    try {
        const newMessage = await Message.create({
            text,
            isPalindrome: palindromeCheck(req.body.text)
        })
        res.json(newMessage)
    } catch (err) {
        res.status(500).send(err)
    }
}

// Retrieve a single message
exports.getMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId)
        if (message) {
            res.json(message)
        } else {
            sendNotFound(res)
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

// Update a single message
exports.updateMessage = async (req, res) => {
    console.log('WWOW')
    const text = req.body.text
    try {
        const updatedMessage = await Message.updateOne(
            { _id: req.params.messageId },
            { $set: { text, isPalindrome: palindromeCheck(text) } }
        )
        if (updatedMessage.matchedCount === 1) {
            res.json(updatedMessage)
        } else {
            sendNotFound(res)
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

// Delete a single message
exports.deleteMessage = async (req, res) => {
    try {
        const removedMessage = await Message.deleteOne({ _id: req.params.messageId })
        if (removedMessage.deletedCount === 1) {
            res.json(removedMessage)
        } else {
            sendNotFound(res)
        }
    } catch (err) {
        res.status(500).send(err)
    }
}
