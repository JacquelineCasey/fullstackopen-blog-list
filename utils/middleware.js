
const logger = require('./logger');


const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError')
        return response.status(400).send({error: 'malformatted id'});

    if (error.name === 'ValidationError')
        return response.status(400).send({error: error.message});

    if (error.name === 'PasswordValidationError')
        return response.status(400).send({error: error.message});

    if (error.name === 'AuthenticationError')
        return response.status(401).send({error: 'invalid username or password'});

    next(error);
};


module.exports = {
    errorHandler
};
