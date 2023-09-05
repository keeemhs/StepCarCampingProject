
const { gallery, gallery_img,gallery_comment } = require('../models')
const aws = require("aws-sdk")
const multers3= require("multer-s3")

aws.config.update({
    accessKeyId:"AKIA4GRTGI6TYJVPLNVB",
    secretAccessKey : "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",
    region : "ap-northeast-2"
})


const s3 = new aws.S3();
const limits = {
    fileSize: 5 * 1024 * 1024, //5mb
};
const upload = multer({
    storage : multers3({
        s3: s3,
        bucket: "hwr-bucket",
        acl : "public-read",
        metadata : function(req,file,cb){
            cb(null,{fieldName: file.fieldName})
        },
        key(req, file, cb) {

            //DB에도 저장해야함(경로) 
              // https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/1693843848259_kali.jpg
            //즉, https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/{파일명} 으로 경로 저장하는 코드 필요
            cb(null, `${Date.now()}_${path.basename(file.originalname)}`) // original 폴더안에다 파일을 저장
         },
    }),
    limits : {
        fileSize: 5 * 1024 * 1024, //5mb
    }
})


exports.multipleAxios=  (req,res)=>{
    const files = upload.array('array_files')

    const result =files(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          const err = new Error('Multer error');
          console.log(err)
          return ;
          } else if (err) {
          // An unknown error occurred when uploading.
          const err = new Error('Server Error')
          console.log(err)
          return;
        }
    console.log(result)
        return res.json({
            "filePath" :filePathArray
          });
    })
}



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

exports.reviewEdit= async (req,res)=>{

    //쿠키던 세션이던 검증 필요

    //쿠키던 세션이던 저장되어있다고 생각하고 여기선 구현
    res.render("reviewedit")


}