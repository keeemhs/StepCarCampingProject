const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models');
const path = require('path'); // path 모듈 추가
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const SocketIO = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = SocketIO(server);

app.use(bodyParser.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');
app.set('io', io);
app.set('views', './views');

app.use(express.static(__dirname + '/views/css')); // css폴더 경로 셋팅
app.use(express.static(__dirname + '/views/js')); // js폴더 경로 셋팅
app.use(express.static(__dirname + '/views/img')); // img폴더 경로 셋팅

// app.use('/css', express.static(__dirname + '../views')); // css폴더 경로 셋팅
app.use('/static', express.static(path.join(__dirname, 'carCampingProject', 'views')));

//gallery 리뷰, 리뷰의 댓글 등등
const galleryRouter = require('./routes/gallery');
app.use('/gallery', galleryRouter);

//gear
const gearRouter = require('./routes/gear');
app.use('/gear', gearRouter);

//스팟 관련 라우터
const spotRouter = require('./routes/spot');
spotRouter.io(io);
app.use('/spot', spotRouter);

const user = require('./routes/user');
app.use('/user', user);

const router = require('./routes/main');
app.use(router);

//이메일 전송
const email = require('./routes/email');
app.use('/email', email);

// recomCar.ejs
app.get('/recomCar', (req, res) => {
    res.render('recomCar');
});

// 404 error
app.use('*', (req, res) => {
    res.render('404');
});

db.sequelize
    .sync({
        force: false,
    })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    });
