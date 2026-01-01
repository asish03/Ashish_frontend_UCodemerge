import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/auth.js';
import { repositories, projects } from '../data/mockData.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.json({
    repositories,
    total: repositories.length
  });
});

router.post('/connect', verifyToken, (req, res) => {
  const { url, source = 'github', branch = 'main' } = req.body;

  if (!url) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Repository URL is required'
    });
  }

  const newRepo = {
    id: uuidv4(),
    name: url.split('/').slice(-1)[0],
    fullName: url.split('/').slice(-2).join('/'),
    url,
    branch,
    source,
    language: 'TypeScript',
    connected: true,
    connectedAt: new Date().toISOString()
  };

  repositories.push(newRepo);

  res.status(201).json({
    success: true,
    repository: newRepo
  });
});

router.post('/import', verifyToken, (req, res) => {
  const { repositoryId, branch = 'main' } = req.body;

  const repo = repositories.find(r => r.id === repositoryId);
  
  if (!repo) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Repository not found'
    });
  }

  const newProject = {
    id: uuidv4(),
    name: repo.name,
    userId: req.user.id,
    source: 'github',
    language: repo.language || 'JavaScript',
    framework: 'Unknown',
    sizeBytes: Math.floor(Math.random() * 10000000) + 1000000,
    fileCount: Math.floor(Math.random() * 200) + 50,
    repositoryUrl: repo.url,
    branch,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projects.push(newProject);

  res.status(201).json({
    success: true,
    project: newProject,
    message: 'Repository imported successfully'
  });
});

router.delete('/:repositoryId', verifyToken, (req, res) => {
  const { repositoryId } = req.params;

  const repoIndex = repositories.findIndex(r => r.id === repositoryId);
  
  if (repoIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Repository not found'
    });
  }

  repositories.splice(repoIndex, 1);

  res.json({
    success: true,
    message: 'Repository disconnected successfully'
  });
});

export default router;
