const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('./../Models/User');
const Course = require('./../Models/Course');
const LessonMessage = require('./../Models/interaction/LessonMessage')
const uploadImage = require('./../util/uploadImage');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID);
const deleteMedia = require('./../util/deleteMedia');

router.post('/c-api/register', uploadImage(), async (req, res) => {
    const userData = JSON.parse(req.body.userData);
    const name = userData.name;
    const email = userData.email;
    const userType = 'creator';
    const premiumUser = false;
    const verified = false;
    let imageUrl = 'randomuser.png';
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
    console.log('User verification API ran on the server');
    res.json({ sessionUser: req.session.user });
});

router.get('/c-api/signout', (req, res) => {
    req.session.destroy();
    res.json({ signoutSuccess: true });
});

router.get('/c-api/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId, {
            name: 1,
            email: 1,
            imageUrl: 1,
            _id: 0
        }).lean();
        res.json({ user: user });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/edit-user/:userId', uploadImage(), async (req, res) => {
    const userId = req.params.userId;
    const userData = JSON.parse(req.body.userData);
    try {
        const user = await User.findById(userId);
        user.name = userData.name;
        
        // User-doc update
        if (req.file) {
            await deleteMedia(user.imageUrl);
            user.imageUrl = req.file.key;
        }

        if (userData.email) {
            user.email = userData.email;
        }
        
        if (userData.password) {
            const password = await bcrypt.hash(userData.password, 10);
            user.password = password;
        }

        const savedUser = await user.save();

        // Courses update
        if (req.file) {
            await Course.updateMany({ authorId: userId }, { $set: { authorImageUrl: req.file.key, authorName: userData.name } })
        } else if (!req.file) {
            await Course.updateMany({ authorId: userId }, { $set: { authorName: userData.name } })
        }
        
        res.json({ savedData: true, userData: savedUser });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;