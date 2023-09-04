const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./views/css')); // css폴더 경로 셋팅

// index.ejs
app.get('/', (req, res) => {
    res.render('index');
});

// rent.ejs
app.get('/rent', (req, res) => {
    res.render('rent');
});

// 404 error
app.use('*', (req, res) => {
    res.render('404');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
