const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models')

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// index.ejs
// app.get('/', (req, res) => {
//     res.render('spot');
// });



const spotRouter = require('./routes/spot')
app.use('/', spotRouter)

// 404 error
app.use('*', (req, res) => {
    res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
})

