import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Download, ExternalLink, ChevronDown } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * GraveView - Individual project detailed view
 */

const GraveView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, deleteProject, calculateHealthScore, addTimelineEvent } = useProjects();
  const [showDelete, setShowDelete] = useState(false);
  const [expandTimeline, setExpandTimeline] = useState(false);

  const project = getProject(projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <GhostMascot size="lg" expression="sad" animated={true} className="mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-white/60 mb-8">This project may have been deleted</p>
          <Link to="/dashboard" className="text-purple-400 hover:text-purple-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const healthScore = calculateHealthScore(project);
  const createdDate = new Date(project.createdAt);
  const updatedDate = new Date(project.updatedAt);

  const handleDelete = () => {
    deleteProject(projectId);
    navigate('/dashboard');
  };

  const revivalPaths = [
    { name: 'Revive', icon: '🔄', description: 'Continue from where it stopped' },
    { name: 'Reborn', icon: '🌱', description: 'Restart with clearer scope' },
    { name: 'Pivot', icon: '↪️', description: 'Change direction but keep value' },
    { name: 'Salvage', icon: '🧩', description: 'Reuse parts elsewhere' },
    { name: 'Lay to Rest', icon: '⚡', description: 'Archive peacefully' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-purple-500/20 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 animate-slideUp">
              <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-white/60 italic">{project.epitaph}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to={`/revive/${projectId}`}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95"
              >
                Continue
              </Link>
              <button
                onClick={() => setShowDelete(true)}
                className="p-2 text-white/60 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          
          {/* Status & Metadata */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideUp">
            <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Status</p>
              <p className="text-white font-semibold">{project.status}</p>
            </div>
            
            <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Revival Path</p>
              <p className="text-white font-semibold">{project.revivalPath || 'None'}</p>
            </div>
            
            <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Health Score</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-lg">{healthScore}%</p>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      healthScore >= 80
                        ? 'bg-green-500'
                        : healthScore >= 60
                        ? 'bg-yellow-500'
                        : healthScore >= 40
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Last Updated</p>
              <p className="text-white font-semibold text-sm">{updatedDate.toLocaleDateString()}</p>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Original Idea */}
              <section className="animate-slideUp" style={{ animationDelay: '100ms' }}>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📋</span> Original Idea
                </h2>
                <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                  <p className="text-white/80 leading-relaxed">{project.originalIdea}</p>
                </div>
              </section>

              {/* Completed Work */}
              <section className="animate-slideUp" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>✅</span> Completed Work ({project.completed.length})
                </h2>
                <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 space-y-3">
                  {project.completed.length > 0 ? (
                    project.completed.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-white">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No completed items recorded</p>
                  )}
                </div>
              </section>

              {/* Unfinished Work */}
              <section className="animate-slideUp" style={{ animationDelay: '300ms' }}>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>⏳</span> Unfinished Work ({project.unfinished.length})
                </h2>
                <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 space-y-3">
                  {project.unfinished.length > 0 ? (
                    project.unfinished.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-white">
                        <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No unfinished items recorded</p>
                  )}
                </div>
              </section>

              {/* Why It Paused */}
              <section className="animate-slideUp" style={{ animationDelay: '400ms' }}>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>⏸️</span> Why It Paused
                </h2>
                <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                  <p className="text-white/80">{project.pauseReason}</p>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              
              {/* Ghost & Next Step */}
              <div style={{ animationDelay: '500ms' }} className="animate-slideUp bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 text-center">
                <GhostMascot size="md" expression="thinking" animated={true} className="mx-auto mb-4" />
                {project.nextSmallestStep ? (
                  <div>
                    <p className="text-white/60 text-sm mb-2">Next Smallest Step</p>
                    <p className="text-white font-semibold">{project.nextSmallestStep}</p>
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">No next step defined yet</p>
                )}
              </div>

              {/* Salvage Tags */}
              {project.salvageTags.length > 0 && (
                <section className="animate-slideUp" style={{ animationDelay: '600ms' }}>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span>🏷️</span> Salvage Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.salvageTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-purple-600/20 text-purple-300 text-sm rounded-lg font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* External Links */}
              {(project.links.github || project.links.demo || project.links.notes) && (
                <section className="animate-slideUp" style={{ animationDelay: '700ms' }}>
                  <h3 className="text-lg font-bold text-white mb-3">External Links</h3>
                  <div className="space-y-2">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                    {project.links.notes && (
                      <a
                        href={project.links.notes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Notes
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Project Metadata */}
              <section style={{ animationDelay: '800ms' }} className="animate-slideUp text-sm text-white/60 space-y-2">
                <p>Created: {createdDate.toLocaleDateString()}</p>
                <p>Category: {project.category}</p>
              </section>
            </div>
          </div>

          {/* Timeline */}
          <section className="animate-slideUp" style={{ animationDelay: '900ms' }}>
            <button
              onClick={() => setExpandTimeline(!expandTimeline)}
              className="flex items-center gap-2 text-xl font-bold text-white mb-6 hover:text-purple-300 transition-colors w-full"
            >
              <span>🕐</span> Timeline ({project.timeline.length})
              <ChevronDown
                className={`w-5 h-5 ml-auto transition-transform ${expandTimeline ? 'rotate-180' : ''}`}
              />
            </button>

            {expandTimeline && (
              <div className="space-y-4">
                {project.timeline
                  .slice()
                  .reverse()
                  .map((event) => (
                    <div key={event.id} className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4 animate-slideUp">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-white font-semibold capitalize">{event.type}</p>
                          {event.note && <p className="text-white/60 text-sm mt-1">{event.note}</p>}
                        </div>
                        <p className="text-white/40 text-sm whitespace-nowrap">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/20 rounded-lg p-8 max-w-md w-full animate-scaleIn">
            <GhostMascot size="lg" expression="scared" animated={true} className="mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white text-center mb-4">Delete Project?</h3>
            <p className="text-white/60 text-center mb-8">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraveView;
