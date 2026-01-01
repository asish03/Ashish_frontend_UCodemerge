import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/auth.js';
import { jobs } from '../data/mockData.js';

const router = express.Router();

router.post('/analyze', verifyToken, (req, res) => {
  const { sourceCode, sourceLanguage, targetLanguage } = req.body;

  if (!sourceCode || !sourceLanguage || !targetLanguage) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Source code, source language, and target language are required'
    });
  }

  const newJob = {
    id: uuidv4(),
    userId: req.user.id,
    type: 'conversion',
    status: 'pending',
    inputData: { sourceLanguage, targetLanguage, linesOfCode: sourceCode.split('\n').length },
    createdAt: new Date().toISOString()
  };

  jobs.push(newJob);

  res.status(201).json({
    jobId: newJob.id,
    complexity: 'medium',
    estimatedTime: '5s',
    supportedConversions: true
  });
});

router.post('/execute', verifyToken, (req, res) => {
  const { jobId } = req.body;

  const job = jobs.find(j => j.id === jobId && j.userId === req.user.id);

  if (!job) {
    return res.status(404).json({ error: 'Not Found', message: 'Job not found' });
  }

  job.status = 'completed';
  job.completedAt = new Date().toISOString();
  job.outputData = {
    convertedCode: '// Converted code here',
    confidence: 95,
    stats: {
      linesConverted: job.inputData.linesOfCode,
      functionsMapped: Math.floor(Math.random() * 30) + 10,
      typeAnnotations: Math.floor(Math.random() * 60) + 20
    }
  };

  res.json(job.outputData);
});

router.get('/jobs', verifyToken, (req, res) => {
  const userJobs = jobs.filter(j => j.userId === req.user.id && j.type === 'conversion');
  res.json({ jobs: userJobs, total: userJobs.length });
});

export default router;
