import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";

const getDraftLanguageStats = () => {
  const stats = { javascript: 0, java: 0, cpp: 0, python: 0 };
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("draft_")) continue;
    const parts = key.split("_");
    const language = parts[parts.length - 1];
    if (stats[language] !== undefined) {
      stats[language] += 1;
    }
  }
  return stats;
};

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [allRes, solvedRes] = await Promise.all([
          axiosClient.get("/problem/getAllProblem"),
          axiosClient.get("/problem/problemSolvedByUser")
        ]);
        setProblems(allRes.data || []);
        setSolvedProblems(solvedRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile stats");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const solvedIds = useMemo(
    () => new Set(solvedProblems.map((p) => p._id)),
    [solvedProblems]
  );

  const totalProblems = problems.length;
  const solvedCount = solvedProblems.length;
  const unsolvedCount = Math.max(totalProblems - solvedCount, 0);

  const difficultyStats = useMemo(() => {
    const base = {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    };
    problems.forEach((p) => {
      const diff = p.difficulty?.toLowerCase();
      if (!base[diff]) return;
      base[diff].total += 1;
      if (solvedIds.has(p._id)) base[diff].solved += 1;
    });
    return base;
  }, [problems, solvedIds]);

  const lastActive = localStorage.getItem("last_active");
  const lastActiveLabel = lastActive
    ? new Date(lastActive).toLocaleString()
    : "Not available";

  const draftStats = useMemo(() => getDraftLanguageStats(), []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold">
            {user?.firstName || "User"}'s Profile
          </h1>
          <p className="text-base-content/70 mt-2">
            Track your progress and activity across AlgoHub.
          </p>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Last active</div>
            <div className="stat-value text-lg">{lastActiveLabel}</div>
            <div className="stat-desc">Local activity</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Problems</h2>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-3xl font-bold">{totalProblems}</div>
                <div className="text-sm opacity-60">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">
                  {solvedCount}
                </div>
                <div className="text-sm opacity-60">Solved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-warning">
                  {unsolvedCount}
                </div>
                <div className="text-sm opacity-60">Unsolved</div>
              </div>
            </div>
            <div className="mt-4">
              <progress
                className="progress progress-primary w-full"
                value={totalProblems === 0 ? 0 : solvedCount}
                max={Math.max(totalProblems, 1)}
              ></progress>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Difficulty Breakdown</h2>
            {["easy", "medium", "hard"].map((diff) => (
              <div key={diff} className="flex items-center justify-between mt-2">
                <span className="capitalize">{diff}</span>
                <span className="font-mono">
                  {difficultyStats[diff].solved}/{difficultyStats[diff].total}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Language Usage</h2>
            <p className="text-sm text-base-content/60">
              Based on local draft activity.
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span>JavaScript</span>
                <span className="font-mono">{draftStats.javascript}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Java</span>
                <span className="font-mono">{draftStats.java}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>C++</span>
                <span className="font-mono">{draftStats.cpp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Python</span>
                <span className="font-mono">{draftStats.python}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Solved Problems</h2>
            {solvedProblems.length === 0 ? (
              <div className="alert alert-info mt-2">
                <span>No solved problems yet.</span>
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                {solvedProblems.slice(0, 6).map((problem) => (
                  <div
                    key={problem._id}
                    className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
                  >
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="font-medium hover:text-primary"
                    >
                      {problem.title}
                    </NavLink>
                    <span className="badge badge-outline capitalize">
                      {problem.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Progress Tips</h2>
            <ul className="list-disc pl-5 space-y-2 text-base-content/70">
              <li>Complete one problem from each difficulty daily.</li>
              <li>Review editorials after you solve a problem.</li>
              <li>Track your drafts to improve solution quality.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
