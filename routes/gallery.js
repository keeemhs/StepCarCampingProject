const express = require('express');
const galleryController = require('../controller/Cgallery');
const router = express.Router();

// 리뷰 페이지로
router.get('/review', galleryController.reviewPage);

//갤러리 리뷰 페이지로
router.get('/reviewEdit', galleryController.reviewEdit);

//review 만들떄 싱글 axios
router.post('/singleAxios', galleryController.singleAxios);

//갤러리 axiosTest
router.delete('/review/del', galleryController.reviewDel);
//리뷰 가능 상태 확인
router.post('/review/editCheck', galleryController.reviewChangeCheck);
//리뷰 가능 상태 확인후 페이지 이동
module.exports = router;
