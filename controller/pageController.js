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

exports.galleryPage= async (req,res)=>{
    if(req.query.sort_method==undefined || req.query.sort_method==0 ){
        const result = await gallery.findAll(
        {
            attribute : ["galleryid",'title','thunmnail','createdAt'],
            order: [
                ['galleryid', 'desc'],
            ]
        })
        console.log(result)
        res.render("gallery",{data : result})
    }else if(req.query.sort_method==1){
        const result = await gallery.findAll(
            {
                attribute : ["galleryid",'title','views','thunmnail','createdAt'],
                order: [
                    ['views', 'DESC'],
                ]
            })
            console.log(result)
            res.render("gallery",{data : result})
    }

}
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
