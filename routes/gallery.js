const express = require('express');
const galleryController = require('../controller/Cgallery');
const router = express.Router();

// 리뷰 페이지로
router.get('/review', galleryController.reviewPage);

//갤러리 리뷰 수정 페이지로
//리뷰 가능 상태 확인후 페이지 이동
router.get('/reviewEdit', galleryController.reviewEdit);

//review 만들떄 싱글 axios
router.post('/singleAxios', galleryController.singleAxios);

//review map 데이터 보내주기
router.post('/sendMapData', galleryController.sendMapData);

//갤러리 axiosTest
router.delete('/review/del', galleryController.reviewDel);
//리뷰 가능 상태 확인
router.post('/review/editCheck', galleryController.reviewChangeCheck);

//메인댓글 달기.
router.post('/review/addMainComment', galleryController.addMainComment);

//대댓글 달기.
router.post('/review/addSubComment', galleryController.addSubComment);
//대댓글 달기.
router.post('/review/deleteComment', galleryController.deleteComment);

module.exports = router;
