const express = require("express");
const router = express.Router();
const Message = require('../models/message')
const palindromeCheck = require('../operations/palindromeCheck')

const sendNotFound = (res) => {
    res.status(404).send({
        message: "The message with the requested ID was not found."
    })
}

exports.textBodyValidationMiddleware = (req, res, next) => {
    const text = req?.body?.text

    if (typeof text == 'string') {
        return next()
    } else {
        res.status(400).send({
            message: 'The body of the request does not contain the string attribute "text"'
        })
    }
}

// Retrieve the list of messages
exports.listMessages = async (req, res) => {
    try {
        const messages = await Message.find()
        res.json(messages)
    } catch (err) {
        res.json(err)
    }
}

// Create a message
exports.createMessage = async (req, res) => {
    const text = req.body.text
    try {
        const newMessage = new Message({
            text,
            isPalindrome: palindromeCheck(req.body.text)
        })
        const savedMessage = await newMessage.save()
        res.json(savedMessage)
    } catch (err) {
        res.json(err)
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
        res.json(err)
    }
}

// Update a single message
exports.updateMessage = async (req, res) => {
    const text = req.body.text
    try {
        const updatedMessage = await Message.updateOne(
            { _id: req.params.messageId },
            { $set: { text, isPalindrome: palindromeCheck(text) } }
        )
        if (updatedMessage.matchedCount == 1) {
            res.json(updatedMessage)
        } else {
            sendNotFound(res)
        }
    } catch (err) {
        res.json(err)
    }
}

// Delete a single message
exports.deleteMessage = async (req, res) => {
    try {
        const removedMessage = await Message.deleteOne({ _id: req.params.messageId })
        if (removedMessage.deletedCount == 1) {
            res.json(removedMessage)
        } else {
            sendNotFound(res)
        }
    } catch (err) {
        res.json(err)
    }
}
