import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { motion } from 'framer-motion';

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoadingProblems(true);
        setError(null);
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to load problems');
      } finally {
        setLoadingProblems(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSolvedProblems([]);
    }
  }, [user]);

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const solved = solvedProblems.some(sp => sp._id === problem._id);
    const statusMatch =
      filters.status === 'all' ||
      (filters.status === 'solved' && solved) ||
      (filters.status === 'unsolved' && !solved);
    const searchMatch =
      !filters.search ||
      problem.title?.toLowerCase().includes(filters.search.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  return (
    <div className="container mx-auto p-4">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden p-8 lg:p-12 mb-10 bg-base-100 border border-base-300 shadow-sm"
      >
        <div className="absolute -top-10 -right-10 h-24 w-24 bg-primary/10 border border-base-300"></div>
        <div className="absolute -bottom-12 -left-12 h-28 w-28 bg-accent/10 border border-base-300"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-5xl font-black mt-2">
              AlgoHub. Practice algorithms the right way.
            </h1>
            <p className="mt-3 max-w-2xl font-medium">
              Solve problems, ship clean solutions, and level up with editorials
              and AI hints.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#problems" className="btn btn-primary">
                Explore Problems
              </a>
              <NavLink to="/profile" className="btn btn-outline">
                View Profile
              </NavLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-base-200 border border-base-300 p-4 shadow-sm">
              <div className="text-2xl font-bold">{problems.length}</div>
              <div className="text-xs uppercase tracking-wide">Total problems</div>
            </div>
            <div className="bg-base-200 border border-base-300 p-4 shadow-sm">
              <div className="text-2xl font-bold">{solvedProblems.length}</div>
              <div className="text-xs uppercase tracking-wide">Solved</div>
            </div>
            <div className="bg-base-200 border border-base-300 p-4 shadow-sm">
              <div className="text-2xl font-bold">{filters.tag}</div>
              <div className="text-xs uppercase tracking-wide">Current tag</div>
            </div>
            <div className="bg-base-200 border border-base-300 p-4 shadow-sm">
              <div className="text-2xl font-bold">{filters.difficulty}</div>
              <div className="text-xs uppercase tracking-wide">Difficulty</div>
            </div>
          </div>
        </div>
      </motion.section>

        {/* Filters */}
        <div id="problems" className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            className="input input-bordered flex-1 min-w-[200px]"
            placeholder="Search problems"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          {/* New Status Filter */}
          <select 
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
            <option value="unsolved">Unsolved Problems</option>
          </select>

          <select 
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        {loadingProblems && (
          <div className="flex justify-center items-center h-48">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {error && !loadingProblems && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {!loadingProblems && !error && filteredProblems.length === 0 && (
          <div className="alert alert-info">
            <span>No problems match your filters.</span>
          </div>
        )}

        {!loadingProblems && !error && (
          <div className="grid gap-4">
            {filteredProblems.map((problem, index) => {
              const solved = solvedProblems.some(sp => sp._id === problem._id);
              return (
                <motion.div
                  key={problem._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  whileHover={{ y: -4 }}
                  className="card bg-base-100 shadow-xl border border-base-300/60 hover:shadow-2xl transition-all"
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <h2 className="card-title text-lg">
                        <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                          {problem.title}
                        </NavLink>
                      </h2>
                      {solved && (
                        <div className="badge badge-success gap-2">
                          <span className="h-2 w-2 rounded-full bg-white/80"></span>
                          Solved
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </div>
                      <div className="badge badge-info badge-outline">
                        {problem.tags}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;
