const express = require('express')
const router = express.Router()
const controller = require('../controller/CUser')

//카카오톡 로그인 인증코드 받을 주소
router.get('/signin/kakao', controller.signin_kakao)
//카카오톡 리다이렉트 주소
router.get('/oauth/kakao', controller.auth_kakao)
//카카오톡 사용자 정보 가져오기 주소
router.get('/signin/middle', controller.getToken)
router.post('/signin/middle', controller.postToken)

//로그아웃 페이지로
router.get('/logout', controller.logout)
//카카오 로그아웃 리다이렉트 주소
//router.get('/logout/redirect', controller.logoutRedirect)
//카카오 로그아웃 페이지 중간단계
router.get('/logout/middle', controller.logoutMiddle)
router.post('/logout/middle', controller.logoutMiddlePost)

//로그아웃 동작
router.post('/logout', controller.logoutPost)
//회원탈퇴 페이지로
router.get('/deleteUser', controller.deleteUser)
//마이페이지로 
router.get('/mypage', controller.mypage)

//post
router.post('/signup', controller.signup)
router.post('/duplication', controller.duplication)
router.post('/signin', controller.signin)

module.exports = router