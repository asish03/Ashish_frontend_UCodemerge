import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/auth.js';
import { conflicts, jobs } from '../data/mockData.js';

const router = express.Router();

router.get('/conflicts/:jobId', verifyToken, (req, res) => {
  const { jobId } = req.params;
  
  const job = jobs.find(j => j.id === jobId);
  if (!job) {
    return res.status(404).json({ error: 'Not Found', message: 'Job not found' });
  }

  const jobConflicts = conflicts.filter(c => c.jobId === jobId);
  
  res.json({
    jobId,
    conflicts: jobConflicts,
    total: jobConflicts.length
  });
});

router.post('/resolve', verifyToken, (req, res) => {
  const { conflictId, action, customResolution } = req.body;

  if (!conflictId || !action) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Conflict ID and action are required'
    });
  }

  const conflict = conflicts.find(c => c.id === conflictId);
  
  if (!conflict) {
    return res.status(404).json({ error: 'Not Found', message: 'Conflict not found' });
  }

  conflict.resolution = action;
  conflict.resolvedAt = new Date().toISOString();
  
  if (customResolution) {
    conflict.customResolution = customResolution;
  }

  res.json({
    success: true,
    conflict,
    applied: true
  });
});

router.post('/suggest', verifyToken, (req, res) => {
  const { code, conflictType } = req.body;

  res.json({
    suggestion: 'Use TypeScript union type for flexible parameters',
    confidence: 92,
    explanation: 'This approach maintains type safety while allowing flexibility',
    alternativeSuggestions: [
      'Use function overloading',
      'Create separate type-specific functions'
    ]
  });
});

export default router;
