const router = require('express').Router();
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Invitation = require('../models/Invitation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const { registerValidation, loginValidation } = require('../validation');

// REGISTER
router.post('/register', async (req, res) => {
    // LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const email = req.body.email.toLowerCase();
    const username = req.body.username;

    // Checking if the user is already in the database
    const emailExist = await User.findOne({ email: email });
    if (emailExist) return res.status(400).send('Email already exists');
    
    const usernameExist = await User.findOne({ username: username });
    if (usernameExist) return res.status(400).send('Username already exists');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: username,
        email: email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();

        // Check for invitation token
        const { invitationToken } = req.body;
        if (invitationToken) {
            const invitation = await Invitation.findOne({ token: invitationToken, email: req.body.email, expires: { $gt: Date.now() } });
            if (invitation) {
                const workspace = await Workspace.findById(invitation.workspace);
                if (workspace) {
                    workspace.members.push(savedUser._id);
                    await workspace.save();
                    savedUser.workspaces.push(workspace._id);
                }
                await Invitation.deleteOne({ _id: invitation._id });
            }
        } else {
            // Create a default workspace for the new user if no invitation
            const workspace = new Workspace({
                name: `${savedUser.firstName}'s Workspace`,
                owner: savedUser._id,
                members: [savedUser._id]
            });
            const savedWorkspace = await workspace.save();
            savedUser.workspaces.push(savedWorkspace._id);
        }

        await savedUser.save();

        const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send({ token });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    // LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const loginIdentifier = req.body.email.toLowerCase();

    // Checking if the user exists by email or username
    const user = await User.findOne({ 
        $or: [
            { email: loginIdentifier },
            { username: loginIdentifier }
        ]
    });
    if (!user) return res.status(400).send('Invalid credentials');

    // PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid credentials');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ token });
});

module.exports = router; 