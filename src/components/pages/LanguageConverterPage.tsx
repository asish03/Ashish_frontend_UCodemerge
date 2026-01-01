import { useState } from 'react';
import { ArrowRight, Play, Download, Copy, CheckCircle } from 'lucide-react';

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'C#',
  'COBOL',
  'VB.NET',
];

const FRAMEWORKS = [
  'React',
  'Vue',
  'Angular',
  'Svelte',
  'Next.js',
  'Express',
  'FastAPI',
  'Django',
];

const SAMPLE_CODE = {
  javascript: `function calculateSum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log('Sum:', result);`,
  typescript: `function calculateSum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

const result: number = calculateSum([1, 2, 3, 4, 5]);
console.log('Sum:', result);`,
  python: `def calculate_sum(numbers: list[int]) -> int:
    return sum(numbers)

result = calculate_sum([1, 2, 3, 4, 5])
print(f'Sum: {result}')`,
};

export function LanguageConverterPage() {
  const [sourceLanguage, setSourceLanguage] = useState('JavaScript');
  const [targetLanguage, setTargetLanguage] = useState('TypeScript');
  const [sourceCode, setSourceCode] = useState(SAMPLE_CODE.javascript);
  const [convertedCode, setConvertedCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);

  const handleConvert = () => {
    setIsConverting(true);
    setConversionComplete(false);
    
    setTimeout(() => {
      if (targetLanguage === 'TypeScript') {
        setConvertedCode(SAMPLE_CODE.typescript);
      } else if (targetLanguage === 'Python') {
        setConvertedCode(SAMPLE_CODE.python);
      } else {
        setConvertedCode('// Converted code would appear here');
      }
      setIsConverting(false);
      setConversionComplete(true);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedCode);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Intelligent Language Converter</h1>
        <p className="text-slate-600">
          Transform code between programming languages and frameworks while preserving logic
        </p>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <label className="block text-sm text-slate-700 mb-2">Source Language</label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-purple-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">Target Language</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Framework Conversion Option */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <label className="block text-sm text-slate-700 mb-2">Framework Conversion (Optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Select source framework</option>
              {FRAMEWORKS.map((fw) => (
                <option key={fw} value={fw}>
                  {fw}
                </option>
              ))}
            </select>
            <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Select target framework</option>
              {FRAMEWORKS.map((fw) => (
                <option key={fw} value={fw}>
                  {fw}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Code Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Source Code */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-slate-900">Source Code</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {sourceLanguage}
            </span>
          </div>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            className="w-full h-80 p-4 font-mono text-sm bg-slate-50 focus:outline-none resize-none"
            placeholder="Paste your source code here..."
          />
        </div>

        {/* Converted Code */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-slate-900">Converted Code</h3>
            <div className="flex items-center gap-2">
              {conversionComplete && (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Complete
                </span>
              )}
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                {targetLanguage}
              </span>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={convertedCode}
              readOnly
              className="w-full h-80 p-4 font-mono text-sm bg-slate-50 focus:outline-none resize-none"
              placeholder="Converted code will appear here..."
            />
            {convertedCode && (
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Copy className="w-4 h-4 text-slate-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Stats */}
      {conversionComplete && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h3 className="text-slate-900 mb-4">Conversion Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Lines Converted</p>
              <p className="text-2xl text-blue-900">142</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Functions Mapped</p>
              <p className="text-2xl text-green-900">23</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700 mb-1">Type Annotations</p>
              <p className="text-2xl text-purple-900">56</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700 mb-1">Confidence Score</p>
              <p className="text-2xl text-orange-900">98%</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleConvert}
          disabled={!sourceCode || isConverting}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isConverting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Converting...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Convert Code
            </>
          )}
        </button>
        {conversionComplete && (
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Result
          </button>
        )}
      </div>
    </div>
  );
}
