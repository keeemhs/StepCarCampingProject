const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models');
const path = require('path'); // path 모듈 추가

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(__dirname + '/views/css')); // css폴더 경로 셋팅
app.use(express.static(__dirname + '/views/js')); // js폴더 경로 셋팅
app.use(express.static(__dirname + '/views/img')); // img폴더 경로 셋팅

// app.use('/css', express.static(__dirname + '../views')); // css폴더 경로 셋팅
app.use('/static', express.static(path.join(__dirname, 'carCampingProject', 'views')));

// 쿠키
const cookieParser = require('cookie-parser');


//gallery 리뷰, 리뷰의 댓글 등등
const galleryRouter = require("./routes/gallery")
app.use("/gallery",galleryRouter)

//스팟 관련 라우터
const spotRouter = require('./routes/spot')
app.use('/spot', spotRouter)

const router = require("./routes/main")
app.use(router)


// index.ejs
// app.get('/', (req, res) => {
//     res.render('index');
// });

// recomCar.ejs
app.get('/recomCar', (req, res) => {
    res.render('recomCar');
});

// rent.ejs
// app.get('/rent', (req, res) => {
//     res.render('rent');
// });

// 404 error
app.use('*', (req, res) => {
    res.render('404');
});

db.sequelize
    .sync({
        force: false,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    });