const router = require('express').Router();
const verify = require('./verifyToken');
const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Invitation = require('../models/Invitation');

// GET WORKSPACE DETAILS
router.get('/:id', verify, async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id).populate('members', 'firstName lastName email');
        if (!workspace) return res.status(404).send('Workspace not found.');

        // Ensure user is a member of the workspace
        if (!workspace.members.some(member => member._id.equals(req.user._id))) {
            return res.status(403).send('Access denied.');
        }

        res.send(workspace);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET PENDING INVITATIONS FOR A WORKSPACE
router.get('/:id/invitations', verify, async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) return res.status(404).send('Workspace not found.');
        if (!workspace.members.some(member => member._id.equals(req.user._id))) {
            return res.status(403).send('Access denied.');
        }
        const invitations = await Invitation.find({ workspace: req.params.id, status: 'pending' });
        res.send(invitations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// UPDATE WORKSPACE DETAILS (name, logo)
router.put('/:id', verify, async (req, res) => {
    // This will be expanded later to handle logo uploads with multer
    const { name } = req.body;
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) return res.status(404).send('Workspace not found.');

        // Ensure user is the owner of the workspace
        if (workspace.owner.toString() !== req.user._id) {
            return res.status(403).send('Access denied. Only the owner can update the workspace.');
        }
        
        if (name) workspace.name = name;
        // Logo update logic will be added here later

        await workspace.save();
        res.send(workspace);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 