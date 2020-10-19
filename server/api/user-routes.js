const express = require('express');
const router = express.Router();

router.get('/seedsapi/new-user', (req, res) => {
    console.log('Routing works');
})

router.post('/seedsapi/post-video', (req, res) => {
    console.log('Posted video to server');
    console.log(1);
    res.json({ postedVideo: true });
})

module.exports = router;