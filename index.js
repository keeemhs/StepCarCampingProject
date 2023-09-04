const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models');
const path = require('path'); // path 모듈 추가

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');
app.set('views', './views');

// app.use('/css', express.static(__dirname + '../views')); // css폴더 경로 셋팅
app.use('/static', express.static(path.join(__dirname, 'carCampingProject', 'views')));

// 쿠키
const cookieParser = require('cookie-parser');
const router = require('./routes/main');
app.use(router);

// index.ejs
// app.get('/', (req, res) => {
//     res.render('index');
// });

// rent.ejs
// app.get('/rent', (req, res) => {
//     res.render('rent');
// });

// 404 error
app.use('*', (req, res) => {
    res.render('404');
});

//force:false(default) 테이블이 존재하는 패스, 없으면 생성
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
});
