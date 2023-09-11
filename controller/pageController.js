const { gallery } = require('../models');
const { gear } = require('../models');

exports.indexPage = (req, res) => {
    res.render('index');
};

exports.gearPage = async (req, res) => {
    const result = await gear.findAll({
        attribute: ['gearid', 'gearTitle', 'writer', 'thunmnail'],
        order: [['gearid', 'desc']],
    });
    console.log(result);
    res.render('gear', { data: result });
};

exports.gearreviewPage = (req, res) => {
    res.render('gearreview');
};

exports.spotPage = (req, res) => {
    res.render('spot');
};

exports.galleryPage = async (req, res) => {
    if (req.query.sort_method == undefined || req.query.sort_method == 0) {
        const result = await gallery.findAll({
            attribute: ['galleryid', 'title', 'thunmnail', 'createdAt'],
            order: [['galleryid', 'desc']],
        });
        console.log(result);
        res.render('gallery', { data: result });
    } else if (req.query.sort_method == 1) {
        const result = await gallery.findAll({
            attribute: ['galleryid', 'title', 'views', 'thunmnail', 'createdAt'],
            order: [['views', 'DESC']],
        });
        console.log(result);
        res.render('gallery', { data: result });
    }
};

exports.reviewPage = (req, res) => {
    res.render('review');
};

exports.recomCarPage = (req, res) => {
    res.render('recomCar');
};

exports.signupPage = (req, res) => {
    res.render('signup');
};

exports.signinPage = (req, res) => {
    res.render('signin');
};
