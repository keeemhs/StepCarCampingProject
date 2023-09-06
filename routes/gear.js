const express = require('express');
const router = express.Router();
const controller = require('../controller/CGear');

//POST
router.post('/regist', controller.regist);

router.post('/multiAxios', controller.multipleAxios);

module.exports = router;

//s
