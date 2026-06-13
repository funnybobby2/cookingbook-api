import express from 'express';
import Planning from '../models/planning.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const doc = await Planning.findOne({ userId: req.params.userId })
    res.json({ plan: doc?.plan || {} })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:userId', async (req, res) => {
  try {
    const { plan } = req.body
    await Planning.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: { plan } },
      { upsert: true }
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router;
