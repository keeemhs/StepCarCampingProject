const { Gear } = require('../models');

exports.post_regist = async (req, res) => {
    const { gearTitle, gearExplain, startDate, endDate, rentPossible } = req.body;

    Gear.create({ gearTitle, gearExplain, startDate, endDate, rentPossible }).then(() => {
        res.json({ result: true });
    });
    try {
        const { gearTitle, gearExplain, startDate, endDate, rentPossible } = req.body;
        const result = await Gear.create({
            gearTitle,
            gearExplain,
            startDate,
            endDate,
            rentPossible,
        });
        if (result) {
            res.json({ result: true });
        }
    } catch (error) {
        console.log(error);
    }
};
