const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    slides: [{
        title: String,
        content: String,
        notes: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Presentation', presentationSchema); 