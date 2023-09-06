const express = require('express')
const router = express.Router()
const controller = require('../controller/CUser')

//카카오톡 로그인 인증코드 받을 주소
router.get('/signin/kakao', controller.signin_kakao)
//카카오톡 리다이렉트 주소
router.get('/oauth/kakao', controller.auth_kakao)

//post
router.post('/signup', controller.signup)
router.post('/duplication', controller.duplication)
router.post('/signin', controller.signin)

module.exports = router