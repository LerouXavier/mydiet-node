const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require("helmet");
const passport = require('passport');
const cors = require("cors");
const PORT = 3030; // you can change this if this port number is not available

const authenticationRoutes = require("./authentication/authentication.routes");
const dashboardRoutes = require("./dashboard/dashboard.routes");
const proportionsRoutes = require("./proportion/proportion.routes");
const templateRoutes = require("./template/template.routes");
// load models
require('./user/user.model');

let app = express();
app.use(helmet());
app.use(passport.initialize());

// load passport strategies
const localLoginStrategy = require('./authentication/login.strategy');
const localSignupStrategy = require('./authentication/register.strategy');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

mongoose.connect("mongodb://localhost/nutritional_plan",
    { useNewUrlParser: true },
    (err, db) => {
    if (err) {
        console.log("Couldn't connect to database");
    } else {
        console.log(`Connected To Database`);
    }
});
// plug in the promise library:
mongoose.Promise = global.Promise;

// configure bodyParser
app.use(bodyParser.json());
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({extended: false}));
// app.use(csurf());

app.use(cors({
    origin: 'http://localhost:3000',
    headers: "Origin, X-Requested-With, Content-Type, Accept",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 204,
    credentials: true
}));

// pass the authorization checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api/v1/proportions', authCheckMiddleware);

// routes
// app.use(dashboardRoutes);
app.use('/api/v1', [authenticationRoutes, proportionsRoutes]);
// app.use(templateRoutes);

// error handling
app.use((err, req, res, next) => {
  res.status(500).send("Something broke :( Please try again. " + err);
});

app.listen(PORT, () => {
    console.log(`app running port ${PORT}`)
});