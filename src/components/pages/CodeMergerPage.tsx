import { useState, useRef } from 'react';
import {
  Upload,
  Github,
  FolderOpen,
  Play,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Trash2,
  X,
} from 'lucide-react';
import { mergeApi } from '../../services/api';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const [pastedCode, setPastedCode] = useState('');
  const [showGithubDialog, setShowGithubDialog] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartMerge = async () => {
    try {
      setIsLoading(true);
      setMergeStatus('analyzing');
      
      // Call merge API
      const response = await mergeApi.start(
        projects.map(p => p.id),
        'guided'
      );
      
      console.log('Merge started:', response);
      toast.success('Merge analysis started');
      
      // Simulate merge progress
      setTimeout(() => setMergeStatus('merging'), 2000);
      setTimeout(() => {
        setMergeStatus('complete');
        toast.success('Merge completed successfully!');
        setIsLoading(false);
      }, 4000);
    } catch (error: any) {
      console.error('Merge error:', error);
      toast.error(error.message || 'Failed to start merge');
      setMergeStatus('idle');
      setIsLoading(false);
    }
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast.success('Project removed');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      console.log('Uploading files:', files.length);
      toast.info('Uploading files...');
      
      // Call upload API
      const response = await mergeApi.upload({
        source: 'upload',
        mergeMode: 'guided',
        files: formData
      });
      
      console.log('Upload response:', response);
      
      // Add uploaded project to list
      const newProject: UploadedProject = {
        id: response.job_id || Date.now().toString(),
        name: files[0].name.replace(/\\.zip$/, ''),
        source: 'Upload',
        size: `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`,
        files: response.projects?.[0]?.files || files.length,
        language: 'JavaScript',
      };
      
      setProjects([...projects, newProject]);
      toast.success('Files uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload files');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasteCode = async () => {
    if (!pastedCode.trim()) {
      toast.error('Please paste some code');
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Uploading pasted code...');
      toast.info('Processing code...');
      
      // Call upload API with pasted code
      const response = await mergeApi.upload({
        source: 'paste',
        mergeMode: 'guided',
        files: { code: pastedCode }
      });
      
      console.log('Paste response:', response);
      
      // Add pasted code as project
      const newProject: UploadedProject = {
        id: response.job_id || Date.now().toString(),
        name: 'pasted-code',
        source: 'Paste',
        size: `${(pastedCode.length / 1024).toFixed(1)} KB`,
        files: 1,
        language: 'JavaScript',
      };
      
      setProjects([...projects, newProject]);
      setPastedCode('');
      setShowPasteDialog(false);
      toast.success('Code added successfully!');
    } catch (error: any) {
      console.error('Paste error:', error);
      toast.error(error.message || 'Failed to add code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubImport = async () => {
    if (!githubUrl.trim()) {
      toast.error('Please enter a GitHub URL');
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Importing from GitHub:', githubUrl);
      toast.info('Importing repository...');
      
      // Call upload API with GitHub URL
      const response = await mergeApi.upload({
        source: 'github',
        mergeMode: 'guided',
        files: { url: githubUrl }
      });
      
      console.log('GitHub import response:', response);
      
      // Add GitHub repo as project
      const repoName = githubUrl.split('/').pop() || 'github-repo';
      const newProject: UploadedProject = {
        id: response.job_id || Date.now().toString(),
        name: repoName,
        source: 'GitHub',
        size: response.projects?.[0]?.size || '0 MB',
        files: response.projects?.[0]?.files || 0,
        language: 'JavaScript',
      };
      
      setProjects([...projects, newProject]);
      setGithubUrl('');
      setShowGithubDialog(false);
      toast.success('Repository imported successfully!');
    } catch (error: any) {
      console.error('GitHub import error:', error);
      toast.error(error.message || 'Failed to import repository');
    } finally {
      setIsLoading(false);
    }
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
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-900 mb-1">Upload ZIP/Folder</p>
            <p className="text-sm text-slate-600">Drag & drop or browse files</p>
          </div>
        </button>
        {/* <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".zip,.js,.jsx,.ts,.tsx,.json"
          onChange={handleFileUpload}
          className="hidden"
        /> */}

        <button 
          onClick={() => setShowGithubDialog(true)}
          disabled={isLoading}
          className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Github className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-900 mb-1">Import from GitHub</p>
            <p className="text-sm text-slate-600">Connect repository</p>
          </div>
        </button>

        <button 
          onClick={() => setShowPasteDialog(true)}
          disabled={isLoading}
          className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-900 mb-1">Paste Code</p>
            <p className="text-sm text-slate-600">Direct code input</p>
          </div>
        </button>
      </div>

      {/* Paste Code Dialog */}
      {showPasteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Paste Your Code</h2>
              <button
                onClick={() => setShowPasteDialog(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={pastedCode}
              onChange={(e) => setPastedCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-sm"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handlePasteCode}
                disabled={isLoading || !pastedCode.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add Code'}
              </button>
              <button
                onClick={() => setShowPasteDialog(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Import Dialog */}
      {showGithubDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Import from GitHub</h2>
              <button
                onClick={() => setShowGithubDialog(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleGithubImport}
                disabled={isLoading || !githubUrl.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Importing...' : 'Import'}
              </button>
              <button
                onClick={() => setShowGithubDialog(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
          disabled={projects.length < 2 || mergeStatus !== 'idle' || isLoading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          {isLoading ? 'Starting...' : 'Start Merge'}
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
