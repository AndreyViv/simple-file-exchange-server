const router = require('express').Router();
const fileRouter = require('./file-router.js');

router.all('/', (req, res) => {
    res.json({
        message: 'Welcome to FileEx application.'
    });
});

router.use('/api/files', fileRouter)

module.exports = router;