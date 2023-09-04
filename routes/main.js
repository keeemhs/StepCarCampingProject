const express = require("express")
const pageController =require("../controller/Cmain")
const router = express.Router()

// 어떤 페이지로 갈까를 모아둔곳 !!!!

//첫 메인 홈페이지  
router.get("/",pageController.indexPage);
//대여 장비 목록 보기 페이지로
router.get("/index/rent",pageController.rentPage)
//spot 페이지로
router.get("/spot",pageController.spotPage)
//갤러리 페이지로
router.get("/gallery",pageController.galleryPage)

//

/////////////////////////////////////////

module.exports = router;