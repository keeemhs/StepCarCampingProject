exports.indexPage = (req, res) => {
    res.render('index');
};

exports.rentPage = (req, res) => {
    res.render('rent');
};

exports.registPage = (req, res) => {
    res.render('regist');
};

exports.regist = async (req, res) => {
    const { gearTitle, gearExplain, startDate, endDate, rentPossible } = req.body;
};

exports.spotPage = (req, res) => {
    res.render('spot');
};

exports.galleryPage = (req, res) => {
    res.render('gallery');
};

exports.reviewPage = (req, res) => {
    res.render('review');
};
exports.recomCarPage = (req, res) => {
    res.render('recomCar');
};

exports.signupPage = (req, res) => {
    res.render("signup")
}

exports.signinPage = (req, res) => {
    res.render('signin')
}
