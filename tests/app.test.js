const app = require('../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const mongoose = require('mongoose')
const Message = require('../models/message')
const testDb = 'mongodb://localhost/audition-message-board'
const { errorMessages } = require('../constants')

const endpoint = '/messages'
const idEndpoint = (id) => `${endpoint}/${id}`

const text = 'TestText'
const palindrome = 'Racecar'
const testId = '61a56636212de87cd49dcfa8'
const invalidId = '41224d776a326fb40f000001'

const testMsg1 = {
    _id: testId,
    text: 'Racecar',
    isPalindrome: true,
    createTime: '2021-11-29T23:45:58.993Z',
    __v: 0
}

const testMsg2 = {
    _id: '61a5663a212de87cd49dcfaa',
    text: 'Testmsg',
    isPalindrome: false,
    createTime: '2021-11-29T23:46:02.849Z',
    __v: 0
}

const testMessages = [testMsg1, testMsg2]

describe(`On the route ${endpoint}`, () => {
    beforeAll(async () => {
        await mongoose.connect(testDb, { useNewUrlParser: true })
    })

    afterEach(async () => {
        const collection = mongoose.connection.collections.messages
        await collection.deleteMany()
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    describe('The GET endpoint', () => {
        beforeAll(async () => {
            await Message.create(testMessages)
        })

        it('should retrieve the list of messages', async () => {
            const response = await request.get(endpoint)

            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual(testMessages)
        })
    })

    describe('The POST endpoint', () => {
        it('should respond with a 400 error if no text is sent in the body', async () => {
            const response = await request.post(endpoint).send({})

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(errorMessages.BAD_REQUEST)
        })

        it('should respond with the added info and add it to the database', async () => {
            const response = await request.post(endpoint).send({ text })

            expect(response.status).toBe(200)
            expect(response.body.text).toBe(text)
            expect(response.body.isPalindrome).toBe(false)
            expect(response.body._id).toBeTruthy()
            expect(response.body.createTime).toBeTruthy()

            const message = await Message.findOne({ _id: response.body._id })
            expect(message.text).toBe(text)
            expect(message.isPalindrome).toBe(false)
        })

        it('should add a message with the isPalindrome property true if the message is a palindrome', async () => {
            const response = await request.post(endpoint).send({ text: palindrome })

            expect(response.status).toBe(200)
            expect(response.body.text).toBe(palindrome)
            expect(response.body.isPalindrome).toBe(true)
            expect(response.body._id).toBeTruthy()
            expect(response.body.createTime).toBeTruthy()

            const message = await Message.findOne({ _id: response.body._id })
            expect(message.text).toBe(palindrome)
            expect(message.isPalindrome).toBe(true)
        })
    })

    describe('/:messageId', () => {
        beforeEach(async () => {
            await Message.create(testMessages)
        })

        describe('The GET endpoint', () => {
            it('should retrieve a specific message by its ID', async () => {
                const response = await request.get(idEndpoint(testId))
                expect(response.status).toBe(200)
                expect(response.body).toStrictEqual(testMsg1)
            })

            it('should give a 404 error if the id is not found', async () => {
                const response = await request.get(idEndpoint(invalidId))
                expect(response.status).toBe(404)
                expect(response.body.message).toBe(errorMessages.NOT_FOUND)
            })
        })

        describe('The DELETE endpoint', () => {
            it('should delete aspecific message by its ID', async () => {
                const response = await request.delete(idEndpoint(testId))
                expect(response.status).toBe(200)
                expect(response.body).toStrictEqual({
                    deletedCount: 1
                })
            })

            it('should give a 404 error if the id is not found', async () => {
                const response = await request.delete(idEndpoint(invalidId))
                expect(response.status).toBe(404)
                expect(response.body.message).toBe(errorMessages.NOT_FOUND)
            })
        })

        describe('The PATCH endpoint', () => {
            it('should update a specific message by its ID and update isPalindrome', async () => {
                const newText = 'nonPalindrome'
                const response = await request.patch(idEndpoint(testId)).send({
                    text: newText
                })

                expect(response.status).toBe(200)
                expect(response.body).toStrictEqual({
                    acknowledged: true,
                    matchedCount: 1,
                    modifiedCount: 1,
                    upsertedCount: 0,
                    upsertedId: null
                })

                const updatedMessage = await Message.findOne({ _id: testId })
                expect(updatedMessage.text).toBe(newText)
                expect(updatedMessage.isPalindrome).toBe(false)
            })

            it('should give a 404 error if the id is not found', async () => {
                const response = await request.patch(idEndpoint(invalidId)).send({
                    text: 'nonPalindrome'
                })

                expect(response.status).toBe(404)
                expect(response.body.message).toBe(errorMessages.NOT_FOUND)
            })

            it('should give a 400 error if the text is not specified', async () => {
                console.log('REACHING')
                const response = await request.patch(idEndpoint(testId)).send({})

                expect(response.status).toBe(400)
                expect(response.body.message).toBe(errorMessages.BAD_REQUEST)
            })
        })
    })
})
