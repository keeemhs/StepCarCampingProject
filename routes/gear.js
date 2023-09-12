const express = require('express');
const gearController = require('../controller/Cgear');
const router = express.Router();

// 리뷰 페이지로
router.get('/gearreview', gearController.gearreviewPage);

//기어 리뷰 페이지로
router.get('/gearreviewEdit', gearController.gearreviewEdit);
//gear axiosTest
router.delete('/gearreview/del', gearController.reviewDel);

router.post('/singleAxios', gearController.singleAxios);

router.post('/multiAxios', gearController.multipleAxios);

module.exports = router;
