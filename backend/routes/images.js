const router = require('express').Router();
const aiService = require('../services/aiService');

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const imageUrl = await aiService.generateImage(prompt);
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Image generation failed' });
  }
});

module.exports = router; 