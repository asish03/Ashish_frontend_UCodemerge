import { useState } from 'react';
import { Github, FolderOpen, Upload, Link2, CheckCircle, Clock, FileCode } from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  source: 'github' | 'local' | 'url';
  url?: string;
  branches: number;
  commits: number;
  language: string;
  size: string;
  importedAt: string;
  status: 'importing' | 'ready' | 'analyzing';
}

export function RepositoryIntegrationPage() {
  const [repositories] = useState<Repository[]>([
    {
      id: '1',
      name: 'frontend-app',
      source: 'github',
      url: 'https://github.com/user/frontend-app',
      branches: 3,
      commits: 147,
      language: 'TypeScript',
      size: '4.2 MB',
      importedAt: '2 hours ago',
      status: 'ready',
    },
    {
      id: '2',
      name: 'backend-api',
      source: 'github',
      url: 'https://github.com/user/backend-api',
      branches: 2,
      commits: 89,
      language: 'Python',
      size: '2.8 MB',
      importedAt: '5 hours ago',
      status: 'ready',
    },
    {
      id: '3',
      name: 'legacy-system',
      source: 'local',
      branches: 1,
      commits: 234,
      language: 'Java',
      size: '12.5 MB',
      importedAt: '1 day ago',
      status: 'analyzing',
    },
  ]);

  const [showGithubConnect, setShowGithubConnect] = useState(false);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'local':
        return <FolderOpen className="w-5 h-5" />;
      case 'url':
        return <Link2 className="w-5 h-5" />;
      default:
        return <FileCode className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Ready
          </span>
        );
      case 'importing':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Importing
          </span>
        );
      case 'analyzing':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Analyzing
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Repository Integration</h1>
        <p className="text-slate-600">
          Import code from GitHub, local files, or direct URLs with full history
        </p>
      </div>

      {/* Import Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setShowGithubConnect(!showGithubConnect)}
          className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
              <Github className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-900 mb-1">Connect GitHub</p>
              <p className="text-sm text-slate-600">OAuth integration</p>
            </div>
          </div>
        </button>

        <button className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-900 mb-1">Upload Local Files</p>
              <p className="text-sm text-slate-600">ZIP or folder structure</p>
            </div>
          </div>
        </button>

        <button className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Link2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-900 mb-1">Import from URL</p>
              <p className="text-sm text-slate-600">Git repository URL</p>
            </div>
          </div>
        </button>
      </div>

      {/* GitHub Connect Modal */}
      {showGithubConnect && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-6 h-6" />
            <h2 className="text-xl">Connect to GitHub</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Authorize AsembleAI to access your repositories. We only request read access and
            preserve full commit history.
          </p>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2">
              <Github className="w-5 h-5" />
              Authorize with GitHub
            </button>
            <button
              onClick={() => setShowGithubConnect(false)}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Imported Repositories */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl">Imported Repositories ({repositories.length})</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {repositories.map((repo) => (
            <div key={repo.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    {getSourceIcon(repo.source)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg text-slate-900">{repo.name}</h3>
                      {getStatusBadge(repo.status)}
                    </div>
                    {repo.url && (
                      <p className="text-sm text-slate-600 mb-2 font-mono">{repo.url}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{repo.language}</span>
                      <span>•</span>
                      <span>{repo.branches} branches</span>
                      <span>•</span>
                      <span>{repo.commits} commits</span>
                      <span>•</span>
                      <span>{repo.size}</span>
                      <span>•</span>
                      <span>{repo.importedAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Repository Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Project Type</p>
                  <p className="text-sm text-slate-900">Auto-detected</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Build System</p>
                  <p className="text-sm text-slate-900">
                    {repo.language === 'TypeScript' ? 'npm/vite' : repo.language === 'Python' ? 'pip/poetry' : 'maven'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Dependencies</p>
                  <p className="text-sm text-slate-900">
                    {repo.language === 'TypeScript' ? '47 packages' : repo.language === 'Python' ? '23 packages' : '15 packages'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Actions</p>
                  <div className="flex gap-2">
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      View Files
                    </button>
                    <span className="text-slate-300">•</span>
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Import Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-600 mb-1">Total Imports</p>
          <p className="text-2xl text-slate-900">{repositories.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-600 mb-1">Total Files</p>
          <p className="text-2xl text-slate-900">1,247</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-600 mb-1">Code Size</p>
          <p className="text-2xl text-slate-900">19.5 MB</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-600 mb-1">Languages</p>
          <p className="text-2xl text-slate-900">5</p>
        </div>
      </div>
    </div>
  );
}
