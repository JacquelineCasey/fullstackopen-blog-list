
const http = require('http'); // Apparently this is node builtin.
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');


const server = http.createServer(app);

app.connectToDatabase().then(() => {
    server.listen(config.PORT, async () => {
        logger.info(`Server running on port ${config.PORT}`);
    });
});
