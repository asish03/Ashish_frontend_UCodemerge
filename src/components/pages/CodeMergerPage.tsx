import { useState } from 'react';
import {
  Upload,
  Github,
  FolderOpen,
  Play,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Trash2,
} from 'lucide-react';

interface UploadedProject {
  id: string;
  name: string;
  source: string;
  size: string;
  files: number;
  language: string;
}

export function CodeMergerPage() {
  const [projects, setProjects] = useState<UploadedProject[]>([
    {
      id: '1',
      name: 'lovable-project',
      source: 'Lovable',
      size: '2.3 MB',
      files: 47,
      language: 'React/TS',
    },
    {
      id: '2',
      name: 'cursor-backend',
      source: 'Cursor',
      size: '5.1 MB',
      files: 89,
      language: 'Node.js',
    },
  ]);
  const [mergeStatus, setMergeStatus] = useState<'idle' | 'analyzing' | 'merging' | 'complete'>(
    'idle'
  );

  const handleStartMerge = () => {
    setMergeStatus('analyzing');
    setTimeout(() => setMergeStatus('merging'), 2000);
    setTimeout(() => setMergeStatus('complete'), 4000);
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Universal Code Merger</h1>
        <p className="text-slate-600">
          Combine source code from multiple AI coding tools into a single unified project
        </p>
      </div>

      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-900 mb-1">Upload ZIP/Folder</p>
            <p className="text-sm text-slate-600">Drag & drop or browse files</p>
          </div>
        </button>

        <button className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Github className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-900 mb-1">Import from GitHub</p>
            <p className="text-sm text-slate-600">Connect repository</p>
          </div>
        </button>

        <button className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-900 mb-1">Paste Code</p>
            <p className="text-sm text-slate-600">Direct code input</p>
          </div>
        </button>
      </div>

      {/* Uploaded Projects */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl">Projects to Merge ({projects.length})</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {projects.map((project) => (
            <div key={project.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileCode className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-slate-600">
                      {project.source} • {project.language} • {project.files} files • {project.size}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveProject(project.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Merge Analysis */}
      {mergeStatus !== 'idle' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl">Merge Analysis</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-900">Compatible Modules</p>
                </div>
                <p className="text-2xl text-green-900">124</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <p className="text-orange-900">Conflicts Detected</p>
                </div>
                <p className="text-2xl text-orange-900">7</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="w-5 h-5 text-blue-600" />
                  <p className="text-blue-900">Dependencies</p>
                </div>
                <p className="text-2xl text-blue-900">43</p>
              </div>
            </div>

            {mergeStatus === 'analyzing' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  <p className="text-blue-900">Analyzing project structures...</p>
                </div>
              </div>
            )}

            {mergeStatus === 'merging' && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                  <p className="text-purple-900">Merging codebases...</p>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: '67%' }}
                  ></div>
                </div>
              </div>
            )}

            {mergeStatus === 'complete' && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-900">
                    Merge complete! Unified project ready for download.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleStartMerge}
          disabled={projects.length < 2 || mergeStatus !== 'idle'}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Merge
        </button>
        {mergeStatus === 'complete' && (
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Download Merged Project
          </button>
        )}
      </div>
    </div>
  );
}
