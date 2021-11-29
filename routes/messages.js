const express = require("express");
const router = express.Router();
const Message = require('../models/message')
const palindromeCheck = require('../operations/palindromeCheck')

// Retrieve the list of messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find()
        res.json(messages)
    } catch (err) {
        res.json(err)
    }
})

// Create a message
router.post('/', async (req, res) => {
    try {
        const text = req.body.text
        const newMessage = new Message({
            text,
            isPalindrome: palindromeCheck(req.body.text)
        })
        const savedMessage = await newMessage.save()
        res.json(savedMessage)
    } catch (err) {
        console.log(err)
        res.json(err)
    }
});

// Retrieve a single message 
router.get('/:messageId', async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId)
        res.json(message)
    } catch (err) {
        res.json(err)
    }
})

// Update a single message
router.patch('/:messageId', async (req, res) => {
    try {
        const text = req.body.text
        const updatedMessage = await Message.updateOne(
            { _id: req.params.messageId },
            { $set: { text, isPalindrome: palindromeCheck(text) } }
        )
        res.json(updatedMessage)
    } catch (err) {
        res.json(err)
    }
})

// Delete a single message
router.delete('/:messageId', async (req, res) => {
    try {
        const removedMessage = await Message.remove({ _id: req.params.messageId })
        res.json(removedMessage)
    } catch (err) {
        res.json(err)
    }
})

module.exports = router;