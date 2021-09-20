
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();

const User = require('../models/user');
const validatePassword = require('../utils/validatePassword');


usersRouter.get('/', async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
    const body = request.body;

    if (!validatePassword(body.password))
        return next({name: 'PasswordValidationError', message: 'Invalid or Missing Password'});

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User ({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    });

    const savedUser = await user.save();

    response.json(savedUser);
});


module.exports = usersRouter;
