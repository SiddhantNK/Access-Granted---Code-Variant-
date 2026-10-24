import React from 'react';
import { Link } from 'react-router-dom';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * Autopsy - Project analytics and insights
 */

const Autopsy = () => {
  const { getAnalytics } = useProjects();
  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-purple-500/20 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Autopsy Report</h1>
          <p className="text-white/60">Analytics & insights about your graveyard</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          
          {/* Key Metrics */}
          <section className="animate-slideUp">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📊</span> Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 animate-scaleIn">
                <p className="text-white/60 text-sm mb-2">Total Projects</p>
                <p className="text-4xl font-bold text-white">{analytics.total}</p>
              </div>
              
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 animate-scaleIn" style={{ animationDelay: '50ms' }}>
                <p className="text-white/60 text-sm mb-2">Average Age</p>
                <p className="text-4xl font-bold text-white">{analytics.averageAge}d</p>
              </div>
              
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 animate-scaleIn" style={{ animationDelay: '100ms' }}>
                <p className="text-white/60 text-sm mb-2">Health Score</p>
                <p className="text-4xl font-bold text-white">{analytics.averageHealthScore}%</p>
              </div>
              
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 animate-scaleIn" style={{ animationDelay: '150ms' }}>
                <p className="text-white/60 text-sm mb-2">Stale</p>
                <p className="text-4xl font-bold text-white">{analytics.staleProjects.length}</p>
              </div>
            </div>
          </section>

          {/* Status Breakdown */}
          <section className="animate-slideUp" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🏷️</span> Projects by Status
            </h2>
            <div className="space-y-3">
              {Object.entries(analytics.byStatus).map(([status, count], idx) => (
                <div key={status} className="animate-slideUp" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{status}</p>
                    <p className="text-white/60">{count} project{count !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-purple-500 h-full rounded-full transition-all"
                      style={{
                        width: `${(count / analytics.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Tags */}
          {Object.keys(analytics.salvageTags).length > 0 && (
            <section className="animate-slideUp" style={{ animationDelay: '300ms' }}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🏷️</span> Most Common Salvage Tags
              </h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(analytics.salvageTags)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([tag, count]) => (
                    <div
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-purple-500/30 border border-purple-500/50 rounded-lg text-white font-medium"
                    >
                      {tag}
                      <span className="text-white/60 ml-2">({count})</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Top Abandonment Reasons */}
          {Object.keys(analytics.abandonmentReasons).length > 0 && (
            <section className="animate-slideUp" style={{ animationDelay: '400ms' }}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>😢</span> Most Common Pause Reasons
              </h2>
              <div className="space-y-3">
                {Object.entries(analytics.abandonmentReasons)
                  .sort((a, b) => b[1] - a[1])
                  .map(([reason, count], idx) => (
                    <div key={reason} className="animate-slideUp" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-medium text-sm">{reason}</p>
                        <p className="text-white/60 text-sm">{count} project{count !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full"
                          style={{
                            width: `${(count / analytics.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* High Potential Projects */}
          {analytics.highestPotential.length > 0 && (
            <section className="animate-slideUp" style={{ animationDelay: '500ms' }}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🏆</span> Revival Candidates
              </h2>
              <div className="space-y-4">
                {analytics.highestPotential.map((project, idx) => (
                  <Link
                    key={project.id}
                    to={`/grave/${project.id}`}
                    className="block bg-slate-800/50 hover:bg-slate-800/80 border border-purple-500/20 hover:border-purple-500/50 rounded-lg p-6 transition-all animate-slideUp"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                        <p className="text-white/60 text-sm mb-3">{project.epitaph}</p>
                        <p className="text-white/40 text-xs">
                          {project.completed.length} completed • {project.unfinished.length} unfinished
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">{project.health}%</p>
                        <p className="text-white/60 text-xs mt-1">potential</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Ghost Analytics */}
          <section style={{ animationDelay: '600ms' }} className="animate-slideUp bg-gradient-to-br from-purple-900/30 to-slate-900 border border-purple-500/20 rounded-lg p-8 text-center">
            <GhostMascot size="lg" expression="neutral" animated={true} className="mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">Your Graveyard is Alive</h3>
            <p className="text-white/60">
              {analytics.total} projects documented, {analytics.highestPotential.length} worth reviving
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Autopsy;
