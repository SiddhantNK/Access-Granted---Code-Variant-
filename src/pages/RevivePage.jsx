import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * RevivePage - Continue working on a project or choose a project to revive
 */

const RevivePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, getProject, setRevivalPath, logProgress } = useProjects();
  const [progress, setProgress] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);

  const revivalPaths = [
    { name: 'Revive', description: 'Continue actively developing from where you paused' },
    { name: 'Reborn', description: 'Restart with a cleaner, smaller scope or new stack' },
    { name: 'Pivot', description: 'Change product direction while preserving past code' },
    { name: 'Salvage', description: 'Extract components, hooks, or assets for other apps' },
    { name: 'Lay to Rest', description: 'Mark at peace with final learnings documented' },
  ];

  // If no projectId or general overview, let user select which project to revive
  if (!projectId || projectId === 'overview') {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-slideUp">
            <GhostMascot size="lg" expression="auto" animated={true} trackMouse={true} className="mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent mb-2">
              Revive & Awaken Projects
            </h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Select an archived project from your graveyard to update its roadmap, log progress, or choose a revival path.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/revive/${p.id}`)}
                className="p-6 rounded-2xl bg-slate-900/70 border border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group flex items-start justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                      {p.category}
                    </span>
                    <span className="text-xs text-white/40">Status: {p.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-white/60 text-xs mt-1 line-clamp-2">{p.epitaph}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all mt-2 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const project = getProject(projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center animate-fadeIn max-w-md">
          <GhostMascot size="lg" expression="sad" animated={true} className="mb-4 mx-auto" />
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-white/60 text-sm mb-6">This vault record may have been archived or removed.</p>
          <Link to="/crypt" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            ← Browse the Crypt
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (progress.trim()) {
      logProgress(projectId, progress);
    }
    if (selectedPath) {
      setRevivalPath(projectId, selectedPath);
    }
    navigate(`/grave/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/70 border-b border-purple-500/20 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(`/grave/${projectId}`)}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-3 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Grave
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
            Revive: {project.name}
          </h1>
          <p className="text-white/50 text-xs mt-1">Determine the next chapter for this idea</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          
          {/* Ghost Guide */}
          <div className="text-center animate-slideUp">
            <GhostMascot size="md" expression="thinking" animated={true} trackMouse={true} className="mx-auto mb-3" />
            <p className="text-white/60 text-xs">Ready to give this project a new pulse?</p>
          </div>

          {/* Progress Section */}
          <section className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-6 animate-slideUp">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span>Log Recent Progress or Ideas</span>
            </h2>
            <p className="text-xs text-white/50 mb-3">Record what you worked on or any new inspiration.</p>
            <textarea
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              placeholder="e.g. Cleared node_modules, redesigned landing hero, or wrote new API specs..."
              className="w-full bg-slate-950/70 border border-purple-500/20 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-400 min-h-28 transition-all"
            />
          </section>

          {/* Revival Paths */}
          <section className="animate-slideUp" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Select Revival Path</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-3.5">
              {revivalPaths.map((path) => (
                <button
                  key={path.name}
                  type="button"
                  onClick={() => setSelectedPath(path.name)}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    selectedPath === path.name
                      ? 'bg-purple-600/25 border-purple-400 shadow-md shadow-purple-950/30'
                      : 'bg-slate-900/60 border-purple-500/20 hover:border-purple-500/50'
                  }`}
                >
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>{path.name}</span>
                    {selectedPath === path.name && <span className="text-xs text-purple-300">Selected</span>}
                  </h3>
                  <p className="text-white/50 text-xs mt-1.5 leading-relaxed">{path.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-purple-900/30 text-sm"
          >
            Save Decisions & Return to Grave
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevivePage;
