const { gallery, gallery_img, gallery_comment, userLocation, User } = require('../models');
//multer upload용
const aws = require('aws-sdk');
const multers3 = require('multer-s3');
const multer = require('multer');
const path = require('path');

//sequelize Operators

const { Op } = require('sequelize');

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
            if (first == 0 && typeof req.body.title == 'string') {
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
                console.log('galleryid1', galleryid);

                gallery_img.create({
                    galleryid: galleryid,
                    imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gallery/${dateNow}_${path.basename(file.originalname)}`,
                });
                first += 1;
                cb(null, fn); // original 폴더안에다 파일을 저장
            } else {
                setTimeout(() => {
                    var dateNow = Date.now();
                    gallery_img.create({
                        galleryid: galleryid,
                        imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gallery/${dateNow}_${path.basename(file.originalname)}`,
                    });
                    cb(null, `gallery/${dateNow}_${path.basename(file.originalname)}`); // original 폴더안에다 파일을 저장
                }, 50);
            }
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});

//멀터 이용 싱글 테이블 만들기
exports.singleAxios = async (req, res) => {
    const files = uploadSingle.array('array_file');
    console.log('decodeURL', decodeURI(req.cookies.isLogin));
    const user = await User.findOne({
        where: {
            nickname: decodeURI(req.cookies.isLogin),
        },
    });
    console.log(user);
    if (!user) {
        res.send({ result: false, errMessage: '로그인이 종료되었거나, 잘못된 접근입니다.' });
        return;
    }
    userid = user.id;
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
        console.log(galleryid);
        first = 0;
        return res.json({
            galleryid: galleryid,
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
        include: [gallery_comment, userLocation],
        order: [
            [gallery_comment, 'commentGroup', 'asc'],
            [gallery_comment, 'createdAt', 'asc'],
            [userLocation, 'order', 'asc'],
        ],
    });
    if (result1 == null) {
        console.log('none');
        res.render('404');
        return;
    }
    //갤러리의 owner
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
    // imgUrl 저장
    const urlArray = { urls: [] };
    console.log(imgurl[0]);
    for (let i = 0; i < imgurl.length; i++) {
        urlArray.urls.push(imgurl[i].imgurl);
    }

    const comments = [];
    console.log('아마 여기서 멈출듯?');

    let k = 0;
    while (k < result1.gallery_comments.length) {
        const deepcomment = result1.gallery_comments[k].deepComment;
        if (deepcomment >= 0) {
            var tmpObject = { main: '', sub: [] };
            for (let i = k; i <= k + deepcomment; i++) {
                if (i == k) {
                    tmpObject.main = result1.gallery_comments[i];
                } else {
                    tmpObject.sub.push(result1.gallery_comments[i]);
                }
            }
            console.log(tmpObject.sub.length);
            comments.push(tmpObject);
            k = k + deepcomment + 1;
        }
    }
    console.log('아마 여기서 멈출듯?2');
    console.log(result1);
    res.render('review', { userInfo: userInfo, data: result1, comments: comments, imgurl: urlArray });
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
    if (!req.cookies.isLogin) {
        res.send({ errcode: -1, error: '삭제 권한이 없습니다.' });
        return;
    }
    const loginuser = await User.findOne({
        where: {
            nickname: decodeURI(req.cookies.isLogin),
        },
    });
    const owner = await gallery.findOne({
        where: {
            galleryid: req.body.gid,
        },
    });

    if (!loginuser || !owner) {
        res.send({ errcode: -1, error: '삭제 권한이 없습니다.' });
        return;
    }

    if (loginuser.id == owner.userid) {
        const imgurls = gallery_img.findAll({
            where: {
                galleryid: req.body.gid,
            },
        });
        for (let i = 0; i < imgurls.length; i++) {
            const tmpFileName = imgurls[i].split('/');
            const params = {
                Bucket: 'hwr-bucket',
                Key: `/gallery/${tmpFileName[tmpFileName.length - 1]}`,
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

exports.reviewChangeCheck = async (req, res) => {
    console.log('change', req.body);
    const loginuser = await User.findOne({
        where: {
            nickname: decodeURI(req.cookies.isLogin),
        },
    });
    const owner = await gallery.findOne({
        where: {
            galleryid: req.body.gid,
        },
    });

    if (loginuser.id == owner.userid) {
        const reviewInfo = await gallery.findOne({
            where: {
                galleryid: req.body.gid,
            },
        });
        console.log('수정가능');
        res.send({ errcode: 0, error: 'no error', reviewInfo: reviewInfo });
        return;
    } else {
        console.log('삭제실패, 아이디가 다름');
        res.send({ errcode: -1, error: '삭제 권한이 없습니다.' });
    }
};

exports.addMainComment = async (req, res) => {
    //로그인이 안되어있음.
    if (!req.cookies.isLogin) {
        res.send({ errcode: -2, error: '로그인이 되어있지 않습니다.' });
        return;
    }
    const loginuser = await User.findOne({
        where: {
            nickname: decodeURI(req.cookies.isLogin),
        },
    });
    let maxGroup;
    try {
        maxGroup = Number(await gallery_comment.max('commentGroup', { galleryid: req.body.gid })) + 1;
    } catch {
        maxGroup = 0;
    }
    if (maxGroup == null) {
        maxGroup = 0;
    }
    await gallery_comment.create({
        nickName: decodeURI(req.cookies.isLogin),
        commentText: req.body.maincomment,
        commentGroup: maxGroup,
        deepComment: 0,
        galleryid: req.body.gid,
        userid: loginuser.id,
    });
    res.json({ errcode: 0 });
};

exports.addSubComment = async (req, res) => {
    //로그인이 안되어있음.
    if (!req.cookies.isLogin) {
        res.send({ errcode: -2, error: '로그인이 되어있지 않습니다.' });
        return;
    }
    const loginuser = await User.findOne({
        where: {
            nickname: decodeURI(req.cookies.isLogin),
        },
    });

    await gallery_comment.create({
        nickName: decodeURI(req.cookies.isLogin),
        commentText: req.body.subcomment,
        commentGroup: req.body.commentGroup,
        deepComment: -1,
        galleryid: req.body.gid,
        userid: loginuser.id,
    });

    //딥커멘트(대댓글 개수 증가 로직)ㅌ`
    await gallery_comment.increment(
        { deepComment: 1 },
        {
            where: {
                commentGroup: req.body.commentGroup,
                deepComment: {
                    [Op.ne]: -1,
                },
            },
        }
    );
    res.json({ errcode: 0 });
};

exports.sendMapData = async (req, res) => {
    //쿠키던 세션이던 검증 필요
    if (!req.cookies.isLogin) {
        res.send(`<script type="text/javascript">alert("로그인이 되어있지 않습니다."); window.location = document.referrer; </script>`);
        return;
    }
    console.log('getMapData', req.body.markerObject);

    await userLocation.bulkCreate(req.body.markerObject);

    //쿠키던 세션이던 저장되어있다고 생각하고 여기선 구현
    res.send('noerr');
};
exports.deleteComment = async (req, res) => {
    if (!req.cookies.isLogin) {
        res.send({ errcode: -1, error: '삭제 권한이 없습니다.' });
        return;
    }
    const { main, subid } = req.body;
    console.log(main, subid);

    if (subid == -1) {
        const owner = await gallery_comment.findOne({
            where: {
                commentid: main,
            },
        });

        if (decodeURI(req.cookies.isLogin == owner.nickName)) {
            console.log('아이디 같음!', decodeURI(req.cookies.isLogin), owner.nickName);
        } else {
            console.log('아이디 다름!', decodeURI(req.cookies.isLogin), owner.nickName);
            res.send({ errcode: -1, error: '삭제 권한이 없습니다.' });
            return;
        }
    } else {
        const owner = await gallery_comment.findOne({
            where: {
                commentid: subid,
            },
        });

        if (decodeURI(req.cookies.isLogin == owner.nickName)) {
            console.log('아이디 같음!', decodeURI(req.cookies.isLogin), owner.nickName);
        } else {
            console.log('아이디 다름!', decodeURI(req.cookies.isLogin), owner.nickName);
            res.send({ errcode: -1, error: '삭제 권한이 없습니다.' });
            return;
        }
    }

    if (subid != -1) {
        await gallery_comment.destroy({
            where: {
                commentid: subid,
            },
        });
        await gallery_comment.increment(
            { deepComment: -1 },
            {
                where: {
                    commentid: main,
                },
            }
        );
        res.send({ errcode: 0, error: '에러 없음' });
    } else {
        await gallery_comment.update(
            {
                commentText: '삭제되었습니다.',
            },
            {
                where: {
                    commentid: main,
                },
            }
        );
        res.send({ errcode: 0, error: '에러 없음' });
    }
};
