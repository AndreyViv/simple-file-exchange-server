const router = require('express').Router();
const fileRouter = require('./file-router.js');
const userRouter = require('./user-router.js')

router.all('/', (req, res) => {
    res.json({
        message: 'Welcome to FileEx application.'
    });
});

router.use('/api/files', fileRouter);
router.use('/api/users', userRouter);

module.exports = router;