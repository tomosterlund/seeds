const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('./../Models/User');
const Course = require('./../Models/Course');
const LessonMessage = require('./../Models/interaction/LessonMessage');
const TTLdata = require('./../Models/TTLdata/TTLdata');
const uploadImage = require('./../util/uploadImage');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID);
const deleteMedia = require('./../util/deleteMedia');
const registrationEmailTemplate = require('./../util/emailLanguage/registration-language');
const newEmailTemplate = require('./../util/emailLanguage/new-email');
const resetPasswordTemplate = require('./../util/emailLanguage/reset-password');
const shortid = require('shortid');

router.post('/c-api/register', uploadImage(), async (req, res) => {
    const userData = JSON.parse(req.body.userData);
    const name = userData.name;
    const email = userData.email;
    const lang = userData.lang;
    const verified = false;
    let imageUrl = 'randomuser.png';
    if (req.file) {
        imageUrl = req.file.key
    }
    try {
        // Password encryption
        const password = await bcrypt.hash(userData.password, 10);
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            imageUrl: imageUrl,
            verified: verified,
            language: lang
        });
        const savedUser = await newUser.save();

        const emailTemplate = registrationEmailTemplate(lang);

        const msg = {
            to: email, // Change to your recipient
            from: 'tom.osterlund1@gmail.com', // Change to your verified sender
            template_id: emailTemplate,
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
        let user = await User.findById(userId);
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
        const user = await User.findOne({ email }, {
            name: 1,
            imageUrl: 1,
            _id: 1,
            verified: 1,
            password: 1,
            language: 1
        }).lean();

        const TTLdoc = await TTLdata.findOne({ userEmail: email });
        if (TTLdoc) {
            if (TTLdoc.newPassword === password) {
                req.session.user = user;
                return res.json({ loginError: false, userData: req.session.user });
            }
        }

        if (TTLdoc)

        if (!user) {
            return res.json({ loginError: 'email' });
        }

        
        if (!user.verified) {
            return res.json({ loginError: 'verification' })
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.json({ loginError: 'pw' });
        }

        req.session.user = user;
        return res.json({ loginError: false, userData: req.session.user });
    } catch (error) {
        console.log(error);
    }
})

router.get('/c-api/verified', async (req, res) => {
    console.log('User verification API ran on the server');
    if (req.session.user) {
        const user = await User.findById(req.session.user._id);
        return res.json({ sessionUser: user }); 

    }
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
            language: 1,
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

        if (userData.email !== user.email) {
            const newTTLdoc = new TTLdata({
                userId: userId,
                newEmail: userData.email
            });
            await newTTLdoc.save();

            const emailTemplate = newEmailTemplate(user.language);

            const msg = {
                to: userData.email, // Change to your recipient
                from: 'tom.osterlund1@gmail.com', // Change to your verified sender
                template_id: emailTemplate,
                dynamic_template_data: {
                    userid: `${user._id}`
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
});

router.get('/c-api/verify-new-email/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const TTLdoc = await TTLdata.findOne({ userId: userId });
        
        if (TTLdoc) {
            const user = await User.findById(TTLdoc.userId);
            user.email = TTLdoc.newEmail;
            await user.save();
            await TTLdata.deleteOne({ _id: TTLdoc._id });
            console.log('TTLdoc found');
            console.log(user);

            return res.json({ updateWorked: true, TTLdoc: user });
        }

        return res.json({ queryResult: 'No user found', updateWorked: false });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/reset-password', async (req, res) => {
    const email = req.body.email;
    const rdmStr = shortid.generate();
    const user = await User.findOne({ email: email }).lean();

    if (!user) {
        return res.json({ error: 'Did not find a user with this email' });
    }

    try {
        const newTTLdoc = new TTLdata({
            newPassword: rdmStr,
            userEmail: email
        })
        const postedTTL = await newTTLdoc.save();
        console.log(postedTTL);

        const emailTemplate = resetPasswordTemplate(user.language);

        const msg = {
            to: email,
            from: 'tom.osterlund1@gmail.com',
            template_id: emailTemplate,
            dynamic_template_data: {
                name: `${user.name}`,
                newpassword: rdmStr
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

        res.json({ TTLdocCreated: true });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;