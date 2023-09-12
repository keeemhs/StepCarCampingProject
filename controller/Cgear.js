const { gear, gear_img, User } = require('../models');
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
var userid = 0;
var gearid = 0;
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
            if (first == 0) {
                var dateNow = Date.now();
                const fn = `gear/${Date.now()}_${path.basename(file.originalname)}`;
                const gearEdit = await gear.create({
                    gearTitle: req.body.gearTitle,
                    gearExplain: req.body.gearExplain,
                    writer: decodeURI(req.body.writer),
                    thunmnail: fn,
                });
                gearid = gearEdit.gearid;
                console.log('gearid1111', gearid);

                await gear_img.create({
                    gearid: gearid,
                    imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gear/${dateNow}_${path.basename(file.originalname)}`,
                });
                first += 1;
                cb(null, fn); // original 폴더안에다 파일을 저장
            } else {
                setTimeout(async () => {
                    var dateNow = Date.now();
                    gear_img.create({
                        gearid: gearid,
                        imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gear/${dateNow}_${path.basename(file.originalname)}`,
                    });
                    cb(null, `gear/${dateNow}_${path.basename(file.originalname)}`); // original 폴더안에다 파일을 저장
                }, 50);
            }
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

exports.reviewDel = async (req, res) => {
    if (!req.cookies.isLogin) {
        res.send({ errcode: -1, error: '삭제 권한이 없습니다.' });
        return;
    }
    const loginuser = await User.findOne({
        where: {
            nickname: decodeURI(req.cookies.isLogin),
        },
    });
    const owner = await gear.findOne({
        where: {
            gearid: req.body.gid,
        },
    });
    if (!loginuser || !owner) {
        res.send({ errcode: -1, error: '삭제 권한이 없습니다.' });
        return;
    }
    if (loginuser.nickname == owner.writer) {
        const imgurls = gear_img.findAll({
            where: {
                gearid: req.body.gid,
            },
        });
        for (let i = 0; i < imgurls.length; i++) {
            const tmpFileName = imgurls[i].split('/');
            const params = {
                Bucket: 'hwr-bucket',
                Key: `/gear/${tmpFileName[tmpFileName.length - 1]}`,
            };

            try {
                await s3.headObject(params).promise();
                console.log('File Found in S3');
                try {
                    await s3.deleteObject(params).promise();
                    console.log('file deleted Successfully');
                } catch (err) {
                    console.log('ERROR in file Deleting : ' + JSON.stringify(err));
                }
            } catch (err) {
                console.log('File not Found ERROR : ' + err.code);
            }
        }

        gear.destroy({
            where: {
                gearid: req.body.gid,
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
            gear_img.create({
                gearid: gearid,
                imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gear/${dateNow}_${path.basename(file.originalname)}`,
            });
            cb(null, `gear/${dateNow}_${path.basename(file.originalname)}`); // original 폴더안에다 파일을 저장
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});
//멀터 셋팅 끝!

//멀터 이용

//멀터 이용 싱글 테이블 만들기
exports.singleAxios = async (req, res) => {
    const files = uploadSingle.array('array_file');
    const user = await User.findOne({
        where: {
            nickname: decodeURI(req.cookies.isLogin),
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
            gearid: gearid,
        });
    });
};

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

////////////////////////////////////////////////////////////

exports.gearreviewPage = async (req, res) => {
    console.log(req.query.gearId);
    //본문
    const result1 = await gear.findOne({
        where: {
            gearid: req.query.gearId,
        },
    });
    //query - 사진 이미지 경로 가져오기
    const imgurl = await gear_img.findAll({
        where: {
            gearid: req.query.gearId,
        },
    });

    const urlArray = { urls: [] };
    console.log(imgurl[0]);
    for (let i = 0; i < imgurl.length; i++) {
        urlArray.urls.push(imgurl[i].imgurl);
    }
    console.log(urlArray);
    res.render('gearreview', { gearTitle: result1.gearTitle, gearExplain: result1.gearExplain, writer: result1.writer, imgurl: urlArray });
};

exports.gearreviewEdit = async (req, res) => {
    //쿠키던 세션이던 검증 필요
    if (!req.cookies.isLogin) {
        res.send(`<script type="text/javascript">alert("로그인이 되어있지 않습니다."); window.location = document.referrer; </script>`);
        return;
    }
    const nickname = decodeURI(req.cookies.isLogin);
    //쿠키던 세션이던 저장되어있다고 생각하고 여기선 구현
    res.render('gearreviewedit', { nickname: nickname });
};
