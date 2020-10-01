const Path = require(`path`);
const User = require('../models').users;
const UniqueConstraintError = require('sequelize').UniqueConstraintError;


const {
    hashPassword,
    comparePassword,
    validatePassword,
    validateEmail,
    generateUserToken
} = require('../helpers/validation-helper.js');

const {
    errorMessage,
    successMessage,
    status
} = require('../helpers/response-helper.js');


// Don`t use in production! Only for testing APIs functionality
exports.createAdminFather = async (req, res) => {
    const hashedPassword = hashPassword('superpass');
    const adminFather = {
        email: 'admin-father@gmail.com',
        password: hashedPassword,
        first_name: 'Father',
        last_name: 'Admins',
        is_admin: true
    };

    try {
        const data = await User.create(adminFather);
        const token = generateUserToken(data.email, data.id, data.is_admin, data.first_name, data.last_name);

        successMessage.data = {
            id: data.id,
            email: data.email,
            firstname: data.first_name,
            lastname: data.last_name,
            token: token
        };

        return res.status(status.created).send(successMessage);
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            errorMessage.error = 'Admin Father already exist';
            return res.status(status.conflict).send(errorMessage);
        }

        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

// Don`t use in production! Only for testing APIs functionality
exports.signInAdminFather = async (req, res) => {
    const adminFatherEmail = 'admin-father@gmail.com';

    try {
        const data = await User.findOne({
            where: {
                email: adminFatherEmail
            }
        });

        if (data === null) {
            errorMessage.error = `Admin Father do not exists`;
            return res.status(status.notfound).send(errorMessage);
        }

        const token = generateUserToken(data.email, data.id, data.is_admin, data.first_name, data.last_name);

        successMessage.data = {
            id: data.id,
            email: data.email,
            firstname: data.first_name,
            lastname: data.last_name,
            token: token
        };

        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.createUser = async (req, res) => {
    const email = req.body.email.toLowerCase(),
        password = req.body.password;

    if (!validateEmail(email)) {
        errorMessage.error = 'Please enter a valid Email';
        return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)) {
        errorMessage.error = 'Password must be more than 4 characters';
        return res.status(status.bad).send(errorMessage);
    }

    const hashedPassword = hashPassword(password);
    const user = {
        email: email,
        password: hashedPassword,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
    };

    try {
        const data = await User.create(user);
        const token = generateUserToken(data.email, data.id, data.is_admin, data.first_name, data.last_name);

        successMessage.data = {
            id: data.id,
            email: data.email,
            firstname: data.first_name,
            lasrname: data.last_name,
            token: token
        };

        return res.status(status.created).send(successMessage);
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            errorMessage.error = `User with email: ${email} already exist`;
            return res.status(status.conflict).send(errorMessage);
        }

        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.signInUser = async (req, res) => {
    const email = req.body.email.toLowerCase(),
        password = req.body.password;

    if (!validateEmail(email) || !validatePassword(password)) {
        errorMessage.error = 'Please enter a valid Email or Password';
        return res.status(status.bad).send(errorMessage);
    }

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (user === null) {
            errorMessage.error = `User with email: ${email} do not exists`;
            return res.status(status.notfound).send(errorMessage);
        }

        if (!comparePassword(user.password, password)) {
            errorMessage.error = 'Incorrect Password';
            return res.status(status.bad).send(errorMessage);
        }

        const token = generateUserToken(user.email, user.id, user.is_admin, user.first_name, user.last_name);

        successMessage.data = {
            id: user.id,
            email: user.email,
            firstname: user.first_name,
            lasrname: user.last_name,
            token: token
        };

        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.retrieveUser = async (req, res) => {
    const retrievedUserId = Path.basename(req.params.id);

    if (req.user.id != retrievedUserId && !req.user.admin) {
        errorMessage.error = 'You can`t retrive this User';
        return res.status(status.unauthorized).send(errorMessage);
    }

    try {
        const data = await User.findOne({
            where: {
                id: retrievedUserId
            }
        });

        if (data === null) {
            errorMessage.error = `User with id: ${retrievedUserId} do not exists`;
            return res.status(status.notfound).send(errorMessage);
        }

        successMessage.data = {
            id: data.id,
            email: data.email,
            firstname: data.first_name,
            lastname: data.last_name,
            admin: data.is_admin
        }

        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.editUser = async (req, res) => {
    const editedUserId = Path.basename(req.params.id);

    if (!req.body.email && !req.body.newpassword && !req.body.firstname && !req.body.lastname && !req.body.admin) {
        errorMessage.error = 'The request has no properties allowed to change';
        return res.status(status.bad).send(errorMessage);
    }

    if (req.body.email || req.body.newpassword || req.body.firstname || req.body.lastname) {
        if (req.user.id != editedUserId) {
            errorMessage.error = 'You can`t edit this properties';
            return res.status(status.unauthorized).send(errorMessage);
        }
    }

    if (req.body.admin === true && !req.user.admin) {
        errorMessage.error = 'Only Admins may update other users to Admin';
        return res.status(status.unauthorized).send(errorMessage);
    }

    try {
        const data = await User.findOne({
            where: {
                id: editedUserId
            }
        });

        if (data === null) {
            errorMessage.error = `User with id: ${editedUserId} do not exists`;
            return res.status(status.notfound).send(errorMessage);
        }

        if (req.body.email) {
            const newEmail = req.body.email.toLowerCase();
            const similarEmailUser = await User.findOne({
                where: {
                    email: newEmail
                }
            });

            if (similarEmailUser !== null) {
                errorMessage.error = `User with email: ${newEmail} already exist`;
                return res.status(status.conflict).send(errorMessage);
            }

            data.email = newEmail;
        }

        if (req.body.newpassword) {
            const oldPassword = req.body.password;
            const newPassword = req.body.newpassword;

            if (!comparePassword(data.password, oldPassword)) {
                errorMessage.error = `Incorrect old Password`;
                return res.status(status.bad).send(errorMessage);
            }

            if (!validatePassword(newPassword)) {
                errorMessage.error = 'Invalid new password. The password must be more than 4 characters.';
                return res.status(status.bad).send(errorMessage);
            }

            data.password = hashPassword(newPassword);
        }

        if (req.body.firstname) {
            data.first_name = req.body.firstname;
        }

        if (req.body.lastname) {
            data.last_name = req.body.lastname;
        }

        if (req.body.admin === true) {
            data.is_admin = true;
        }

        await data.save();

        successMessage.data = 'User updated successful';
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.deleteUser = async (req, res) => {
    const deletedUserId = Path.basename(req.params.id);

    if (req.user.id != deletedUserId && !req.user.admin) {
        errorMessage.error = 'You can`t delete this Users';
        return res.status(status.unauthorized).send(errorMessage);
    }

    try {
        const data = await User.destroy({
            where: {
                id: deletedUserId
            }
        });

        if (data != 1) {
            errorMessage.error = `User with id: ${deletedUserId} do not exists`;
            return res.status(status.notfound).send(errorMessage);
        }

        successMessage.data = 'User deleted successful'
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};

exports.allUsersList = async (req, res) => {
    if (!req.user.admin) {
        errorMessage.error = 'You are unauthorized to get Users List';
        return res.status(status.unauthorized).send(errorMessage);
    }

    try {
        const data = await User.findAll();

        successMessage.data = []
        data.forEach(element => {
            successMessage.data.push({
                id: element.id,
                email: element.email,
                firstname: element.first_name,
                lastname: element.last_name,
                admin: element.is_admin
            });
        });

        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = `Operation was not successful ${error}`;
        return res.status(status.error).send(errorMessage);
    }
};