const { User } = require('../models')
const bcrypt = require('bcrypt')
const axios = require('axios')

const REDIRECT_URI = "http://localhost:8000/user/oauth/kakao"; //본인의 리다이렉트 url입력 후 라우트에서도 설정하세요
const REST_API_KEY = "d09187c9ea730ee149f8d9292abffcf9"; //본인 rest api키 입력하시면 됩니다.


//카카오 로그인
exports.signin_kakao = (req, res) => {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(url);
};

//카카오 토큰발급
exports.auth_kakao = async (req, res) => {
    console.log(req.query.code);
    const result = await axios({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        data: {
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code: req.query.code,
        },
    });

    console.log(result.data);
};




//이메일 중복검사
exports.duplication = async (req, res) => {
    const { useremail } = req.body

    const result = await User.findOne({
        where: { useremail }
    })

    if (result === null) {
        res.json({ result: true })
    } else {
        res.json({ result: false })
    }
}

//회원가입
exports.signup = async (req, res) => {
    console.log(req.body)
    const { useremail, pw, birth, username, nickname, levelc, ownc } = req.body
    const hash = await bcryptPassword(pw)
    User.create({ useremail, pw: hash, birth, username, nickname, levelc, ownc }).then(() => {
        res.json({ result: true });
    });
}

//로그인
exports.signin = async (req, res) => {
    const { useremail, pw } = req.body

    const result = await User.findOne({
        where: { useremail }
    })

    if (!result) {
        res.json({ result: false, message: '사용자가 존재하지 않습니다' });
    }
    const compare = comparePassword(pw, result.pw)

    if (compare) {
        res.cookie('isLogin', result.nickname, cookieConfig)
        res.json({ result: true })
    } else {
        res.json({ result: false })
    }
}



/////function
const bcryptPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
const comparePassword = (password, dbPassword) => {
    return bcrypt.compareSync(password, dbPassword);
};
