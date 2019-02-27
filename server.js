const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session'); //we're using 'express-session' as 'session' here
const MongoStore = require('connect-mongo')(session);
const helmet = require("helmet");
const cors = require("cors");
const PORT = 3030; // you can change this if this port number is not available

const auth = require("./auth");
const userRoutes = require("./user/user.routes");
const dashboardRoutes = require("./dashboard/dashboard.routes");
const proportionsRoutes = require("./proportion/proportion-routes");
const templateRoutes = require("./template/template-routes");
const settings = require("./settings");

let app = express();
app.use(helmet());

mongoose.connect("mongodb://localhost/nutritional_plan",
    { useNewUrlParser: true },
    (err, db) => {
    if (err) {
        console.log("Couldn't connect to database");
    } else {
        console.log(`Connected To Database`);
    }
});

// configure bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(
    session({
        secret: settings.SESSION_SECRET_KEY, // don't put this into your code at production.  Try using saving it into environment variable or a config file.
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        }),
        cookie: {
            path: '/',
            httpOnly: false,
            secure: settings.SESSION_SECURE_COOKIES
        }
    })
);

app.configure(function() {
    app.use(express.static('public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: settings.SESSION_SECRET_KEY }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

// app.use(csurf());

app.use(cors({
    origin: 'http://localhost:3000',
    headers: "Origin, X-Requested-With, Content-Type, Accept",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 204,
    credentials: true
}));

// middleware
// app.use(sessions({
//   cookieName: "session",
//   secret: settings.SESSION_SECRET_KEY,
//   duration: settings.SESSION_DURATION,
//   activeDuration: settings.SESSION_EXTENSION_DURATION,
//   cookie: {
//       path: '/',
//     httpOnly: false,
//     ephemeral: settings.SESSION_EPHEMERAL_COOKIES,
//     secure: settings.SESSION_SECURE_COOKIES
//   }
// }));

app.use(auth.loadUserFromSession);

// routes
app.use(userRoutes);
app.use(dashboardRoutes);
app.use(proportionsRoutes);
app.use(templateRoutes);

// error handling
app.use((err, req, res, next) => {
  res.status(500).send("Something broke :( Please try again. " + err);
});

app.listen(PORT, () => {
    console.log(`app running port ${PORT}`)
});