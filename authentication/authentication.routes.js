const express = require('express');
const passport = require('passport');
const validators = require('./authentication.validators');

const router = new express.Router();

/**
 1. Register
 =================
 * Log a user into their account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/v1/register', (req, res, next) => {
    const validationResult = validators.validateSignupForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    return passport.authenticate('local-signup', (err) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // the 11000 Mongo code is for a duplication email error
                // the 409 HTTP status code is for conflict error
                return res.status(409).json({
                    success: false,
                    message: 'Check the form for errors.',
                    errors: {
                        email: 'This email is already taken.'
                    }
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Could not process the form.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'You have successfully signed up! Now you should be able to log in.'
        });
    })(req, res, next);
});

/**
 2. Login
 =================
 * Log a user into their account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/v1/login', (req, res, next) => {
    const validationResult = validators.validateLoginForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }


    return passport.authenticate('local-login', (err, token, userData) => {
        if (err) {
            if (err.name === 'IncorrectCredentialsError') {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Could not process the form.'
            });
        }

        res.cookie('token', token);

        return res.json({
            success: true,
            message: 'You have successfully logged in!',
            user: userData
        });
    })(req, res, next);
});

/**
 3. Logout
 =================
 * Log a user out of their account, then redirect them to the home page.
 */
router.get('/v1/logout', (req, res) => {
    req.logout();

    res.cookie('token', '');

    return res.json({
        success: true,
        message: 'You have successfully logged out!'
    });
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
