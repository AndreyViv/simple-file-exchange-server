const multer = require('multer');
const router = require("express").Router();
const files = require("../controllers/file-controller.js");


const uploader = multer({
    dest: "./app/storage"
});

router.get('/', files.allFiles);
router.post('/upload', uploader.single('filedata'), files.uploadFile);
router.get('/:id', files.findFile);
router.delete('/:id', files.deleteFile);
router.get('/download/:id', files.downloadFile);

module.exports = router;