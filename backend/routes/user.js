const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../models/User');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { Joi } = require('joi');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// GET CURRENT USER
router.get('/me', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('workspaces');
        if (!user) return res.status(404).send('User not found.');
        res.send(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// UPDATE USER WORKSPACE
router.put('/me', verify, upload.single('logo'), async (req, res) => {
    const { workspaceName } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send('User not found.');

        if (workspaceName) {
            user.workspaceName = workspaceName;
        }

        if (req.file) {
            // Prepend server URL to the file path
            const logoUrl = `http://localhost:5001/${req.file.path.replace(/\\/g, "/")}`;
            user.logoUrl = logoUrl;
        }

        await user.save();
        
        const userResponse = await User.findById(req.user._id).select('-password');
        res.send(userResponse);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// CHANGE PASSWORD
router.post('/change-password', verify, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).send('Please provide both old and new passwords.');
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Check if old password is correct
        const validPass = await bcrypt.compare(oldPassword, user.password);
        if (!validPass) {
            return res.status(400).send('Invalid old password.');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.send('Password updated successfully.');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 