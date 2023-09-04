const mysql = require('mysql');

const regist = (data, cb) => {
    const query = 'INSERT INTO regist_item (gearTitle, gearExplain, startDate, endDate, rentPossible) VALUES (?,?,?,?,?)';
    conn.query(query, [data.gearTitle, data.gearExplain, data.startDate, endDate, rentPossible], (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('regist', rows);
        cb();
    });
};

module.exports = {
    regist,
};
