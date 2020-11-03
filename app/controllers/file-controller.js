const Path = require(`path`);
const File = require('../models').files;
const fs = require('fs').promises;

const upload = require('../helpers/uploud-helper').upload

const {
    errorMessage,
    successMessage,
    status
} = require('../helpers/response-helper.js');


exports.uploadFile = async (req, res) => {
    try {
        await upload(req, res);

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

        const data = await File.create(file);

        successMessage.data = data;
        return res.status(status.success).send(successMessage);

    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.downloadFile = async (req, res) => {
    const storageId = Path.basename(req.params.id);

    try {
        const data = await File.findOne({
            where: {
                storage_id: storageId
            }
        });

        const file = `app/storage/${data.storage_id}`;
        const filename = data.originalname;

        return await res.download(file, filename);

    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.findFile = async (req, res) => {
    const storageId = Path.basename(req.params.id);

    try {
        const data = await File.findOne({
            where: {
                storage_id: storageId
            }
        });

        successMessage.data = {
            filename: data.originalname,
            download_link: `http://localhost:8080/api/files/download/${data.storage_id}`
        };

        return res.status(status.success).send(successMessage);

    } catch (error) {
        errorMessage.error = `File with id=${storageId} do not exists!`;
        return res.status(status.notfound).send(errorMessage);
    }
};

exports.allFiles = async (req, res) => {
    let filesList = [];

    try {
        const data = await File.findAll();

        data.forEach(element => {
            filesList.push({
                filename: element.originalname,
                download_link: `http://localhost:8080/api/files/${element.storage_id}`
            });
        });

        successMessage.data = filesList;
        return res.status(status.success).send(successMessage);

    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.deleteFile = async (req, res) => {
    const storageId = Path.basename(req.params.id);

    try {
        const data = await File.destroy({
            where: {
                storage_id: storageId
            }
        });

        if (data == 1) {
            const file = `app/storage/${storageId}`;

            await fs.unlink(file);

            successMessage.data = 'File was deleted successfully!';
            return res.status(status.success).send(successMessage);

        } else {
            errorMessage.error = `File with id=${storageId} do not exists.`;
            return res.status(status.notfound).send(errorMessage);
        }

    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};