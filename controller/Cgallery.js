const { gallery, gallery_img, gallery_comment, User } = require('../models');
//multer upload용
const aws = require('aws-sdk');
const multers3 = require('multer-s3');
const multer = require('multer');
const path = require('path');

aws.config.update({
    accessKeyId: 'AKIA4GRTGI6TYJVPLNVB',
    secretAccessKey: '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',
    region: 'ap-northeast-2',
});
const s3 = new aws.S3();
const limits = {
    fileSize: 5 * 1024 * 1024, //5mb
};
//싱글 업로드(썸네일용)
var userid = 0;
var galleryid = 0;
var first = 0;

const uploadSingle = multer({
    storage: multers3({
        s3: s3,
        bucket: 'hwr-bucket',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        async key(req, file, cb) {
            //DB에도 저장해야함(경로)
            //여기서 폴더를 하나 만들었고, 폴더에 마음대로...저장해보시면됩니다.
            if (first == 0) {
                var dateNow = Date.now();
                const fn = `gallery/${Date.now()}_${path.basename(file.originalname)}`;
                const galleryEdit = await gallery.create({
                    userid: userid,
                    title: req.body.title,
                    mainText: req.body.mainText,
                    region: req.body.region,
                    spotInform: req.body.spotInform,
                    thunmnail: fn,
                });
                galleryid = galleryEdit.galleryid;
                console.log('galleryid', galleryid);

                gallery_img.create({
                    galleryid: galleryid,
                    imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gallery/${dateNow}_${path.basename(file.originalname)}`,
                });
                first += 1;
                cb(null, fn); // original 폴더안에다 파일을 저장
            } else {
                var dateNow = Date.now();
                gallery_img.create({
                    galleryid: galleryid,
                    imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gallery/${dateNow}_${path.basename(file.originalname)}`,
                });
                cb(null, `gallery/${dateNow}_${path.basename(file.originalname)}`); // original 폴더안에다 파일을 저장
            }
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});
//멀터 업로드
//멀티 업로드(사진들 업로드)
const uploadMulti = multer({
    storage: multers3({
        s3: s3,
        bucket: 'hwr-bucket',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            //DB에도 저장해야함(경로)
            //여기서 폴더를 하나 만들었고, 폴더에 마음대로...저장해보시면됩니다.
            const dateNow = Date.now();
            console.log('key,result2');
            gallery_img.create({
                galleryid: galleryid,
                imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gallery/${dateNow}_${path.basename(file.originalname)}`,
            });
            cb(null, `gallery/${dateNow}_${path.basename(file.originalname)}`); // original 폴더안에다 파일을 저장
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});

//멀터 이용 싱글 테이블 만들기
exports.singleAxios = async (req, res) => {
    const files = uploadSingle.array('array_file');
    const user = await User.findOne({
        where: {
            nickname: req.cookies.isLogin,
        },
    });
    userid = user.id;
    if (!userid) {
        res.send({ result: false, errMessage: '로그인이 종료되었거나, 잘못된 접근입니다.' });
    }
    console.log(req.body);
    const result = files(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            const err = new Error('Multer error');
            console.log(err);
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
            return;
        }
        console.log(result);

        first = 0;
        return res.json({
            galleryid: galleryid,
        });
    });
};

//멀터 이용
exports.multipleAxios = async (req, res) => {
    console.log('multiAxios');
    const files = uploadMulti.array('array_files');
    const result = files(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            const err = new Error('Multer error');
            console.log(err);
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
            return;
        }
        console.log(result);
        return res.json({
            file: result,
        });
    });
};

exports.reviewPage = async (req, res) => {
    //조회수 로직
    await gallery.increment(
        { views: 1 },
        {
            where: {
                galleryid: req.query.galleryId,
            },
        }
    );
    //본문
    const result1 = await gallery.findOne({
        where: {
            galleryid: req.query.galleryId,
        },
    });
    if (result1 == null) {
        console.log('none');
        res.render('404');
        return;
    }
    const userInfo = await User.findOne({
        where: {
            id: result1.userid,
        },
    });
    //query - 사진 이미지 경로 가져오기
    const imgurl = await gallery_img.findAll({
        where: {
            galleryid: req.query.galleryId,
        },
    });
    // 댓글 구현은 아직.
    const urlArray = { urls: [] };
    console.log(imgurl[0]);
    for (let i = 0; i < imgurl.length; i++) {
        urlArray.urls.push(imgurl[i].imgurl);
    }
    console.log(urlArray);
    res.render('review', { mainText: result1.mainText, imgurl: urlArray });
    res.render('review', { userInfo: userInfo, mainText: result1.mainText, galleryId: result1.galleryid, imgurl: urlArray });
};

exports.reviewEdit = async (req, res) => {
    //쿠키던 세션이던 검증 필요
    if (!req.cookies.isLogin) {
        res.send(`<script type="text/javascript">alert("로그인이 되어있지 않습니다."); window.location = document.referrer; </script>`);
        return;
    }
    //쿠키던 세션이던 저장되어있다고 생각하고 여기선 구현
    res.render('reviewedit');
};
exports.reviewDel = async (req, res) => {
    console.log('del', req.body);
    const loginuser = await User.findOne({
        where: {
            nickname: req.cookies.isLogin,
        },
    });
    const owner = await gallery.findOne({
        where: {
            galleryid: req.body.gid,
        },
    });

    if (loginuser.id == owner.userid) {
        gallery.destroy({
            where: {
                galleryid: req.body.gid,
            },
        });
        console.log('삭제');
        res.send({ error: 'no error' });
        return;
    } else {
        console.log('삭제실패, 아이디가 다름');
        res.send({ error: '삭제 권한이 없습니다.' });
    }
};
