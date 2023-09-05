const express = require('express');
const pageController = require('../controller/pageController');
const router = express.Router();

// 어떤 페이지로 갈까를 모아둔곳 !!!!

//첫 메인 홈페이지
router.get('/', pageController.indexPage);
//대여 장비 목록 보기 페이지로
router.get('/rent', pageController.rentPage);
//대여 장비 등록 페이지로
router.get('/rent/regist', pageController.registPage);
router.post('/rent/regist', pageController.post_regist);
//spot 페이지로
router.get('/spot', pageController.spotPage);
//갤러리 페이지로
router.get('/gallery', pageController.galleryPage);
//갤러리 리뷰 페이지로
router.get('/gallery/review', pageController.reviewPage);
//

/////////////////////////////////////////

module.exports = router;
