
const jwt = require('jsonwebtoken');

const config = require('./config.js');
const logger = require('./logger');
const User = require('../models/user');



const errorHandler = (error, request, response, next) => {
    logger.error(error.name, error.message);

    if (error.name === 'CastError')
        return response.status(400).send({error: 'malformatted id'});

    if (error.name === 'ValidationError')
        return response.status(400).send({error: error.message});

    if (error.name === 'PasswordValidationError')
        return response.status(400).send({error: error.message});

    if (error.name === 'AuthenticationError')
        return response.status(401).send({error: error.message});

    if (error.name === 'JsonWebTokenError')
        return response.status(401).json({error: 'invalid token'});

    next(error);
};

/* Only intended for use for some functions (due to slowness). Throws errors if
 * something goes wrong with authorization, so only use if authorization is required. */
const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization');
    if (!authorization)
        return next({name: 'AuthenticationError', message: 'missing authorization header'});
    if (!authorization.toLowerCase().startsWith('bearer '))
        return next({name: 'AuthenticationError', message: 'malformatted authorization header'});

    const token = authorization.substring(7);

    const decodedToken = jwt.verify(token, config.SECRET);
    if (!token || !decodedToken.id)
        return next({name: 'AuthenticationError', message: 'token missing or invalid'});

    request.user = await User.findById(decodedToken.id);

    next();
};


module.exports = {
    errorHandler,
    userExtractor
};
