const express = require('express');
const config = require('config');
const compression = require('compression');
const http = require('http');
const path = require('path');
const winston = require('winston');
const graphQLHTTP  = require('express-graphql');
const {schema}  = require('../data/schema');

const app = express();
app.logger = new winston.Logger({
    level: 'info',
    exitOnError: false,
    transports: [
        new winston.transports.Console({
            colorize: true,
            timestamp: true,
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});

app
    .use(compression())
    .use(express.static(config.get('staticDir')))
    .use('/graphql', graphQLHTTP({schema, pretty: true}))
    .get('*', function(req, res) {
        res.sendFile(path.resolve(path.join(config.get('staticDir'), '/index.html')));
    });

app.server = http.createServer(app);
app.server.listen(config.get('port'), () => {
    const host = app.server.address().address;
    const port = app.server.address().port;
    app.logger.info(`Listening at http(s)://${host}:${port}`);
});
