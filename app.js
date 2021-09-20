
const cors = require('cors');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');


const app = express();

/* app.connectionFormed can be awaited (eg by tests) to ensure that the
 * connection is formed. This is not neccessary to do before queueing Mongoose
 *requests. */
app.connectionFormed = mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message);
    });


app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use(middleware.errorHandler);


module.exports = app;
