const express = require('express');
const router = express.Router();

router.get('/',async (req, res) => {
    let message = `Hey, There!
    Please register using "user/register" path. If you already have a account. please login using "user/login" to continue `
    res.status(200).send(message);
})

module.exports = router