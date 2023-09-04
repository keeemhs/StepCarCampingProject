const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static",express.static(__dirname+"/static"))
app.set('views', './views');

app.use(express.static('./views/css')); // css폴더 경로 셋팅
// 쿠키
const cookieParser = require("cookie-parser")

//gallery 리뷰, 리뷰의 댓글 등등
const galleryRouter = require("./routes/gallery")
app.use("/gallery",galleryRouter)

//스팟 관련 라우터
const spotRouter = require('./routes/spot')
app.use('/spot', spotRouter)
//메인화면, 메인화면에서 어디로 가는가를 정해둔곳. 나중에 mainPage 구현하면 여기에.
const router =require("./routes/main")
app.use(router)

// index.ejs
// app.get('/', (req, res) => {
//     res.render('index');
// });


// rent.ejs
app.get('/rent', (req, res) => {
    res.render('rent');
});

// 404 error
app.use('*', (req, res) => {
    res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
})

