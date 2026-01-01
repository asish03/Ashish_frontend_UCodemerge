import { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, Zap, Shield, TestTube } from 'lucide-react';

interface ConversionPhase {
  id: string;
  name: string;
  description: string;
  conversions: ConversionType[];
  status: 'available' | 'coming-soon';
}

interface ConversionType {
  from: string;
  to: string;
  method: 'deterministic' | 'ai-assisted' | 'hybrid';
  accuracy: number;
}

export function ConversionWorkflowPage() {
  const [selectedPhase, setSelectedPhase] = useState<string>('phase1');

  const phases: ConversionPhase[] = [
    {
      id: 'phase1',
      name: 'Phase 1: Modern Language Pairs',
      description: 'High-frequency conversions between modern programming languages and frameworks',
      status: 'available',
      conversions: [
        { from: 'JavaScript', to: 'TypeScript', method: 'deterministic', accuracy: 98 },
        { from: 'TypeScript', to: 'JavaScript', method: 'deterministic', accuracy: 99 },
        { from: 'Python', to: 'JavaScript', method: 'hybrid', accuracy: 92 },
        { from: 'JavaScript', to: 'Python', method: 'hybrid', accuracy: 91 },
        { from: 'React', to: 'Vue', method: 'ai-assisted', accuracy: 88 },
        { from: 'Vue', to: 'React', method: 'ai-assisted', accuracy: 87 },
        { from: 'React', to: 'Angular', method: 'ai-assisted', accuracy: 85 },
        { from: 'Angular', to: 'React', method: 'ai-assisted', accuracy: 86 },
      ],
    },
    {
      id: 'phase2',
      name: 'Phase 2: Legacy Modernization',
      description: 'Enterprise legacy system conversion to modern languages',
      status: 'available',
      conversions: [
        { from: 'COBOL', to: 'Python', method: 'ai-assisted', accuracy: 82 },
        { from: 'COBOL', to: 'Java', method: 'ai-assisted', accuracy: 84 },
        { from: 'C++', to: 'Go', method: 'hybrid', accuracy: 87 },
        { from: 'C++', to: 'Rust', method: 'hybrid', accuracy: 83 },
        { from: 'VB.NET', to: 'C#', method: 'deterministic', accuracy: 94 },
        { from: 'Perl', to: 'Python', method: 'hybrid', accuracy: 79 },
      ],
    },
  ];

  const currentPhase = phases.find((p) => p.id === selectedPhase) || phases[0];

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'deterministic':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            Deterministic
          </span>
        );
      case 'ai-assisted':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
            AI-Assisted
          </span>
        );
      case 'hybrid':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Hybrid</span>
        );
      default:
        return null;
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Conversion Workflow Phases</h1>
        <p className="text-slate-600">
          Structured, phase-based workflow for code conversion across languages and frameworks
        </p>
      </div>

      {/* Phase Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setSelectedPhase(phase.id)}
            className={`p-6 rounded-xl border-2 text-left transition-all ${
              selectedPhase === phase.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {selectedPhase === phase.id ? (
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
                <h3 className="text-lg text-slate-900">{phase.name}</h3>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  phase.status === 'available'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {phase.status === 'available' ? 'Available' : 'Coming Soon'}
              </span>
            </div>
            <p className="text-sm text-slate-600">{phase.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-slate-700">
                {phase.conversions.length} conversions
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-700">
                Avg {Math.round(phase.conversions.reduce((acc, c) => acc + c.accuracy, 0) / phase.conversions.length)}% accuracy
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Conversion Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl mb-6">Conversion Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { icon: <ArrowRight className="w-6 h-6" />, label: 'Parse', color: 'bg-blue-500' },
            { icon: <Zap className="w-6 h-6" />, label: 'Transform', color: 'bg-purple-500' },
            { icon: <Shield className="w-6 h-6" />, label: 'Validate', color: 'bg-green-500' },
            { icon: <TestTube className="w-6 h-6" />, label: 'Test', color: 'bg-orange-500' },
            { icon: <CheckCircle className="w-6 h-6" />, label: 'Output', color: 'bg-teal-500' },
          ].map((step, index) => (
            <div key={step.label} className="flex flex-col items-center">
              <div className={`${step.color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-3`}>
                {step.icon}
              </div>
              <p className="text-sm text-slate-900 mb-1">{step.label}</p>
              <p className="text-xs text-slate-600 text-center">
                {index === 0 && 'AST extraction'}
                {index === 1 && 'Rule engine + AI'}
                {index === 2 && 'Syntax check'}
                {index === 3 && 'Auto-generated tests'}
                {index === 4 && 'Final code'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Conversions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl">{currentPhase.name} - Supported Conversions</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {currentPhase.conversions.map((conversion, index) => (
            <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-100 rounded-lg text-slate-900 min-w-[120px] text-center">
                      {conversion.from}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                    <div className="px-4 py-2 bg-purple-100 rounded-lg text-purple-900 min-w-[120px] text-center">
                      {conversion.to}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getMethodBadge(conversion.method)}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Accuracy:</span>
                      <span className={`text-sm ${getAccuracyColor(conversion.accuracy)}`}>
                        {conversion.accuracy}%
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                  Try Conversion
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg text-slate-900 mb-3">Parsing Layer</h3>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">• tree-sitter (multi-language)</p>
            <p className="text-sm text-slate-600">• Babel (JavaScript)</p>
            <p className="text-sm text-slate-600">• libclang (C++)</p>
            <p className="text-sm text-slate-600">• Roslyn (.NET)</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg text-slate-900 mb-3">Transformation</h3>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">• Go Rule Engine</p>
            <p className="text-sm text-slate-600">• PyTorch LLM Module</p>
            <p className="text-sm text-slate-600">• Protobuf IR Schema</p>
            <p className="text-sm text-slate-600">• NVIDIA Triton Serving</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg text-slate-900 mb-3">Validation</h3>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">• Firecracker sandbox</p>
            <p className="text-sm text-slate-600">• pytest/Jest automation</p>
            <p className="text-sm text-slate-600">• Compilation checks</p>
            <p className="text-sm text-slate-600">• Coverage metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
