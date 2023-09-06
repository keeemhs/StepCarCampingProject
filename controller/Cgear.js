const { Gear } = require('../models');
//multer upload용
const aws = require('aws-sdk');
const multers3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const { getDefaultResultOrder } = require('dns');

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
var galleryid = 0;
var first = 0;
const upload = multer({
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
                const gearEdit = await Gear.create({
                    gearid: gearid,
                    gearTitle: req.body.gearTitle,
                    gearExplain: req.body.gearExplain,
                    thunmnail: fn,
                });
                gearid = gearEdit.gearid;
                console.log('gearid', gearid);

                gear_img.create({
                    gearid: gearid,
                    imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gear/${dateNow}_${path.basename(file.originalname)}`,
                });
                first += 1;
                cb(null, fn); // original 폴더안에다 파일을 저장
            } else {
                var dateNow = Date.now();
                gear.create({
                    gearid: gearid,
                    imgurl: `https://hwr-bucket.s3.ap-northeast-2.amazonaws.com/gear/${dateNow}_${path.basename(file.originalname)}`,
                });
                cb(null, `gear/${dateNow}_${path.basename(file.originalname)}`); // original 폴더안에다 파일을 저장
            }
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
//멀터 셋팅 끝!

//멀터 이용
exports.multipleAxios = (req, res) => {
    const files = upload.array('gearImage');

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

exports.post_regist = async (req, res) => {
    const { gearTitle, gearExplain } = req.body;

    Gear.create({ gearTitle, gearExplain }).then(() => {
        res.json({ result: true });
    });
};

exports.regist = upload.single('gearImage', async (req, res) => {
    try {
        const { gearTitle, gearExplain } = req.body;
        const imagePath = req.file.location; // AWS S3에서 이미지 URL을 가져옴

        const result = await Gear.create({
            gearTitle,
            gearExplain,
            gearImage: imagePath, // 데이터베이스에 이미지 URL 저장
        });

        if (result) {
            res.json({ result: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: false, error: 'Image upload failed' });
    }
});
