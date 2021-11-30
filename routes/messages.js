const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messages')

// Retrieve the list of messages
router.get('/', messageController.listMessages)

// Create a message
router.post('/', messageController.textBodyValidationMiddleware)
router.post('/', messageController.createMessage)

// Retrieve a single message
router.get('/:messageId', messageController.getMessage)

// Update a single message
router.patch('/:messageId', messageController.textBodyValidationMiddleware)
router.patch('/:messageId', messageController.updateMessage)

// Delete a single message
router.delete('/:messageId', messageController.deleteMessage)

module.exports = router
