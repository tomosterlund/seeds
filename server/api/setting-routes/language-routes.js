const express = require('express');
const router = express.Router();
const User = require('./../../Models/User');

router.post('/c-api/set-language', async (req, res) => {
    const newLang = req.body.language;
    const sessionUser = req.session.user;
    console.log(newLang);
    try {
        const user = await User.findById(sessionUser._id);
        console.log(user);
        user.language = newLang;
        const updatedUser = await user.save();

        req.session.user = updatedUser;

        res.json({ success: true });
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;