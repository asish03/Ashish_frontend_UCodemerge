import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/auth.js';
import { jobs, projects, conflicts } from '../data/mockData.js';

const router = express.Router();

/**
 * POST /api/v1/merge/upload
 * Upload projects for merging
 */
router.post('/upload', verifyToken, async (req, res) => {
  try {
    const { source, mergeMode, files } = req.body;

    if (!source || !mergeMode) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Source and merge mode are required'
      });
    }

    // Simulate file upload and project creation
    const newProject = {
      id: uuidv4(),
      name: `${source}-project-${Date.now()}`,
      userId: req.user.id,
      source,
      language: 'TypeScript',
      framework: 'React',
      sizeBytes: Math.floor(Math.random() * 5000000) + 1000000,
      fileCount: Math.floor(Math.random() * 100) + 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);

    res.status(201).json({
      success: true,
      project: newProject,
      message: 'Project uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred during upload'
    });
  }
});

/**
 * POST /api/v1/merge/start
 * Start merge operation
 */
router.post('/start', verifyToken, async (req, res) => {
  try {
    const { projectIds, mergeMode } = req.body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length < 2) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'At least 2 project IDs are required for merging'
      });
    }

    if (!['auto', 'guided', 'manual'].includes(mergeMode)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid merge mode. Must be: auto, guided, or manual'
      });
    }

    // Create new merge job
    const newJob = {
      id: uuidv4(),
      userId: req.user.id,
      type: 'merge',
      status: 'running',
      inputData: {
        projectIds,
        mergeMode
      },
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    jobs.push(newJob);

    // Simulate async processing
    setTimeout(() => {
      const job = jobs.find(j => j.id === newJob.id);
      if (job) {
        job.status = 'completed';
        job.completedAt = new Date().toISOString();
        job.outputData = {
          mergedFiles: Math.floor(Math.random() * 100) + 50,
          conflictsResolved: Math.floor(Math.random() * 20),
          qualityScore: Math.floor(Math.random() * 10) + 90
        };
      }
    }, 5000);

    res.status(201).json({
      success: true,
      job: newJob,
      estimatedTime: '30s',
      message: 'Merge operation started'
    });
  } catch (error) {
    console.error('Merge start error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred while starting merge'
    });
  }
});

/**
 * GET /api/v1/merge/jobs
 * Get user's merge jobs
 */
router.get('/jobs', verifyToken, (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let userJobs = jobs.filter(j => j.userId === req.user.id && j.type === 'merge');

    if (status) {
      userJobs = userJobs.filter(j => j.status === status);
    }

    const total = userJobs.length;
    const paginatedJobs = userJobs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      jobs: paginatedJobs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred while fetching jobs'
    });
  }
});

/**
 * GET /api/v1/merge/jobs/:jobId
 * Get specific merge job with conflicts
 */
router.get('/jobs/:jobId', verifyToken, (req, res) => {
  try {
    const { jobId } = req.params;

    const job = jobs.find(j => j.id === jobId);

    if (!job) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.userId !== req.user.id && req.user.role !== 'owner') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied'
      });
    }

    // Get conflicts for this job
    const jobConflicts = conflicts.filter(c => c.jobId === jobId);

    res.json({
      ...job,
      conflicts: jobConflicts
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred while fetching job'
    });
  }
});

/**
 * DELETE /api/v1/merge/jobs/:jobId
 * Cancel or delete a merge job
 */
router.delete('/jobs/:jobId', verifyToken, (req, res) => {
  try {
    const { jobId } = req.params;

    const jobIndex = jobs.findIndex(j => j.id === jobId);

    if (jobIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Job not found'
      });
    }

    const job = jobs[jobIndex];

    // Check ownership
    if (job.userId !== req.user.id && req.user.role !== 'owner') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied'
      });
    }

    // Can only cancel running or pending jobs
    if (job.status === 'running' || job.status === 'pending') {
      jobs[jobIndex].status = 'cancelled';
      jobs[jobIndex].completedAt = new Date().toISOString();
    } else {
      // Remove completed/failed jobs
      jobs.splice(jobIndex, 1);
    }

    res.json({
      success: true,
      message: 'Job cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel job error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred while cancelling job'
    });
  }
});

export default router;
