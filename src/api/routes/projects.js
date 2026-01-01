import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { projects } from '../data/mockData.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  const userProjects = projects.filter(p => p.userId === req.user.id);
  res.json({
    projects: userProjects,
    total: userProjects.length
  });
});

router.get('/:projectId', verifyToken, (req, res) => {
  const { projectId } = req.params;
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Project not found'
    });
  }

  if (project.userId !== req.user.id && req.user.role !== 'owner') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied'
    });
  }

  res.json(project);
});

router.delete('/:projectId', verifyToken, (req, res) => {
  const { projectId } = req.params;
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Project not found'
    });
  }

  const project = projects[projectIndex];

  if (project.userId !== req.user.id && req.user.role !== 'owner') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied'
    });
  }

  projects.splice(projectIndex, 1);

  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});

export default router;
