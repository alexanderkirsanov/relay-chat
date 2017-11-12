const express = require('express');
const config = require('config');
const compression = require('compression');
const http = require('http');
const path = require('path');
const winston = require('winston');
const graphQLHTTP = require('express-graphql');
const {schema} = require('../data/schema');
const {createUser, getUser} = require('../data/database');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const {Strategy} = require('passport-local');

const urlParser = bodyParser.urlencoded({extended: true});
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
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(
    new Strategy((username, password, cb) => {
        const user = getUser(username);
        if (!user || user.password !== password) {
            return cb(null, false);
        }
        return cb(null, user);
    })
);

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

const secure = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({message: 'Forbidden'});
    }
};
app
    .use(compression())
    .use(express.static(config.get('staticDir')))
    .post('/register', urlParser, (req, res) => {
        const {username, password} = req.body;
        if (username && password) {
            if (getUser(username)) {
                res.json({error: 'userExists'});
            } else {
                res.json(createUser({id: username, name: username, avatar: username, password}));
            }
        } else {
            res.json({error: 'incorrectUser'});
        }
    })
    .post('/login', urlParser, passport.authenticate('local'), (req, res) => {
        if (req.user) {
            res.json(req.user);
        } else {
            res.status(403).json({message: 'Forbidden'});
        }
    })
    .post('/logout', (req, res) => {
        req.logout();
        req.session.destroy(() => {
            res.json({status: 'ok'});
        });
    })
    .use(
        '/graphql',
        secure,
        graphQLHTTP(({user}) => ({
            schema: schema,
            rootValue: {user},
            pretty: true
        }))
    )
    .get('*', (req, res) => {
        res.sendFile(path.resolve(path.join(config.get('staticDir'), '/index.html')));
    });

app.server = http.createServer(app);
app.server.listen(config.get('port'), () => {
    const host = app.server.address().address;
    const port = app.server.address().port;
    app.logger.info(`Listening at http(s)://${host}:${port}`);
});
