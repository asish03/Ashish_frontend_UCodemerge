import { useState } from 'react';
import { Shield, TestTube, Archive, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running';
  coverage: number;
  duration: string;
}

interface Backup {
  id: string;
  name: string;
  timestamp: string;
  size: string;
  status: 'active' | 'archived';
}

export function RiskMitigationPage() {
  const [activeTab, setActiveTab] = useState<'testing' | 'backups' | 'rollback'>('testing');

  const testResults: TestResult[] = [
    { id: '1', name: 'Unit Tests', status: 'passed', coverage: 87, duration: '2.3s' },
    { id: '2', name: 'Integration Tests', status: 'passed', coverage: 74, duration: '8.1s' },
    { id: '3', name: 'E2E Tests', status: 'running', coverage: 0, duration: '--' },
    { id: '4', name: 'Security Scan', status: 'passed', coverage: 100, duration: '5.7s' },
    { id: '5', name: 'Performance Tests', status: 'failed', coverage: 92, duration: '12.4s' },
  ];

  const backups: Backup[] = [
    {
      id: '1',
      name: 'Pre-merge checkpoint - main branch',
      timestamp: '2 hours ago',
      size: '4.2 MB',
      status: 'active',
    },
    {
      id: '2',
      name: 'Before language conversion',
      timestamp: '5 hours ago',
      size: '3.8 MB',
      status: 'active',
    },
    {
      id: '3',
      name: 'Initial import state',
      timestamp: '1 day ago',
      size: '3.5 MB',
      status: 'active',
    },
    {
      id: '4',
      name: 'Legacy system backup',
      timestamp: '3 days ago',
      size: '12.1 MB',
      status: 'archived',
    },
  ];

  const qualityMetrics = [
    { label: 'Code Coverage', value: '87%', status: 'good', target: '80%' },
    { label: 'Compilation Success', value: '100%', status: 'excellent', target: '100%' },
    { label: 'Security Score', value: 'A+', status: 'excellent', target: 'A' },
    { label: 'Technical Debt', value: 'Low', status: 'good', target: 'Low' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'running':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
        );
      default:
        return null;
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'warning':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Merge Process Risk Mitigation</h1>
        <p className="text-slate-600">
          Pre-merge testing, backups, and error recovery for safe code integration
        </p>
      </div>

      {/* Quality Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl mb-4">Quality Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {qualityMetrics.map((metric) => (
            <div
              key={metric.label}
              className={`p-4 rounded-lg border ${getMetricColor(metric.status)}`}
            >
              <p className="text-sm mb-2">{metric.label}</p>
              <p className="text-2xl mb-1">{metric.value}</p>
              <p className="text-xs opacity-75">Target: {metric.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('testing')}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'testing'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TestTube className="w-5 h-5" />
            Pre-Merge Testing
          </button>
          <button
            onClick={() => setActiveTab('backups')}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'backups'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-5 h-5" />
            Backups
          </button>
          <button
            onClick={() => setActiveTab('rollback')}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'rollback'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            Rollback
          </button>
        </div>

        <div className="p-6">
          {/* Testing Tab */}
          {activeTab === 'testing' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-slate-900">Test Results</h3>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Run All Tests
                </button>
              </div>

              <div className="space-y-3">
                {testResults.map((test) => (
                  <div
                    key={test.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(test.status)}
                        <div className="flex-1">
                          <h4 className="text-slate-900 mb-1">{test.name}</h4>
                          <p className="text-sm text-slate-600">
                            {test.status === 'running'
                              ? 'Running tests...'
                              : `Duration: ${test.duration}`}
                          </p>
                        </div>
                      </div>
                      {test.status !== 'running' && (
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Coverage</p>
                            <div className="w-32 bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  test.coverage >= 80 ? 'bg-green-500' : 'bg-orange-500'
                                }`}
                                style={{ width: `${test.coverage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-slate-900">{test.coverage}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 mb-1">Test Automation Active</p>
                    <p className="text-sm text-blue-800">
                      All merged code is automatically tested in isolated Firecracker containers
                      before final commit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backups Tab */}
          {activeTab === 'backups' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-slate-900">Version Backups</h3>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Create Backup
                </button>
              </div>

              <div className="space-y-3">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Archive className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-slate-900 mb-1">{backup.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span>{backup.timestamp}</span>
                            <span>•</span>
                            <span>{backup.size}</span>
                            <span>•</span>
                            <span
                              className={
                                backup.status === 'active' ? 'text-green-600' : 'text-slate-500'
                              }
                            >
                              {backup.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded">
                          Download
                        </button>
                        <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                          Restore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-900 mb-1">Auto-Backup Enabled</p>
                    <p className="text-sm text-green-800">
                      Backups are automatically created before each merge operation and stored on S3
                      with versioning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rollback Tab */}
          {activeTab === 'rollback' && (
            <div>
              <h3 className="text-lg text-slate-900 mb-6">Rollback Management</h3>

              <div className="space-y-6">
                <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
                  <RotateCcw className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-slate-900 mb-2">Current State: Stable</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    No rollback needed. All recent merges completed successfully.
                  </p>
                  <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg cursor-not-allowed" disabled>
                    No Rollback Available
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-blue-900 mb-2">PostgreSQL State Tracking</h4>
                    <p className="text-sm text-blue-800">
                      All job states and checkpoints are stored in PostgreSQL for instant rollback
                      capability.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="text-purple-900 mb-2">GitHub Integration</h4>
                    <p className="text-sm text-purple-800">
                      Direct integration with GitHub's rollback API for repository-level recovery.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-orange-900 mb-1">Rollback Policy</p>
                      <p className="text-sm text-orange-800">
                        You can rollback to any checkpoint within the last 30 days. Older backups
                        are archived and require manual restoration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl mb-4">Risk Mitigation Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-slate-900 mb-3">Testing Framework</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">• pytest (Python)</p>
              <p className="text-sm text-slate-600">• Jest (JavaScript)</p>
              <p className="text-sm text-slate-600">• JUnit (Java)</p>
              <p className="text-sm text-slate-600">• Semgrep (Code quality)</p>
            </div>
          </div>
          <div>
            <h3 className="text-slate-900 mb-3">Backup System</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">• S3 versioned artifacts</p>
              <p className="text-sm text-slate-600">• PostgreSQL job state</p>
              <p className="text-sm text-slate-600">• Git snapshots</p>
              <p className="text-sm text-slate-600">• Incremental backups</p>
            </div>
          </div>
          <div>
            <h3 className="text-slate-900 mb-3">Workflow Management</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">• Temporal checkpoints</p>
              <p className="text-sm text-slate-600">• GitHub rollback API</p>
              <p className="text-sm text-slate-600">• State recovery</p>
              <p className="text-sm text-slate-600">• Coverage reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
