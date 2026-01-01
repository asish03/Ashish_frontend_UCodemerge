import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Hash passwords synchronously for demo users
const hashedOwnerPassword = bcrypt.hashSync('owner123', 10);
const hashedDevPassword = bcrypt.hashSync('dev123', 10);

// Mock Users
export const users = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'owner@asembleai.com',
    password: hashedOwnerPassword,
    name: 'Alex Thompson',
    role: 'owner',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    lastActive: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'dev@asembleai.com',
    password: hashedDevPassword,
    name: 'Sam Williams',
    role: 'developer',
    status: 'active',
    createdAt: '2024-02-01T14:30:00Z',
    lastActive: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'sarah@asembleai.com',
    password: hashedDevPassword,
    name: 'Sarah Chen',
    role: 'developer',
    status: 'active',
    createdAt: '2024-02-15T09:00:00Z',
    lastActive: '2024-12-10T15:30:00Z'
  }
];

// Mock Projects
export const projects = [
  {
    id: uuidv4(),
    name: 'E-commerce Platform',
    userId: users[1].id,
    source: 'lovable',
    language: 'TypeScript',
    framework: 'React',
    sizeBytes: 2457600,
    fileCount: 47,
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z'
  },
  {
    id: uuidv4(),
    name: 'Mobile App Backend',
    userId: users[1].id,
    source: 'replit',
    language: 'Python',
    framework: 'FastAPI',
    sizeBytes: 1843200,
    fileCount: 32,
    createdAt: '2024-11-25T08:00:00Z',
    updatedAt: '2024-12-05T16:00:00Z'
  }
];

// Mock Jobs
export const jobs = [
  {
    id: uuidv4(),
    userId: users[1].id,
    type: 'merge',
    status: 'completed',
    inputData: {
      projectIds: [projects[0].id, projects[1].id],
      mergeMode: 'guided'
    },
    outputData: {
      mergedFiles: 79,
      conflictsResolved: 12,
      qualityScore: 94
    },
    startedAt: '2024-12-01T10:00:00Z',
    completedAt: '2024-12-01T10:03:45Z',
    createdAt: '2024-12-01T09:58:00Z'
  },
  {
    id: uuidv4(),
    userId: users[1].id,
    type: 'conversion',
    status: 'completed',
    inputData: {
      sourceLanguage: 'JavaScript',
      targetLanguage: 'TypeScript',
      linesOfCode: 450
    },
    outputData: {
      convertedLines: 450,
      typeAnnotations: 127,
      confidence: 98
    },
    startedAt: '2024-11-28T14:00:00Z',
    completedAt: '2024-11-28T14:02:30Z',
    createdAt: '2024-11-28T13:58:00Z'
  },
  {
    id: uuidv4(),
    userId: users[2].id,
    type: 'merge',
    status: 'running',
    inputData: {
      projectIds: ['project-id-1', 'project-id-2'],
      mergeMode: 'auto'
    },
    startedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 120000).toISOString()
  }
];

// Mock Conflicts
export const conflicts = [
  {
    id: uuidv4(),
    jobId: jobs[0].id,
    filePath: 'src/components/Header.tsx',
    lineNumber: 42,
    conflictType: 'Function Signature Mismatch',
    aiSuggestion: 'Use TypeScript union type for flexible parameter',
    confidenceScore: 94,
    explanation: 'Both versions define the onClick handler differently. TypeScript union type allows both patterns.',
    resolution: 'accepted',
    createdAt: '2024-12-01T10:01:00Z',
    resolvedAt: '2024-12-01T10:02:15Z'
  },
  {
    id: uuidv4(),
    jobId: jobs[0].id,
    filePath: 'src/utils/api.ts',
    lineNumber: 18,
    conflictType: 'Import Statement Conflict',
    aiSuggestion: 'Merge imports and use named exports',
    confidenceScore: 98,
    explanation: 'Multiple import statements for the same module. Consolidate into single import.',
    resolution: 'accepted',
    createdAt: '2024-12-01T10:01:30Z',
    resolvedAt: '2024-12-01T10:02:45Z'
  }
];

// Mock Analytics Data
export const analyticsData = {
  totalOperations: 2847,
  successRate: 96.8,
  avgProcessingTime: 4.2,
  operationsByType: {
    merge: 1247,
    conversion: 892,
    import: 456,
    ai_integration: 252
  },
  operationsByStatus: {
    completed: 2755,
    failed: 47,
    running: 28,
    pending: 17
  },
  performanceMetrics: {
    averageMergeTime: 5.8,
    averageConversionTime: 3.2,
    averageImportTime: 8.5,
    averageAIResolutionTime: 2.1
  },
  userActivity: {
    activeUsers: 142,
    totalUsers: 178,
    newUsersThisWeek: 12,
    avgOperationsPerUser: 16
  }
};

// Mock Repository Data
export const repositories = [
  {
    id: uuidv4(),
    name: 'asembleai/frontend',
    fullName: 'asembleai/frontend',
    url: 'https://github.com/asembleai/frontend',
    branch: 'main',
    language: 'TypeScript',
    stars: 342,
    forks: 28,
    lastCommit: '2024-12-10T14:30:00Z',
    connected: true
  },
  {
    id: uuidv4(),
    name: 'user/my-project',
    fullName: 'user/my-project',
    url: 'https://github.com/user/my-project',
    branch: 'main',
    language: 'JavaScript',
    stars: 15,
    forks: 3,
    lastCommit: '2024-12-05T09:15:00Z',
    connected: false
  }
];

// Generate time-series data for charts
export const generateTimeSeriesData = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      merges: Math.floor(Math.random() * 50) + 10,
      conversions: Math.floor(Math.random() * 40) + 5,
      imports: Math.floor(Math.random() * 30) + 3,
      successRate: (Math.random() * 5 + 93).toFixed(1)
    });
  }
  
  return data;
};

export const timeSeriesData = generateTimeSeriesData();
