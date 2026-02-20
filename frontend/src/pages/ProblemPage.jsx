import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';

const langMap = {
        cpp: 'C++',
        java: 'Java',
        javascript: 'JavaScript',
        python: 'Python'
};

const getDraftKey = (problemId, language) => `draft_${problemId}_${language}`;

const getFullCode = (problemData, language) => {
  const target = langMap[language]?.toLowerCase();
  const entry = problemData?.startCode?.find(
    (sc) => sc.language?.toLowerCase() === target
  );
  return entry?.initialCode || '';
};

const LOGIC_MARKERS = [
  "Write your logic here",
  "Write your code here",
  "TODO"
];

const findMarkerIndex = (code) => {
  for (const marker of LOGIC_MARKERS) {
    const idx = code.indexOf(marker);
    if (idx !== -1) return idx;
  }
  return -1;
};

const extractBraceFunction = (code, markerIndex) => {
  const startBrace = code.lastIndexOf("{", markerIndex);
  if (startBrace === -1) return null;
  const lineStart = code.lastIndexOf("\n", startBrace);
  const start = lineStart === -1 ? 0 : lineStart + 1;

  let depth = 0;
  for (let i = startBrace; i < code.length; i++) {
    const ch = code[i];
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        const end = i + 1;
        return { start, end, visible: code.slice(start, end) };
      }
    }
  }
  return null;
};

const extractPythonFunction = (code, markerIndex) => {
  const lines = code.split("\n");
  let lineIndex = 0;
  let charCount = 0;
  for (; lineIndex < lines.length; lineIndex++) {
    const lineLen = lines[lineIndex].length + 1;
    if (charCount + lineLen > markerIndex) break;
    charCount += lineLen;
  }

  let defIndex = -1;
  for (let i = lineIndex; i >= 0; i--) {
    const trimmed = lines[i].trimStart();
    if (trimmed.startsWith("def ") || trimmed.startsWith("async def ")) {
      defIndex = i;
      break;
    }
  }
  if (defIndex === -1) return null;

  const defIndent = lines[defIndex].match(/^\s*/)?.[0].length ?? 0;
  let endIndex = lines.length;
  for (let i = defIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    if (indent <= defIndent) {
      endIndex = i;
      break;
    }
  }

  const start = lines.slice(0, defIndex).join("\n").length + (defIndex === 0 ? 0 : 1);
  const end = lines.slice(0, endIndex).join("\n").length;
  return { start, end, visible: code.slice(start, end) };
};

const extractVisibleCode = (fullCode, language) => {
  if (!fullCode) return null;
  const normalized = fullCode.replace(/\r\n/g, "\n");
  const markerIndex = findMarkerIndex(normalized);
  if (markerIndex === -1) return null;
  if (language === "python") {
    return extractPythonFunction(normalized, markerIndex);
  }
  return extractBraceFunction(normalized, markerIndex);
};


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [fullCode, setFullCode] = useState('');
  const [codeRegion, setCodeRegion] = useState(null);
  const [showFullCode, setShowFullCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let {problemId}  = useParams();

  const runTestCases = runResult?.testCases || [];
  const hasRunTestCases = runTestCases.length > 0;
  

 useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
       
       
        const saved = localStorage.getItem(getDraftKey(problemId, selectedLanguage));
        const initialFullCode = getFullCode(response.data, selectedLanguage);
        const normalizedFullCode = initialFullCode.replace(/\r\n/g, "\n");
        const extracted = extractVisibleCode(normalizedFullCode, selectedLanguage);
        const normalizedSaved = saved ? saved.replace(/\r\n/g, "\n") : null;
        const savedExtracted = normalizedSaved ? extractVisibleCode(normalizedSaved, selectedLanguage) : null;
        const visibleDefault = extracted?.visible || normalizedFullCode;
        const codeToSet = saved && saved.length > 0
          ? (savedExtracted?.visible || saved)
          : visibleDefault;

        setProblem(response.data);
        setFullCode(normalizedFullCode);
        setCodeRegion(extracted ? { start: extracted.start, end: extracted.end } : null);
        setCode(codeToSet);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const saved = localStorage.getItem(getDraftKey(problemId, selectedLanguage));
      const initialFullCode = getFullCode(problem, selectedLanguage);
      const normalizedFullCode = initialFullCode.replace(/\r\n/g, "\n");
      const extracted = extractVisibleCode(normalizedFullCode, selectedLanguage);
      const normalizedSaved = saved ? saved.replace(/\r\n/g, "\n") : null;
      const savedExtracted = normalizedSaved ? extractVisibleCode(normalizedSaved, selectedLanguage) : null;
      const visibleDefault = extracted?.visible || normalizedFullCode;
      const codeToSet = saved && saved.length > 0
        ? (savedExtracted?.visible || saved)
        : visibleDefault;
      setFullCode(normalizedFullCode);
      setCodeRegion(extracted ? { start: extracted.start, end: extracted.end } : null);
      setCode(codeToSet);
    }
  }, [selectedLanguage, problem, problemId]);

  useEffect(() => {
    if (!problemId || !problem) return;
    localStorage.setItem(getDraftKey(problemId, selectedLanguage), code);
  }, [code, problemId, selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const mergedCode = codeRegion
        ? fullCode.slice(0, codeRegion.start) + code + fullCode.slice(codeRegion.end)
        : code;

      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code: mergedCode,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const mergedCode = codeRegion
          ? fullCode.slice(0, codeRegion.start) + code + fullCode.slice(codeRegion.end)
          : code;

        const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: mergedCode,
        language: selectedLanguage
      });

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      case 'python': return 'python';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-base-content/60';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-base-100">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-base-300">
        {/* Left Tabs */}
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button 
            className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('editorial')}
          >
            Editorial
          </button>
          <button 
            className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('solutions')}
          >
            Solutions
          </button>
          <button 
            className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('submissions')}
          >
            Submissions
          </button>

          <button 
            className={`tab ${activeLeftTab === 'chatAI' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('chatAI')}
          >
            ChatAI
          </button>


        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-primary">{problem.tags}</div>
                  </div>

                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases?.map((example, index) => (
                        <div key={index} className="bg-base-200 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution && problem.referenceSolution.length > 0 ? (
                      problem.referenceSolution.map((solution, index) => (
                        <div key={index} className="border border-base-300 rounded-lg">
                          <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                            <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                          </div>
                          <div className="p-4">
                            <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-base-content/60">Solutions will be available after you solve the problem.</p>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className="text-base-content/60">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <ChatAi problem={problem}></ChatAi>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button 
            className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}
            onClick={() => setActiveRightTab('code')}
          >
            Code
          </button>
          <button 
            className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
            onClick={() => setActiveRightTab('testcase')}
          >
            Testcase
          </button>
          <button 
            className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}
            onClick={() => setActiveRightTab('result')}
          >
            Result
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp', 'python'].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang === 'java' ? 'Java' : 'Python'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`btn btn-sm ${showFullCode ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setShowFullCode((prev) => !prev)}
                    type="button"
                  >
                    {showFullCode ? 'Hide full code' : 'Show full code'}
                  </button>
                  <span className="text-xs text-base-content/60">
                    {showFullCode ? 'Read-only view' : 'Function only'}
                  </span>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 min-h-[320px] h-[50vh] lg:h-auto">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={showFullCode ? (fullCode || code) : code}
                  onChange={showFullCode ? undefined : handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: showFullCode,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-base-300 flex justify-between">
                <div className="flex gap-2">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult ? (
                <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
                  <div>
                    {runResult.success ? (
                      <div>
                        <h4 className="font-bold">All test cases passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
                        <p className="text-sm">Memory: {runResult.memory+" KB"}</p>
                        
                        <div className="mt-4 space-y-2">
                          {hasRunTestCases ? runTestCases.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={'text-green-600'}>
                                  {'Passed'}
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="text-sm text-base-content/60">No test cases returned.</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">Error</h4>
                        {runResult.error && (
                          <p className="text-sm mt-2">{runResult.error}</p>
                        )}
                        <div className="mt-4 space-y-2">
                          {hasRunTestCases ? runTestCases.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
                                  {tc.status_id==3 ? 'Passed' : 'Failed'}
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="text-sm text-base-content/60">No test cases returned.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-base-content/60">
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitResult ? (
                <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
                  <div>
                    {submitResult.accepted ? (
                      <div>
                        <h4 className="font-bold text-lg">Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                          <p>Runtime: {submitResult.runtime + " sec"}</p>
                          <p>Memory: {submitResult.memory + "KB"} </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg">Error: {submitResult.error}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-base-content/60">
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
