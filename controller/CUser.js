const { gallery, gallery_img, gallery_comment, userLocation, User, gear } = require('../models');
const bcrypt = require('bcrypt');

const axios = require('axios');

const REDIRECT_URI = 'http://54.206.192.249/user/oauth/kakao'; //본인의 리다이렉트 url입력 후 라우트에서도 설정하세요
const REST_API_KEY = 'd09187c9ea730ee149f8d9292abffcf9'; //본인 rest api키 입력하시면 됩니다.

// //cookie옵션개체
const cookieConfig = {
    //httpOnly 웹서버를 통해서만 쿠키에 접근 가능 (document.cookie 불가)
    //maxAge :쿠키의 수명 (ms단위)
    //expires : 만료날짜 GMT 시간 설정
    //path 해당 디렉토리와 하위 디렉토리에서만 경로 활성화, 웹브라우저는 해당하는 쿠키만 웹서버에 전송
    //보내고 싶은 쿠키만 보낼 수 있다. default : /
    //domain 쿠키가 전송될 도메인을 특정할 수 있따.
    //secure : 웹브라우저와 웹서버가 https 일경우면 가능
    //signed : 쿠키의 암호화결정 (req.signedCookies 객체에 들어있다고 함)
    httpOnly: true,
    maxAge: 6000 * 1000, //1000분
    signed: false,
};

const trashCookie = {
    httpOnly: false,
    maxAge: 6000 * 1000, //1000분
    signed: false,
};

//카카오 인가코드 받기
exports.signin_kakao = (req, res) => {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(url);
};

//카카오 토큰발급
exports.auth_kakao = async (req, res) => {
    if (req.cookies.kakaoToken) {
        res.render('signinMiddle', {
            result: false,
        });
    } else {
        const result = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
                grant_type: 'authorization_code',
                client_id: REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code: req.query.code,
            },
        });
        const token = result.data.access_token;
        res.render('signinMiddle', {
            result: true,
            token: token,
        });
    }
};

//로그인
exports.login = (req, res) => {
    if (req.cookies.isLogin) {
        res.send(`<script type="text/javascript">alert("로그인이 되어있습니다."); window.location = document.referrer; </script>`);
        return;
    }
    console.log(req.cookies.isLoginKakao);
    console.log(req.cookies.isLogin);
    var kakaoCookie = '';
    var cookie = '';
    if (req.cookies.isLoginKakao === undefined) {
        kakaoCookie = false;
    }

    if (req.cookies.isLogin === undefined) {
        cookie = false;
    }
    res.render('signin', {
        kakaoCookie: kakaoCookie,
        cookie: cookie,
    });
};

//카카오 로그인
exports.postToken = async (req, res) => {
    console.log(req.body.token);
    const kakaoUser = await axios({
        method: 'GET',
        url: `https://kapi.kakao.com/v2/user/me`,
        data: '',
        headers: {
            Authorization: `Bearer ${req.body.token}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
    });
    // console.log(kakaoUser.data)
    // res.render('index')
    const kakaoEmail = kakaoUser.data.kakao_account.email;
    const nickname = kakaoUser.data.properties.nickname;
    const result = await User.findOne({
        where: {
            useremail: kakaoEmail,
        },
    });
    console.log(nickname);
    //로그인 성공
    if (result !== null) {
        res.cookie('isLoginKakao', nickname, cookieConfig);
        res.cookie('isLogin', result.nickname, cookieConfig);
        res.cookie('isTrash', 'adfasdfsdfsdfdsfdsfadfasdfs', trashCookie);
        res.json({
            result: true,
        });
    } else {
        //사용자 추가정보 입력요구(회원가입 페이지)
        res.json({
            useremail: kakaoEmail,
            nickname: result.nickname,
            result: false,
        });
    }
};

//이메일 중복검사
exports.duplication = async (req, res) => {
    const { useremail } = req.body;

    const result = await User.findOne({
        where: {
            useremail,
        },
    });

    if (result === null) {
        res.json({
            result: true,
        });
    } else {
        res.json({
            result: false,
        });
    }
};

//닉네임 중복검사
exports.duplicationNickname = async (req, res) => {
    const { nickname } = req.body;

    const result = await User.findOne({
        where: {
            nickname,
        },
    });

    if (result === null) {
        res.json({
            result: true,
        });
    } else {
        res.json({
            result: false,
        });
    }
};
//회원가입
exports.signup = (req, res) => {
    res.render('signup');
};
//회원가입
exports.signupPost = async (req, res) => {
    console.log(req.body);
    const { useremail, pw, birth, username, nickname, levelc, ownc } = req.body;
    const hash = await bcryptPassword(pw);
    User.create({
        useremail,
        pw: hash,
        birth,
        username,
        nickname,
        levelc,
        ownc,
    }).then(() => {
        res.json({
            result: true,
        });
    });
};

//로그인 동작
exports.signin = async (req, res) => {
    const { useremail, pw } = req.body;
    console.log(useremail, pw);
    const result = await User.findOne({
        where: {
            useremail,
        },
    });

    if (result === null) {
        return res.json({
            result: false,
            message: '사용자가 존재하지 않습니다',
        });
    }

    const compare = comparePassword(pw, result.pw);

    if (compare) {
        res.cookie('isLogin', result.nickname, cookieConfig);
        res.cookie('isTrash', 'adfsdfdsfsdfsdfdsfsdasg', trashCookie);
        res.json({
            result: true,
        });
    } else {
        res.json({
            result: false,
            message: '비밀번호가 틀렸습니다',
        });
    }
};

//로그아웃 get
exports.logout = (req, res) => {
    res.render('logout');
};

exports.logoutMiddle = (req, res) => {
    res.render('logoutMiddle');
};

//로그아웃
exports.logoutMiddlePost = async (req, res) => {
    const url = 'https://kapi.kakao.com/v1/user/unlink';

    //일반 로그아웃
    if (req.body.token === null) {
        res.clearCookie('isLogin');
        res.clearCookie('isTrash');
        res.json({
            result: true,
        });
    } else {
        const result = await axios({
            method: 'POST',
            url: url,
            headers: {
                Authorization: `Bearer ${req.body.token}`,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        });
        if (result !== null) {
            res.clearCookie('isLoginKakao');
            res.clearCookie('isLogin');
            res.clearCookie('isTrash');
            res.json({
                result: true,
            });
        } else {
            res.json({
                result: false,
            });
        }
    }
};

//회원탈퇴 get
exports.deleteUser = (req, res) => {
    console.log(decodeURI(req.cookies.isLoginKakao));
    if (req.cookies.isLoginKakao === undefined) {
        res.render('deleteUser', {
            cookie: req.cookies.isLogin,
        });
    } else {
        res.render('deleteUser', {
            cookie: decodeURI(req.cookies.isLoginKakao),
        });
    }
};

//회원탈퇴 delete
exports.deleteUserPost = async (req, res) => {
    if (req.cookies.isLoginKakao === undefined) {
        const { nickname, id } = req.body;
        gallery.destroy({
            where: { userid: id },
        });

        gear.destroy({
            where: { writer: nickname },
        });

        User.destroy({
            where: {
                id: id,
            },
        }).then(() => {
            res.clearCookie('isLogin');
            res.json({
                result: true,
            });
        });
    } else {
        const result = await axios({
            method: 'POST',
            url: 'https://kapi.kakao.com/v1/user/unlink',
            headers: {
                Authorization: `Bearer ${req.body.token}`,
                'Content-type': 'application/x-www-form-urlencoded',
            },
        });
        console.log('result', result);
        if (result !== null) {
            const { nickname, id } = req.body;
            gallery.destroy({
                where: { userid: id },
            });

            gear.destroy({
                where: { writer: nickname },
            });

            User.destroy({
                where: {
                    id: id,
                },
            }).then(() => {
                res.clearCookie('isLoginKakao');
                res.clearCookie('isLogin');
                res.clearCookie('isTrash');
                res.json({
                    result: true,
                });
            });
        }
    }
};

exports.mypage = async (req, res) => {
    if (req.cookies.isLoginKakao === undefined) {
        const usercookie = req.cookies.isLogin;
        const result = await User.findOne({
            where: { nickname: decodeURI(usercookie) },
        });
        const galleryList = await gallery.findAll({
            where: { userid: result.id },
        });
        const gearList = await gear.findAll({
            where: { writer: result.nickname },
        });
        res.render('mypage', {
            user: result,
            galleryList: galleryList,
            galleryListLength: galleryList.length,
            gearList: gearList,
            gearListLength: gearList.length,
        });
    } else {
        const usercookie = req.cookies.isLogin;
        const result = await User.findOne({
            where: { nickname: decodeURI(usercookie) },
        });
        const galleryList = await gallery.findAll({
            where: { userid: result.id },
        });
        const gearList = await gear.findAll({
            where: { writer: result.nickname },
        });
        res.render('mypage', {
            user: result,
            galleryList: galleryList,
            galleryListLength: galleryList.length,
            gearList: gearList,
            gearListLength: gearList.length,
        });
    }
};
//유저 체크하는 새창

exports.checkpw = async (req, res) => {
    res.render('checker');
};
exports.checkpwvalid = async (req, res) => {
    console.log('valid');
    const result = await User.findOne({
        where: {
            nickname: decodeURI(req.cookies.isLogin),
        },
    });

    if (result === null) {
        return res.json({ result: false });
    }
    console.log(result.pw);
    const compare = comparePassword(req.body.pw, result.pw);
    console.log('compare', compare);
    if (compare) {
        res.send({ result: true });
        return;
    } else {
        res.json({ result: false });
        return;
    }
    //회원가입을 심각하게 침범해서 일단 정지
};
exports.changePassword = async (req, res) => {
    const password = bcryptPassword(req.body.password);

    await User.update(
        {
            pw: password,
        },
        {
            where: {
                nickname: decodeURI(req.cookies.isLogin),
            },
        }
    );
    res.send({ data: 'true' });
};
exports.mypagePatch = async (req, res) => {
    if (req.cookies.isLoginKakao === undefined) {
        usercookie = req.cookies.isLogin;
        const result = await User.findOne({
            where: { nickname: decodeURI(usercookie) },
        });
        res.render('userPatch', { user: result });
    } else {
        res.render('userPatch', {
            user: false,
            nickname: decodeURI(req.cookies.isLoginKakao),
        });
    }
};

//마이페이지 수정(닉네임 -> 카카오 로그인일때는 수정불가)
exports.mypagePatchPost = async (req, res) => {
    const { patchnickname, id } = req.body;
    const result = await User.update({ nickname: patchnickname }, { where: { id: id } });
    if (result) {
        res.clearCookie('isLogin');
        res.cookie('isLogin', patchnickname, cookieConfig);
        res.json({
            result: true,
        });
    } else {
        res.json({
            result: false,
            message: '수정을 실패했습니다',
        });
    }
};

exports.changeUserInfo = (req, res) => {
    res.render('changeuserinfo');
};

exports.changeUserInfo2 = async (req, res) => {
    console.log(req.body);
    await User.update(
        {
            nickname: req.body.nickname,
            levelc: req.body.level,
            ownc: req.body.own,
        },
        {
            where: {
                nickname: req.cookies.isLogin,
            },
        }
    );
    res.clearCookie('isLogin');
    res.cookie('isLogin', encodeURI(req.body.nickname), cookieConfig);
    res.json({ data: 'true' });
};

/////비밀번호 암호화
const bcryptPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
const comparePassword = (password, dbPassword) => {
    return bcrypt.compareSync(password, dbPassword);
};

//마이페이지 수정(닉네임 -> 카카오 로그인일때는 수정불가)
exports.mypagePatch = async (req, res) => {
    const { patchnickname, id } = req.body;
    const result = await User.update(
        {
            nickname: patchnickname,
        },
        {
            where: {
                id: id,
            },
        }
    );
    if (result) {
        res.clearCookie('isLogin');
        res.cookie('isLogin', patchnickname, cookieConfig);
        res.json({
            result: true,
        });
    } else {
        res.json({
            result: false,
            message: '수정을 실패했습니다',
        });
    }
};
