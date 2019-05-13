const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// we create a user schema
let userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    passResetKey: String,
    passKeyExpires: Number,
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
        type: Number,
        required: false
    }
}, {runSettersOnQuery: true}); // 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option.


/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
userSchema.methods.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
};


userSchema.pre('save', function (next) {
    const user = this;

    // proceed further only if the password is modified or the user is new
    if (!user.isModified('password')) return next();

    user.email = user
        .email
        .toLowerCase(); // ensure email are in lowercase

    var currentDate = new Date().getTime();
    user.updatedAt = currentDate;
    if (!user.created_at) {
        user.createdAt = currentDate;
    }

    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }

            // replace a password string with hash value
            user.password = hash;

            return next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);
