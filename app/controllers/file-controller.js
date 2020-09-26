const Path = require(`path`);
const File = require('../models').files;
const fs = require('fs');

exports.uploadFile = (req, res) => {
    if (!req.file) {
        res.status(400).send({
            message: 'Request has no file!'
        });
        return;
    }

    const file = {
        originalname: req.file.originalname,
        storage_id: req.file.filename
    };

    File.create(file)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Some error occurred while uploading the File.'
            });
        });
};

exports.downloadFile = (req, res) => {
    const storageId = Path.basename(req.params.id);

    File.findOne({
            where: {
                storage_id: storageId
            }
        })
        .then(data => {
            const file = `app/storage/${data.storage_id}`;
            const filename = data.originalname;

            res.download(file, filename);
        })
        .catch(err => {
            res.status(500).send({
                message: `Error in downloading File with id=${storageId}`
            });
        });
};

exports.findFile = (req, res) => {
    const storageId = Path.basename(req.params.id);

    File.findOne({
            where: {
                storage_id: storageId
            }
        })
        .then(data => {
            const filename = data.originalname;
            const link = `http://localhost:8080/api/files/download/${data.storage_id}`;

            res.send({
                filename: filename,
                link: link
            });
        })
        .catch(err => {
            res.status(500).send({
                message: `File with id=${storageId} do not exists!`
            });
        });
};

exports.allFiles = (req, res) => {
    File.findAll()
        .then(data => {
            let filesList = [];

            data.forEach(element => {
                let filename = element.originalname;
                let link = `http://localhost:8080/api/files/${element.storage_id}`;

                filesList.push({
                    filename: filename,
                    link: link
                });
            });

            res.send(filesList);
        })
        .catch(err => {
            res.status(500).send({
                message: err
            });
        });
};

exports.deleteFile = (req, res) => {
    const storageId = Path.basename(req.params.id);

    File.destroy({
            where: {
                storage_id: storageId
            }
        })
        .then(data => {
            if (data == 1) {
                const file = `app/storage/${storageId}`;
                fs.unlink(file, () => {
                    res.send({
                        message: 'File was deleted successfully!'
                    });
                });
            } else {
                res.send({
                    message: `File with id=${storageId} do not exists.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete Tutorial with id=${storageId}\n${err}`
            });
        });
};