const { User } = require('../models')
const bcrypt = require('bcrypt')
//cookie옵션개체
const cookieConfig  = {
    //httpOnly 웹서버를 통해서만 쿠키에 접근 가능 (document.cookie 불가)
    //maxAge :쿠키의 수명 (ms단위)
    //expires : 만료날짜 GMT 시간 설정
    //path 해당 디렉토리와 하위 디렉토리에서만 경로 활성화, 웹브라우저는 해당하는 쿠키만 웹서버에 전송
    //보내고 싶은 쿠키만 보낼 수 있다. default : /
    //domain 쿠키가 전송될 도메인을 특정할 수 있따.
    //secure : 웹브라우저와 웹서버가 https 일경우면 가능
    //signed : 쿠키의 암호화결정 (req.signedCookies 객체에 들어있다고 함)
    httpOnly : true,
    maxAge : 6000 * 1000, //10분
    signed : false,
}
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
        res.cookie('isLogin',result.nickname,cookieConfig)
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
