const { User } = require('../models')
const bcrypt = require('bcrypt')

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
