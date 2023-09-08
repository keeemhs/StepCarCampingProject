const express = require('express')
const router = express.Router()
const controller = require('../controller/CUser')

////////////////////////////////////GET////////////////////////////////////

//카카오톡 로그인 인증코드 받을 주소
router.get('/signin/kakao', controller.signin_kakao)
//카카오톡 리다이렉트 주소
router.get('/oauth/kakao', controller.auth_kakao)
//카카오톡 로그인 페이지 중간단계
router.get('/signin/middle', controller.getToken)
//로그아웃 페이지
router.get('/logout', controller.logout)
//카카오 로그아웃 페이지 중간단계
router.get('/logout/middle', controller.logoutMiddle)
//회원탈퇴 페이지
router.get('/deleteUser', controller.deleteUser)


////////////////////////////////////POST////////////////////////////////////

//회원가입 동작
router.post('/signup', controller.signup)
//이메일 중복검사 동작
router.post('/duplication', controller.duplication)
//닉네임 중복검사 동작
router.post('/duplicationNickname', controller.duplicationNickname)
//로그인 동작
router.post('/signin', controller.signin)
//로그인 중간단계 동작
router.post('/signin/middle', controller.postToken)
//로그아웃 동작
router.post('/logout', controller.logoutPost)
//로그아웃 중간단계 동작
router.post('/logout/middle', controller.logoutMiddlePost)

////////////////////////////////////DELETE////////////////////////////////////

//회원탈퇴 동작
router.delete('/deleteUser', controller.deleteUserPost)

module.exports = router