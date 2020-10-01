const jwt = require('jsonwebtoken');
const User = require('../models').users;

const {
    errorMessage,
    status
} = require('../helpers/response-helper.js');


const verifyToken = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        errorMessage.error = 'Token not provided';
        return res.status(status.bad).send(errorMessage);
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({
            where: {
                id: decoded.id
            }
        });

        if (user === null) {
            errorMessage.error = `Sorry, but user with id: ${decoded.id} do not exists.`;
            return res.status(status.unauthorized).send(errorMessage);
        }

        req.user = {
            email: user.email,
            id: user.id,
            admin: user.is_admin,
            firstname: user.first_name,
            lastname: user.last_name,
        };

        next();
    } catch (err) {
        errorMessage.error = `Authentication Failed! ${err}`;
        return res.status(status.unauthorized).send(errorMessage);
    }
};

module.exports = verifyToken;