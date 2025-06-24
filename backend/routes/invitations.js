const router = require('express').Router();
const verify = require('./verifyToken');
const Invitation = require('../models/Invitation');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

// POST /api/invitations - Send an invite
router.post('/', verify, async (req, res) => {
    const { workspaceId } = req.body;
    const recipientEmail = req.body.recipientEmail.toLowerCase();
    const senderId = req.user._id;

    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).send('Workspace not found.');
        if (workspace.owner.toString() !== senderId) return res.status(403).send('Only the owner can send invites.');

        const recipientUser = await User.findOne({ email: recipientEmail });
        if (recipientUser && workspace.members.includes(recipientUser._id)) {
            return res.status(400).send('User is already in this workspace.');
        }

        const newInvitation = new Invitation({
            sender: senderId,
            recipientEmail,
            workspace: workspaceId,
        });

        await newInvitation.save();
        res.status(201).send(newInvitation);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send('An invitation for this user and workspace is already pending.');
        }
        res.status(500).send('Server Error');
    }
});

// GET /api/invitations - Get invites for the logged-in user
router.get('/', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send('User not found.');

        // Forcing lowercase on the email for a robust query
        const invitations = await Invitation.find({ recipientEmail: user.email.toLowerCase(), status: 'pending' })
            .populate('sender', 'firstName lastName')
            .populate('workspace', 'name');
        res.send(invitations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST /api/invitations/:id/accept - Accept an invitation
router.post('/:id/accept', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const invitation = await Invitation.findById(req.params.id);

        if (!invitation || invitation.recipientEmail !== user.email.toLowerCase() || invitation.status !== 'pending') {
            return res.status(404).send('Invitation not found or invalid.');
        }

        const workspace = await Workspace.findById(invitation.workspace);
        if (!workspace) return res.status(404).send('Associated workspace not found.');

        workspace.members.push(user._id);
        user.workspaces.push(workspace._id);
        
        invitation.status = 'accepted';
        
        await Promise.all([workspace.save(), user.save(), invitation.save()]);
        
        // For simplicity, we can delete the invitation after it's accepted
        await Invitation.deleteOne({ _id: req.params.id });

        res.send({ message: 'Invitation accepted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 