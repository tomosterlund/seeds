const express = require('express');
const router = express.Router();
const Issue = require('./../../Models/userFeedback/issueReport');

router.post('/c-api/issue-report', async (req, res) => {
    const userData = req.body;
    const userEmail = userData.email;
    const browser = userData.browser;
    const issue = userData.issue;    

    try {
        const newIssue = new Issue({
            userEmail,
            browser,
            issue
        });
        await newIssue.save();
        res.json({ filedIssue: true });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;