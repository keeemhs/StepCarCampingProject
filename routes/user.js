const express = require('express')
const router = express.Router()
const controller = require('../controller/CUser')

//post
router.post('/signup', controller.signup)
router.post('/duplication', controller.duplication)
router.post('/signin', controller.signin)

module.exports = router