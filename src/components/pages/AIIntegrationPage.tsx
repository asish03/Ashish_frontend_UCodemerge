import { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';

interface MergeConflict {
  id: string;
  file: string;
  lineNumber: number;
  conflictType: string;
  aiSuggestion: string;
  confidence: number;
  explanation: string;
}

export function AIIntegrationPage() {
  const [mergeMode, setMergeMode] = useState<'quick' | 'guided' | 'manual'>('guided');
  const [conflicts] = useState<MergeConflict[]>([
    {
      id: '1',
      file: 'src/components/Header.tsx',
      lineNumber: 42,
      conflictType: 'Function Signature Mismatch',
      aiSuggestion: 'Use TypeScript union type to support both implementations',
      confidence: 94,
      explanation:
        'Both versions have valid implementations. The AI suggests creating a union type that accommodates both patterns while maintaining type safety.',
    },
    {
      id: '2',
      file: 'src/utils/api.ts',
      lineNumber: 18,
      conflictType: 'Import Statement Conflict',
      aiSuggestion: 'Merge imports and use named exports',
      confidence: 98,
      explanation:
        'The conflict arises from different import styles. Consolidating to named exports improves tree-shaking and maintains consistency.',
    },
    {
      id: '3',
      file: 'src/hooks/useAuth.ts',
      lineNumber: 67,
      conflictType: 'State Management Difference',
      aiSuggestion: 'Adopt the more recent implementation with useReducer',
      confidence: 87,
      explanation:
        'The newer version uses useReducer for complex state management, which is more maintainable for authentication flows.',
    },
  ]);
  const [resolvedConflicts, setResolvedConflicts] = useState<Set<string>>(new Set());

  const handleAcceptSuggestion = (conflictId: string) => {
    setResolvedConflicts(new Set([...resolvedConflicts, conflictId]));
  };

  const handleRejectSuggestion = (conflictId: string) => {
    // In real implementation, would open manual resolution interface
    console.log('Rejected suggestion for', conflictId);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 75) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">AI-Assisted Integration</h1>
        <p className="text-slate-600">
          Automate code conflict resolution with intelligent AI suggestions
        </p>
      </div>

      {/* Merge Mode Selection */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl mb-4">Select Merge Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setMergeMode('quick')}
            className={`p-6 rounded-xl border-2 transition-all ${
              mergeMode === 'quick'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg text-slate-900">Quick Auto-Merge</h3>
            </div>
            <p className="text-sm text-slate-600">
              Automatically resolve conflicts using AI with high confidence scores (&gt;90%)
            </p>
          </button>

          <button
            onClick={() => setMergeMode('guided')}
            className={`p-6 rounded-xl border-2 transition-all ${
              mergeMode === 'guided'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg text-slate-900">Guided Merge</h3>
            </div>
            <p className="text-sm text-slate-600">
              Review AI suggestions with explanations before applying changes
            </p>
          </button>

          <button
            onClick={() => setMergeMode('manual')}
            className={`p-6 rounded-xl border-2 transition-all ${
              mergeMode === 'manual'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg text-slate-900">Manual Merge</h3>
            </div>
            <p className="text-sm text-slate-600">
              Full control over conflict resolution with AI assistance available
            </p>
          </button>
        </div>
      </div>

      {/* Conflict Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl mb-4">Conflict Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Total Conflicts</p>
            <p className="text-2xl text-slate-900">{conflicts.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 mb-1">Resolved</p>
            <p className="text-2xl text-green-900">{resolvedConflicts.size}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700 mb-1">Pending</p>
            <p className="text-2xl text-orange-900">{conflicts.length - resolvedConflicts.size}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">Avg Confidence</p>
            <p className="text-2xl text-blue-900">93%</p>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        {conflicts.map((conflict) => {
          const isResolved = resolvedConflicts.has(conflict.id);
          return (
            <div
              key={conflict.id}
              className={`bg-white rounded-xl border shadow-sm transition-all ${
                isResolved
                  ? 'border-green-300 bg-green-50/50'
                  : 'border-slate-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {isResolved ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      )}
                      <h3 className="text-lg text-slate-900">{conflict.conflictType}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      <span className="font-mono text-purple-600">{conflict.file}</span> • Line{' '}
                      {conflict.lineNumber}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${getConfidenceColor(
                      conflict.confidence
                    )}`}
                  >
                    {conflict.confidence}% confidence
                  </div>
                </div>

                <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">AI Suggestion:</p>
                  <p className="text-slate-900">{conflict.aiSuggestion}</p>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 mb-1">AI Explanation:</p>
                      <p className="text-sm text-blue-800">{conflict.explanation}</p>
                    </div>
                  </div>
                </div>

                {!isResolved && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptSuggestion(conflict.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept Suggestion
                    </button>
                    <button
                      onClick={() => handleRejectSuggestion(conflict.id)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Manual Edit
                    </button>
                  </div>
                )}
                {isResolved && (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Conflict resolved</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {resolvedConflicts.size === conflicts.length && (
        <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-green-900">All conflicts resolved!</p>
                <p className="text-sm text-green-700">Ready to commit changes</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              Commit & Merge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
