const express = require('express');
const Cemail = require('../controller/Cemail');
const router = express.Router();

// 이메일 폼을 표시하는 라우트
router.get('/', Cemail.showEmailForm);

// 이메일을 전송하는 라우트
router.post('/sendEmail', Cemail.sendEmail);

// 인증번호 전송 코드
// router.post('/sendEmail2', Cemail.sendEmail2);
// router.post('/verify', Cemail.verifyCode);

module.exports = router;