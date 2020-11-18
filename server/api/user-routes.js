const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('./../Models/User');
const uploadImage = require('./../util/uploadImage');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID);

router.post('/c-api/register', uploadImage(), async (req, res) => {
    const userData = JSON.parse(req.body.userData);
    const name = userData.name;
    const email = userData.email;
    const userType = 'creator';
    const premiumUser = false;
    const verified = false;
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
            premiumUser,
            verified
        });
        const savedUser = await newUser.save();

        const msg = {
            to: email, // Change to your recipient
            from: 'tom.osterlund1@gmail.com', // Change to your verified sender
            template_id: 'd-ffccbf1aa6c44b41a4259b7b47037506',
            dynamic_template_data: {
                name: `${name}`,
                _id: String(savedUser._id)
            },
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })


        res.json({registrationSuccess: true});
        
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/verify/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        user.verified = true;
        await user.save();
        res.json({ success: true });
    } catch (error) {
        console.log(error);
    }
})

router.post('/c-api/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ email }).lean();

        if (!user) {
            return res.json({ loginError: 'No user with such an e-mail' });
        }

        
        if (!user.verified) {
            return res.json({ loginError: 'Oops! This account has not yet been verified. Check your email for further instructions.' })
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