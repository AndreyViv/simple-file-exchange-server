const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.hashPassword = password => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

exports.comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
};

exports.validatePassword = password => {
    const validLength = 5;

    if (password === undefined || password.length < validLength) {
        return false;
    }
    return true;
};

exports.validateEmail = email => {
    const regEx = /\S+@\S+\.\S+/;

    if (email === undefined || email.replace(/\s/g, '').length === 0 || !regEx.test(email)) {
        return false;
    }
    return true
};

exports.generateUserToken = (email, id, admin, firstname, lastname) => {
    const payload = {
        email,
        id,
        admin,
        firstname,
        lastname,
    };
    const options = {
        expiresIn: '3d'
    };

    return jwt.sign(payload, process.env.SECRET, options);
};