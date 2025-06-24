const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    workspaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema); 