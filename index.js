const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static",express.static(__dirname+"/static"))
// 쿠키
const cookieParser = require("cookie-parser")
const router =require("./routes/main")
app.use(router)


// index.ejs
// app.get('/', (req, res) => {
//     res.render('index');
// });


// 404 error
app.use('*', (req, res) => {
    res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
})

