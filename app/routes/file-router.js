const router = require("express").Router();
const files = require("../controllers/file-controller.js");
const auth = require('../middleware/authentication.js');


router.get('/', files.allFiles);
router.post('/upload', auth, files.uploadFile);
router.get('/:id', files.findFile);
router.delete('/:id', files.deleteFile);
router.get('/download/:id', files.downloadFile);

module.exports = router;