import { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { toast } from 'react-hot-toast';
import LoadingLottie from '../components/LoadingLottie';

const presets = [
  'DevOps Engineer',
  'Fullstack Developer',
  'Blockchain Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'Data Engineer',
  'Machine Learning Engineer'
];

const toArray = (value) => (Array.isArray(value) ? value : []);

function Roadmap() {
  const [roleOrSubject, setRoleOrSubject] = useState('');
  const [includeInterviewQuestions, setIncludeInterviewQuestions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!roleOrSubject.trim()) {
      toast.error('Please enter a role or subject.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axiosClient.post('/ai/buildRoadmap', {
        roleOrSubject: roleOrSubject.trim(),
        includeInterviewQuestions
      });
      const data = response.data?.data || response.data;
      setRoadmapData(data);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Failed to generate roadmap';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!roadmapData) return;
    const printWindow = window.open('', '_blank', 'width=900,height=900');
    if (!printWindow) return;

    const roadmapHtml = `
      <html>
        <head>
          <title>${roadmapData.title || 'Roadmap'}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1f2937; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 18px; margin-top: 24px; }
            h3 { font-size: 16px; margin: 16px 0 8px; }
            .muted { color: #6b7280; font-size: 12px; }
            .phase { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
            ul, ol { margin: 6px 0 12px 18px; }
          </style>
        </head>
        <body>
          <h1>${roadmapData.title || 'Roadmap'}</h1>
          <div class="muted">${roadmapData.roleOrSubject || ''}</div>
          <p>${roadmapData.summary || ''}</p>
          ${(roadmapData.roadmap || [])
            .map((phase, idx) => `
              <div class="phase">
                <h3>${phase.phase || `Phase ${idx + 1}`}</h3>
                <div class="muted">${phase.duration || ''}</div>
                ${phase.focus?.length ? `<strong>Focus</strong><ul>${phase.focus.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
                ${phase.topics?.length ? `<strong>Topics</strong><ul>${phase.topics.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
                ${phase.projects?.length ? `<strong>Projects</strong><ul>${phase.projects.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
                ${phase.milestones?.length ? `<strong>Milestones</strong><ul>${phase.milestones.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
              </div>
            `)
            .join('')}
          ${(roadmapData.interviewQuestions || []).length ? `
            <h2>Interview Questions</h2>
            <ol>${roadmapData.interviewQuestions.map((q) => `<li>${q}</li>`).join('')}</ol>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(roadmapHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section className="relative overflow-hidden bg-base-100 border border-base-300 shadow-lg p-8">
        <div className="absolute -top-12 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl"></div>
        <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-accent/20 blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-black">AI Roadmap Builder</h1>
          <p className="mt-3 max-w-2xl text-base-content/80">
            Pick a role or mastery area and get a clean, outcome-focused roadmap with a curated interview prep list.
          </p>
        </div>
      </section>

      <section className="card bg-base-100 shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Role or Mastery Area</span>
            </label>
            <input
              className="input input-bordered"
              placeholder="e.g., DevOps Engineer, Fullstack Developer, Blockchain"
              value={roleOrSubject}
              onChange={(e) => setRoleOrSubject(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                className="btn btn-xs btn-outline"
                onClick={() => setRoleOrSubject(preset)}
              >
                {preset}
              </button>
            ))}
          </div>

          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={includeInterviewQuestions}
              onChange={(e) => setIncludeInterviewQuestions(e.target.checked)}
            />
            <span className="label-text">Generate 20 most asked interview questions</span>
          </label>

          <button
            type="submit"
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            Generate Roadmap
          </button>
        </form>
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}
        {loading && <LoadingLottie label="Generating roadmap..." size={160} />}
      </section>

      {roadmapData && (
        <section className="space-y-6">
          <div className="card bg-base-100 shadow-lg p-6">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {roadmapData.title || 'Your Roadmap'}
                </h2>
                {roadmapData.roleOrSubject && (
                  <span className="badge badge-primary badge-outline">
                    {roadmapData.roleOrSubject}
                  </span>
                )}
              </div>
              <button type="button" className="btn btn-sm btn-outline" onClick={handleDownload}>
                Download PDF
              </button>
            </div>
            {roadmapData.summary && (
              <p className="mt-3 text-base-content/80">
                {roadmapData.summary}
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-primary via-accent to-secondary opacity-40"></div>
            <div className="space-y-6 pl-10">
              {toArray(roadmapData.roadmap).map((phase, index) => (
                <div key={`${phase.phase}-${index}`} className="relative">
                  <div className="absolute -left-7 top-4 h-4 w-4 rounded-full bg-primary shadow"></div>
                  <div className="card bg-base-100 border border-base-300 shadow-md">
                    <div className="card-body space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold">{phase.phase || `Phase ${index + 1}`}</h3>
                          {phase.duration && (
                            <p className="text-xs uppercase tracking-wider text-base-content/60 mt-1">
                              {phase.duration}
                            </p>
                          )}
                        </div>
                        <span className="badge badge-outline">{`Step ${index + 1}`}</span>
                      </div>

                      {toArray(phase.focus).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {phase.focus.map((item, idx) => (
                            <span key={`focus-${idx}`} className="badge badge-primary">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      {toArray(phase.topics).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Topics</h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.topics.map((topic, idx) => (
                              <span key={`topic-${idx}`} className="badge badge-outline">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {toArray(phase.projects).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Projects</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {phase.projects.map((project, idx) => (
                              <li key={`project-${idx}`}>{project}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {toArray(phase.milestones).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Milestones</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {phase.milestones.map((milestone, idx) => (
                              <li key={`milestone-${idx}`}>{milestone}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {toArray(roadmapData.interviewQuestions).length > 0 && (
            <div className="card bg-base-100 shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Interview Questions</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {roadmapData.interviewQuestions.map((question, idx) => (
                  <div key={`question-${idx}`} className="bg-base-200 p-3 rounded-lg text-sm">
                    <span className="font-semibold mr-2">{idx + 1}.</span>
                    {question}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Roadmap;
