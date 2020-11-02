const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('./../Models/User');
const uploadImage = require('./../util/uploadImage');

router.post('/c-api/register', uploadImage(), async (req, res) => {
    const userData = JSON.parse(req.body.userData);
    const name = userData.name;
    const email = userData.email;
    const userType = 'creator';
    const premiumUser = false;
    let imageUrl = 'randomuser.jpg';
    if (req.file) {
        imageUrl = req.file.key
    }
    try {
        // Password encryption
        const password = await bcrypt.hash(userData.password, 10);
        const newUser = new User({
            name,
            email,
            password,
            imageUrl,
            userType,
            premiumUser
        });
        await newUser.save();
        res.json({registrationSuccess: true});
        
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.json({ loginError: 'No user with such an e-mail' });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.json({ loginError: 'The password you entered is incorrect' });
        }
        req.session.user = user;
        return res.json({ loginError: false, userData: req.session.user });
    } catch (error) {
        console.log(error);
    }
})

router.get('/c-api/verified', (req, res) => {
    console.log('User authentication API ran on the server');
    res.json({ sessionUser: req.session.user });
});

router.get('/c-api/signout', (req, res) => {
    console.log('Route hit');
    req.session.destroy();
    res.json({ signoutSuccess: true });
})

module.exports = router;