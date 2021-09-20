
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const User = require('../models/user');


loginRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({username: body.username});

    if (!user || !bcrypt.compare(body.password, user.passwordHash))
        throw {name: 'AuthenticationError', message: 'invalid username or password'};

    const token = jwt.sign(
        {username: user.username, id: user._id},
        config.SECRET,
        {expiresIn: 60*60}
    );

    response.status(200)
        .send({token, username: user.username, name: user.name});
});


module.exports = loginRouter;
