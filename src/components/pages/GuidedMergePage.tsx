import { useState } from 'react';
import { ChevronRight, CheckCircle, Code, Info } from 'lucide-react';

interface MergeStep {
  id: string;
  title: string;
  status: 'pending' | 'current' | 'completed';
  changes: number;
}

interface MergeCandidate {
  id: string;
  description: string;
  leftCode: string;
  rightCode: string;
  suggestion: string;
  reasoning: string;
  rank: number;
}

export function GuidedMergePage() {
  const [steps] = useState<MergeStep[]>([
    { id: '1', title: 'Analyze Projects', status: 'completed', changes: 0 },
    { id: '2', title: 'Detect Conflicts', status: 'completed', changes: 0 },
    { id: '3', title: 'Review Suggestions', status: 'current', changes: 12 },
    { id: '4', title: 'Validate Merge', status: 'pending', changes: 0 },
    { id: '5', title: 'Final Commit', status: 'pending', changes: 0 },
  ]);

  const [candidates] = useState<MergeCandidate[]>([
    {
      id: '1',
      description: 'Authentication Hook Implementation',
      leftCode: `const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  return { user, loading };
};`,
      rightCode: `const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    checkAuth().then(user => {
      dispatch({ type: 'AUTH_SUCCESS', user });
    });
  }, []);
  
  return state;
};`,
      suggestion: 'Use the right implementation with useReducer',
      reasoning:
        'The right implementation uses useReducer for complex state management, which provides better scalability and maintainability for authentication flows. It also includes error handling which is missing in the left version.',
      rank: 1,
    },
    {
      id: '2',
      description: 'API Client Configuration',
      leftCode: `const apiClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
});`,
      rightCode: `const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});`,
      suggestion: 'Merge both configurations',
      reasoning:
        'The right implementation has better timeout settings and explicit headers, but the left uses the correct environment variable naming. Combine the best of both approaches.',
      rank: 2,
    },
  ]);

  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [acceptedCandidates, setAcceptedCandidates] = useState<Set<string>>(new Set());

  const currentCandidate = candidates[currentCandidateIndex];

  const handleAccept = () => {
    setAcceptedCandidates(new Set([...acceptedCandidates, currentCandidate.id]));
    if (currentCandidateIndex < candidates.length - 1) {
      setCurrentCandidateIndex(currentCandidateIndex + 1);
    }
  };

  const handleReject = () => {
    if (currentCandidateIndex < candidates.length - 1) {
      setCurrentCandidateIndex(currentCandidateIndex + 1);
    }
  };

  const handleModify = () => {
    // In real implementation, would open code editor
    console.log('Modify candidate', currentCandidate.id);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Guided Merge Workflow</h1>
        <p className="text-slate-600">
          Step-by-step merge process with AI suggestions and human oversight
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : step.status === 'current'
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <p
                  className={`text-sm mt-2 ${
                    step.status === 'current' ? 'text-purple-600' : 'text-slate-600'
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Candidate */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Candidate {currentCandidateIndex + 1} of {candidates.length}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Rank #{currentCandidate.rank}
                </span>
              </div>
              <h2 className="text-xl text-slate-900">{currentCandidate.description}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Progress</p>
              <p className="text-2xl text-slate-900">
                {acceptedCandidates.size}/{candidates.length}
              </p>
            </div>
          </div>
        </div>

        {/* Code Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x divide-slate-200">
          <div>
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <p className="text-sm text-slate-700">Current Version (Left)</p>
            </div>
            <pre className="p-4 overflow-x-auto text-sm bg-white">
              <code className="font-mono text-slate-900">{currentCandidate.leftCode}</code>
            </pre>
          </div>
          <div>
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <p className="text-sm text-slate-700">Alternative Version (Right)</p>
            </div>
            <pre className="p-4 overflow-x-auto text-sm bg-white">
              <code className="font-mono text-slate-900">{currentCandidate.rightCode}</code>
            </pre>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="p-6 border-t border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-purple-700 mb-1">AI Suggestion</p>
              <p className="text-lg text-slate-900 mb-3">{currentCandidate.suggestion}</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 mb-1">Reasoning</p>
                <p className="text-sm text-blue-800">{currentCandidate.reasoning}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Accept & Continue
            </button>
            <button
              onClick={handleModify}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Code className="w-5 h-5" />
              Modify & Accept
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg flex items-center gap-2 transition-colors"
            >
              Skip
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Accepted Changes */}
      {acceptedCandidates.size > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg text-slate-900 mb-4">
            Accepted Changes ({acceptedCandidates.size})
          </h3>
          <div className="space-y-2">
            {candidates
              .filter((c) => acceptedCandidates.has(c.id))
              .map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-900">{candidate.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
