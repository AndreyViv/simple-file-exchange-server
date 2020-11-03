const util = require("util");
const multer = require('multer');

const uploader = multer({
    dest: "./app/storage",
});

exports.upload = util.promisify(uploader.single('filedata'));