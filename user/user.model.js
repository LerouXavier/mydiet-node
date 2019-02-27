const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    },
    mentees: {
        type: String
    }
}, {runSettersOnQuery: true}); // 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option.

userSchema.pre('save', function (next) {
    this.email = this
        .email
        .toLowerCase(); // ensure email are in lowercase

    var currentDate = new Date().getTime();
    this.updatedAt = currentDate;
    if (!this.created_at) {
        this.createdAt = currentDate;
    }
    next();
});

module.exports.User = mongoose.model('user', userSchema);