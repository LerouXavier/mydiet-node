const bcrypt  = require('bcryptjs');
const express = require('express');
const shortid = require('shortid');
const nodemailer = require('nodemailer');

const auth = require('../auth');
const {User}     = require('./user.model');
const settings   = require('../settings');
let router       = express.Router();

/**
 * Create a new user account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/v1/register', (req, res) => {
    let {firstName, lastName, email, password, language} = req.body; // this is called destructuring. We're extracting these variables and their values from 'req.body'

    let userData = {
        firstName,
        lastName,
        password: bcrypt.hashSync(password, settings.BCRYPT_WORK_FACTOR), // we are using bcrypt to hash our password before saving it to the database
        email,
        language
    };

    let user = new User(userData);

    user.save((error) => {
        if (!error) {
            return res.status(201).json('Registered successfully');
        } else {
            if (error.code === 11000) { // this error gets thrown only if similar user record already exist.
                return res.status(409).send('That email is already taken. Please try another.');
            } else {
                console.log(JSON.stringify(error, null, 2)); // you might want to do this to examine and trace where the problem is emanating from
                return res.status(500).send({
                    error: 'Error: Could not create new account.'
                });
            }
        }

        // auth.createUserSession(req, res, user);
    });
});

/**
 * Log a user into their account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/v1/login', (req, res) => {
    let {email, password} = req.body;

    User.findOne({email: email}, 'firstName lastName email password', (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send({
                error: 'Incorrect email / password.'
            });
        }

        auth.createUserSession(req, res, user);

        return res.status(200).send();
    });

});

/**
 * Log a user out of their account, then redirect them to the home page.
 */
router.get('/v1/logout', (req, res) => {
    if (req.session) {
        delete req.session.user; // any of these works
        req.session.destroy(); // any of these works
        res.status(200).send('logout successful')
    }
    res.status(401).send('You are already logged out.')
});

/*
4. Password reset
=================
We shall be using two endpoints to implement password reset functionality
*/
router.post('/v1/forgot', (req, res) => {
    let {email} = req.body; // same as let email = req.body.email
    User.findOne({email: email}, (err, userData) => {
        if (!err) {
            userData.passResetKey   = shortid.generate();
            userData.passKeyExpires = new Date().getTime() + 20 * 60 * 1000; // pass reset key only valid for 20 minutes
            userData.save().then(err => {
                if (!err) {
                    // configuring smtp transport machanism for password reset email
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        port: settings.MAIL_PORT,
                        auth: {
                            user: settings.MAIL_USER,
                            pass: settings.MAIL_PASSWORD
                        }
                    });
                    let mailOptions = {
                        subject: `Nutrition Plan | Password reset`,
                        to: email,
                        from: `settings.MAIL_USER`,
                        html: `
                <h1>Hi,</h1>
                <h2>Here is your password reset key</h2>
                <h2><code contenteditable="false" style="font-weight:200;font-size:1.5rem;padding:5px 10px; background: #EEEEEE; border:0">${passResetKey}</code></h4>
                <p>Please ignore if you didn't try to reset your password on our platform</p>
              `
                    };
                    try {
                        transporter.sendMail(mailOptions, (error, response) => {
                            if (error) {
                                console.log('error:\n', error, '\n');
                                res.status(500).send('could not send reset code');
                            } else {
                                console.log('email sent:\n', response);
                                res.status(200).send('Reset Code sent');
                            }
                        });
                    } catch (error) {
                        console.log(error);
                        res.status(500).send('could not sent reset code');
                    }
                }
            });
        } else {
            res.status(400).send('email is incorrect');
        }
    });
});

router.post('/v1/resetpass', (req, res) => {
    let {resetKey, newPassword} = req.body;
    User.find({passResetKey: resetKey}, (err, userData) => {
        if (!err) {
            let now           = new Date().getTime();
            let keyExpiration = userData.passKeyExpires;
            if (keyExpiration > now) {
                userData.password      = bcrypt.hashSync(newPassword, 5);
                userData.passResetKey  = null; // remove passResetKey from user's records
                userData.keyExpiration = null;
                userData.save().then(err => { // save the new changes
                    if (!err) {
                        res.status(200).send('Password reset successful');
                    } else {
                        res.status(500).send('error resetting your password');
                    }
                });
            } else {
                res.status(400).send('Sorry, pass key has expired. Please initiate the request for a new one');
            }
        } else {
            res.status(400).send('invalid pass key!');
        }
    });
});


module.exports = router;