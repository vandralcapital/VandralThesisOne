const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    }
}, { timestamps: true });

invitationSchema.index({ recipientEmail: 1, workspace: 1 }, { unique: true });

module.exports = mongoose.model('Invitation', invitationSchema); 