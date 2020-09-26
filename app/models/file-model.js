module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define('files', {
        originalname: {
            type: Sequelize.STRING
        },
        storage_id: {
            type: Sequelize.STRING
        }
    });

    return File;
};