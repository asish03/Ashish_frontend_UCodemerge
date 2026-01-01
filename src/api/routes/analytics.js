import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { analyticsData, jobs, timeSeriesData, users } from '../data/mockData.js';

const router = express.Router();

router.get('/overview', verifyToken, (req, res) => {
  res.json(analyticsData);
});

router.get('/jobs', verifyToken, (req, res) => {
  const { timeRange = '7d', type, status, limit = 50, offset = 0 } = req.query;

  let filteredJobs = req.user.role === 'owner' 
    ? [...jobs] 
    : jobs.filter(j => j.userId === req.user.id);

  if (type) {
    filteredJobs = filteredJobs.filter(j => j.type === type);
  }

  if (status) {
    filteredJobs = filteredJobs.filter(j => j.status === status);
  }

  const total = filteredJobs.length;
  const paginatedJobs = filteredJobs
    .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
    .map(job => {
      const user = users.find(u => u.id === job.userId);
      return {
        ...job,
        userName: user?.name || 'Unknown'
      };
    });

  res.json({
    jobs: paginatedJobs,
    total,
    page: Math.floor(parseInt(offset) / parseInt(limit)) + 1
  });
});

router.get('/timeseries', verifyToken, (req, res) => {
  const { days = 30 } = req.query;
  res.json({
    data: timeSeriesData.slice(-parseInt(days)),
    period: `${days} days`
  });
});

router.get('/performance', verifyToken, (req, res) => {
  res.json(analyticsData.performanceMetrics);
});

router.get('/users', verifyToken, (req, res) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Only owners can access user analytics'
    });
  }
  
  res.json(analyticsData.userActivity);
});

export default router;
