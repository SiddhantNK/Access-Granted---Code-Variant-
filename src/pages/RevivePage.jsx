import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * RevivePage - Continue working on a project
 */

const RevivePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, setRevivalPath, logProgress } = useProjects();
  const [progress, setProgress] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);

  const project = getProject(projectId);

  if (!project) return null;

  const revivalPaths = [
    { name: 'Revive', icon: '🔄', description: 'Continue from where it stopped' },
    { name: 'Reborn', icon: '🌱', description: 'Restart with clearer scope' },
    { name: 'Pivot', icon: '↪️', description: 'Change direction but keep value' },
    { name: 'Salvage', icon: '🧩', description: 'Reuse parts elsewhere' },
    { name: 'Lay to Rest', icon: '⚡', description: 'Archive peacefully' },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-purple-500/20 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(`/grave/${projectId}`)}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-white">Revive: {project.name}</h1>
          <p className="text-white/60 mt-2">What's your next move?</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          
          {/* Ghost Guide */}
          <div className="text-center animate-slideUp">
            <GhostMascot size="lg" expression="thinking" animated={true} className="mx-auto mb-6" />
            <p className="text-white/60">Your ghost is here to guide you</p>
          </div>

          {/* Progress Section */}
          <section className="animate-slideUp">
            <h2 className="text-2xl font-bold text-white mb-4">Log Your Progress</h2>
            <textarea
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              placeholder="What have you worked on since the last update?"
              className="w-full bg-slate-800/50 border border-purple-500/20 rounded-lg p-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 min-h-32"
            />
          </section>

          {/* Revival Paths */}
          <section className="animate-slideUp" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Path</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {revivalPaths.map((path) => (
                <button
                  key={path.name}
                  onClick={() => setSelectedPath(path.name)}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    selectedPath === path.name
                      ? 'bg-purple-600/30 border-purple-500'
                      : 'bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{path.icon}</div>
                  <h3 className="text-lg font-bold text-white">{path.name}</h3>
                  <p className="text-white/60 text-sm mt-2">{path.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-4 rounded-lg transition-all duration-200 active:scale-95 animate-slideUp"
            style={{ animationDelay: '200ms' }}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevivePage;
