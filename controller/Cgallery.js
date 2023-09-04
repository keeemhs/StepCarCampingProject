
const { gallery, gallery_img,gallery_comment } = require('../models')

exports.reviewPage= async (req,res)=>{
    //조회수 로직
    await gallery.increment({'views' : 1 },{
        where : {
            galleryid : req.query.galleryId
        }
    });
    //본문
    const result1 = await gallery.findOne({where : {
        galleryid : req.query.galleryId
    }})
    //query - 사진 이미지 경로 가져오기
    const imgurl =await gallery.findAll(
        {
            attributes : ["galleryid"],
            where :{
                galleryid : req.query.galleryId
            },
            include : [{model : gallery_img }]
        }
    )
    // 댓글 구현은 아직.
    const urlArray={urls : []}
    console.log(imgurl[0].gallery_imgs[0].imgurl)
    for(let i=0; i<imgurl[0].gallery_imgs.length; i++){
        urlArray.urls.push(imgurl[0].gallery_imgs[i].imgurl)
    }
    console.log(urlArray)
    res.render("review",{mainText  : result1.mainText, imgurl :urlArray})
}