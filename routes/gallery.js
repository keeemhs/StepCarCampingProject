const express = require('express');
const galleryController = require('../controller/Cgallery');
const router = express.Router();

// 리뷰 페이지로
router.get('/review', galleryController.reviewPage);

//갤러리 리뷰 페이지로
router.get('/reviewEdit', galleryController.reviewEdit);
//갤러리 axiosTest
router.post('/multipleAxios', galleryController.multipleAxios);

//review 만들떄 싱글 axios
router.post('/singleAxios', galleryController.singleAxios);

//갤러리 axiosTest
router.delete('/review/del', galleryController.reviewDel);
module.exports = router;
