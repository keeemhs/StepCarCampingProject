const { Spot, gallery } = require('../models');
const { gear } = require('../models');

exports.indexPage = async (req, res) => {
    const result = await Spot.findAll();
    console.log(result[0]);
    res.render('index', { result });
};
exports.gearPage = async (req, res) => {
    if (req.query.category == undefined || req.query.category == 0) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
        });
        console.log(result);
        res.render('gear', { data: result });
    } else if (req.query.category == 1) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
            where: {
                category: req.query.category,
            },
        });
        console.log(result);
        res.render('gear', { data: result });
    } else if (req.query.category == 2) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
            where: {
                category: req.query.category,
            },
        });
        console.log(result);
        res.render('gear', { data: result });
    } else if (req.query.category == 3) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
            where: {
                category: req.query.category,
            },
        });
        console.log(result);
        res.render('gear', { data: result });
    } else if (req.query.category == 4) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
            where: {
                category: req.query.category,
            },
        });
        console.log(result);
        res.render('gear', { data: result });
    } else if (req.query.category == 5) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
            where: {
                category: req.query.category,
            },
        });
        console.log(result);
        res.render('gear', { data: result });
    } else if (req.query.category == 6) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
            where: {
                category: req.query.category,
            },
        });
        console.log(result);
        res.render('gear', { data: result });
    } else if (req.query.category == 7) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
            where: {
                category: req.query.category,
            },
        });
        console.log(result);
        res.render('gear', { data: result });
    } else if (req.query.category == 8) {
        const result = await gear.findAll({
            attribute: ['gearid', 'gearTitle', 'writer', 'category', 'thunmnail'],
            order: [['gearid', 'desc']],
            where: {
                category: req.query.category,
            },
        });
        console.log(result);
        res.render('gear', { data: result });
    }
};

exports.gearreviewPage = (req, res) => {
    res.render('gearreview');
};

exports.spotPage = (req, res) => {
    //쿠키를 불러와서
    //익명으로 하시던, 그냥 저장된 닉네임불러와서 하시던 논리가 있ㅇ믄 OK
    //익명
    res.render('spot');
};

exports.galleryPage = async (req, res) => {
    console.log('지역', req.query.sort_method, req.query.regions);
    if ((req.query.sort_method == undefined || req.query.sort_method == 0) && (req.query.regions == 0 || req.query.regions == undefined)) {
        console.log(1);
        const result = await gallery.findAll({
            attribute: ['galleryid', 'title', 'thunmnail', 'createdAt'],
            order: [['galleryid', 'desc']],
        });
        res.render('gallery', { data: result });
    } else if ((req.query.sort_method == undefined || req.query.sort_method == 0) && req.query.regions > 0) {
        console.log(2);
        const result = await gallery.findAll({
            attribute: ['galleryid', 'title', 'thunmnail', 'createdAt'],
            order: [['galleryid', 'desc']],
            where: {
                region: req.query.regions,
            },
        });
        res.render('gallery', { data: result });
    } else if (req.query.sort_method == 1 && (req.query.regions == 0 || req.query.regions == undefined)) {
        console.log(3);
        const result = await gallery.findAll({
            attribute: ['galleryid', 'title', 'views', 'thunmnail', 'createdAt'],
            order: [['views', 'DESC']],
        });
        res.render('gallery', { data: result });
    } else {
        console.log(4);
        const result = await gallery.findAll({
            attribute: ['galleryid', 'title', 'views', 'thunmnail', 'createdAt'],
            order: [['views', 'DESC']],
            where: {
                region: req.query.regions,
            },
        });
        res.render('gallery', { data: result });
    }
};

exports.reviewPage = (req, res) => {
    res.render('review');
};

exports.recomCarPage = (req, res) => {
    res.render('recomCar');
};
