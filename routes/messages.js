const express = require("express");
const router = express.Router();
const Message = require('../models/message')

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find()
        res.json(messages)
    } catch (err) {
        res.json(err)
    }
})

router.post('/', async (req, res) => {
    try {
        const newMessage = new Message({
            text: req.body.text,
            isPalindrome: true
        })
        const savedMessage = await newMessage.save()
        res.json(savedMessage)
    } catch (err) {
        res.json(err)
    }
});

router.get('/:messageId', async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId)
        res.json(message)
    } catch (err) {
        res.json(err)
    }
})

router.patch('/:messageId', async (req, res) => {
    try {
        const updatedMessage = await Message.updateOne(
            { _id: req.params.messageId },
            { $set: { text: req.body.text } }
        )
        res.json(updatedMessage)
    } catch (err) {
        res.json(err)
    }
})

router.delete('/:messageId', async (req, res) => {
    try {
        const removedMessage = await Message.remove({ _id: req.params.messageId })
        res.json(removedMessage)
    } catch (err) {
        res.json(err)
    }
})

module.exports = router;