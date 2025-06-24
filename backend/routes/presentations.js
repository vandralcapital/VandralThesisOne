const router = require('express').Router();
const verify = require('./verifyToken');
const Presentation = require('../models/Presentation');
const Workspace = require('../models/Workspace');
const aiService = require('../services/aiService');

// GET /api/presentations?workspaceId=... - Get all presentations for a workspace
router.get('/', verify, async (req, res) => {
    try {
        const { workspaceId } = req.query;
        if(!workspaceId) return res.status(400).send('Workspace ID is required.');

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).send('Workspace not found.');

        // Check if user is a member of the workspace
        if (!workspace.members.includes(req.user._id) && workspace.owner.toString() !== req.user._id) {
            return res.status(403).send('Access denied.');
        }

        const presentations = await Presentation.find({ workspace: workspaceId });
        res.send(presentations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET /api/presentations/:id - Get a single presentation by ID
router.get('/:id', verify, async (req, res) => {
    try {
        const presentation = await Presentation.findById(req.params.id);
        if (!presentation) return res.status(404).send('Presentation not found.');

        // Check if user has access to this presentation
        const workspace = await Workspace.findById(presentation.workspace);
        if (!workspace.members.includes(req.user._id) && workspace.owner.toString() !== req.user._id) {
            return res.status(403).send('Access denied.');
        }

        res.json(presentation);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST /api/presentations - Create a new presentation
router.post('/', verify, async (req, res) => {
    const { title, workspaceId } = req.body;

    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).send('Workspace not found.');

        if (!workspace.members.includes(req.user._id) && workspace.owner.toString() !== req.user._id) {
            return res.status(403).send('Access denied. You must be a member of the workspace to create a presentation.');
        }
        
        const newPresentation = new Presentation({
            title,
            workspace: workspaceId
        });

        const savedPresentation = await newPresentation.save();
        res.status(201).send(savedPresentation);
    } catch (err) {
        res.status(400).send(err);
    }
});

// POST /api/presentations/generate-storyline - Generate a presentation storyline
router.post('/generate-storyline', verify, async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).send('Topic is required.');
    }

    try {
        const storyline = await aiService.generateStoryline(topic);
        
        if (!storyline.title || !storyline.storyline) {
            return res.status(500).send('Invalid AI storyline response format.');
        }

        res.status(200).json(storyline);

    } catch (err) {
        console.error('Error generating storyline:', err);
        res.status(500).send(`Failed to generate storyline: ${err.message}`);
    }
});

// POST /api/presentations/generate - Generate presentation with AI
router.post('/generate', verify, async (req, res) => {
    const { storyline, workspaceId } = req.body;

    if (!storyline || !workspaceId) {
        return res.status(400).send('Storyline and workspace ID are required.');
    }

    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).send('Workspace not found.');

        if (!workspace.members.includes(req.user._id) && workspace.owner.toString() !== req.user._id) {
            return res.status(403).send('Access denied. You must be a member of the workspace to create a presentation.');
        }

        const aiResponse = await aiService.generatePresentation(storyline);
        
        if (!aiResponse.slides || !Array.isArray(aiResponse.slides)) {
            return res.status(500).send('Invalid AI response format.');
        }

        const newPresentation = new Presentation({
            title: storyline.title,
            workspace: workspaceId,
            slides: aiResponse.slides.map(slide => ({
                title: slide.title,
                content: slide.bullets ? slide.bullets.join('\n') : '',
                notes: slide.image_prompt || ''
            }))
        });

        const savedPresentation = await newPresentation.save();
        res.status(201).json({
            presentation: savedPresentation,
            aiContent: aiResponse
        });

    } catch (err) {
        console.error('Error generating presentation:', err);
        res.status(500).send(`Failed to generate presentation: ${err.message}`);
    }
});

// POST /api/presentations/:id/generate-slide - Generate additional slide content
router.post('/:id/generate-slide', verify, async (req, res) => {
    const { id } = req.params;
    const { topic, slideType } = req.body;

    if (!topic) {
        return res.status(400).send('Topic is required.');
    }

    try {
        const presentation = await Presentation.findById(id);
        if (!presentation) return res.status(404).send('Presentation not found.');

        // Check if user has access to this presentation
        const workspace = await Workspace.findById(presentation.workspace);
        if (!workspace.members.includes(req.user._id) && workspace.owner.toString() !== req.user._id) {
            return res.status(403).send('Access denied.');
        }

        // Generate slide content using AI
        const aiResponse = await aiService.generateSlideContent(topic, slideType);
        
        res.json({
            slideContent: aiResponse,
            slideType: slideType
        });

    } catch (err) {
        console.error('Error generating slide content:', err);
        res.status(500).send(`Failed to generate slide content: ${err.message}`);
    }
});

// PUT /api/presentations/:id - Update presentation
router.put('/:id', verify, async (req, res) => {
    const { id } = req.params;
    const { title, slides } = req.body;

    try {
        const presentation = await Presentation.findById(id);
        if (!presentation) return res.status(404).send('Presentation not found.');

        // Check if user has access to this presentation
        const workspace = await Workspace.findById(presentation.workspace);
        if (!workspace.members.includes(req.user._id) && workspace.owner.toString() !== req.user._id) {
            return res.status(403).send('Access denied.');
        }

        // Update presentation
        if (title) presentation.title = title;
        if (slides) presentation.slides = slides;

        const updatedPresentation = await presentation.save();
        res.json(updatedPresentation);

    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE /api/presentations/:id - Delete presentation
router.delete('/:id', verify, async (req, res) => {
    const { id } = req.params;

    try {
        const presentation = await Presentation.findById(id);
        if (!presentation) return res.status(404).send('Presentation not found.');

        // Check if user has access to this presentation
        const workspace = await Workspace.findById(presentation.workspace);
        if (!workspace.members.includes(req.user._id) && workspace.owner.toString() !== req.user._id) {
            return res.status(403).send('Access denied.');
        }

        await Presentation.findByIdAndDelete(id);
        res.json({ message: 'Presentation deleted successfully' });

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 