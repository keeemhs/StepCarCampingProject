const express = require("express")
const router = express.Router()

// 어떤 페이지로 갈까를 모아둔곳 !!!!

//첫 메인 홈페이지  
router.get("/",(req,res)=>{
    res.render("/")
});
//대여 장비 목록 보기 페이지로
router.get("/index/rent",(req,res)=>{
    res.render("index/rent")
});
//spot 페이지로
router.get("/spot",(req,res)=>{
    res.render("/spot")
});
//갤러리 페이지로
router.get("/gallery",(req,res)=>{
    res.render("/gallery")
});

/////////////////////////////////////////

module.exports = router;