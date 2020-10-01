const users = require("../controllers/user-controller.js");
const auth = require('../middleware/authentication.js');
const router = require("express").Router();


router.post('/signup', users.createUser);
router.post('/signin', users.signInUser);
router.get('/all', auth, users.allUsersList);
router.get('/user/:id', auth, users.retrieveUser);
router.put('/user/:id', auth, users.editUser);
router.delete('/user/:id', auth, users.deleteUser);

// Don`t use in production! Only for testing APIs functionality
router.post('/adminfather', users.createAdminFather);
router.get('/adminfather', users.signInAdminFather);

module.exports = router;