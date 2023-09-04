const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.use(cookieParser());
const cookieConfig = {
    httpOnly: true,
    maxAge: 60 * 1000,
};

app.get('/', (req, res) => {
    console.log(req.cookies);
    res.render('session', { popup: req.cookies.modal });
});
app.post('/setCookie', (req, res) => {
    // 쿠키 생성
    res.cookie('modal', 'hide', cookieConfig);
    res.send({ result: true, msg: '쿠키 생성 완료' });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
