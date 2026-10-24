import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Tag, AlertTriangle, Trophy, Download, ArrowUpRight } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * Autopsy - Project abandonment patterns & graveyard analytics
 */
const Autopsy = () => {
  const { getAnalytics, exportData, projects } = useProjects();
  const analytics = getAnalytics();

  const handleExportAll = () => {
    exportData();
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      
      {/* Header */}
      <section className="bg-theme-surface border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent" />
                <span className="text-xs font-mono uppercase tracking-wider text-theme-text-muted">
                  Post-Mortem Analysis
                </span>
              </div>
              <h1 className="text-3xl font-serif-title font-semibold text-theme-text mt-1">
                Autopsy Report
              </h1>
              <p className="text-xs sm:text-sm text-theme-text-muted mt-1">
                Honest metrics on why projects stall, most reusable assets, and revival potential.
              </p>
            </div>

            <button
              onClick={handleExportAll}
              className="px-4 py-2 rounded-lg border border-theme-border text-xs font-medium text-theme-text hover:bg-theme-surface-secondary flex items-center gap-1.5 transition-colors shadow-sm"
              title="Export Full Graveyard JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Records (JSON)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Analytics Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Metric Cards Row */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-theme-accent" />
            <h2 className="text-sm font-serif-title font-semibold uppercase tracking-wider text-theme-text">
              Key Metrics Overview
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-theme-surface border border-theme-border rounded-xl shadow-sm">
              <p className="text-[11px] font-mono uppercase text-theme-text-muted">Total Buried</p>
              <p className="text-3xl font-serif-title font-semibold text-theme-text mt-1">{analytics.total}</p>
              <p className="text-[11px] text-theme-text-subtle mt-0.5">Projects archived</p>
            </div>
            <div className="p-5 bg-theme-surface border border-theme-border rounded-xl shadow-sm">
              <p className="text-[11px] font-mono uppercase text-theme-text-muted">Average Dormancy</p>
              <p className="text-3xl font-serif-title font-semibold text-theme-text mt-1">{analytics.averageAge}d</p>
              <p className="text-[11px] text-theme-text-subtle mt-0.5">Days since creation</p>
            </div>
            <div className="p-5 bg-theme-surface border border-theme-border rounded-xl shadow-sm">
              <p className="text-[11px] font-mono uppercase text-theme-text-muted">Average Health</p>
              <p className="text-3xl font-serif-title font-semibold text-theme-accent mt-1">{analytics.averageHealthScore}%</p>
              <p className="text-[11px] text-theme-text-subtle mt-0.5">Revival feasibility</p>
            </div>
            <div className="p-5 bg-theme-surface border border-theme-border rounded-xl shadow-sm">
              <p className="text-[11px] font-mono uppercase text-theme-text-muted">Stale Archives</p>
              <p className="text-3xl font-serif-title font-semibold text-theme-gold mt-1">{analytics.staleProjects.length}</p>
              <p className="text-[11px] text-theme-text-subtle mt-0.5">Untouched &gt; 90 days</p>
            </div>
          </div>
        </section>

        {/* Two-Column Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Status Breakdown */}
          <section className="p-6 bg-theme-surface border border-theme-border rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-serif-title font-semibold uppercase tracking-wider text-theme-text">
              Projects by Status
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.byStatus).map(([status, count]) => {
                const percentage = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-theme-text">{status}</span>
                      <span className="font-mono text-theme-text-muted">{count} ({percentage}%)</span>
                    </div>
                    <div className="bg-theme-surface-secondary rounded-full h-2 overflow-hidden border border-theme-border/40">
                      <div
                        className="bg-theme-accent h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pause Reasons */}
          <section className="p-6 bg-theme-surface border border-theme-border rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-theme-gold" />
              <h3 className="text-sm font-serif-title font-semibold uppercase tracking-wider text-theme-text">
                Common Inactivity Reasons
              </h3>
            </div>
            <div className="space-y-3">
              {Object.entries(analytics.abandonmentReasons).length > 0 ? (
                Object.entries(analytics.abandonmentReasons)
                  .sort((a, b) => b[1] - a[1])
                  .map(([reason, count]) => {
                    const percentage = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                    return (
                      <div key={reason} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-theme-text truncate pr-2">{reason}</span>
                          <span className="font-mono text-theme-text-muted flex-shrink-0">{count} ({percentage}%)</span>
                        </div>
                        <div className="bg-theme-surface-secondary rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-theme-gold h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-xs text-theme-text-subtle italic">No pause reasons recorded yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Salvage Tags Frequency */}
        {Object.keys(analytics.salvageTags).length > 0 && (
          <section className="p-6 bg-theme-surface border border-theme-border rounded-xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-theme-accent" />
              <h3 className="text-sm font-serif-title font-semibold uppercase tracking-wider text-theme-text">
                Most Frequent Salvage Assets
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(analytics.salvageTags)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15)
                .map(([tag, count]) => (
                  <div
                    key={tag}
                    className="px-2.5 py-1 bg-theme-surface-secondary border border-theme-border rounded-lg text-xs font-mono text-theme-text flex items-center gap-1.5"
                  >
                    <span>{tag}</span>
                    <span className="text-[10px] text-theme-accent font-bold">×{count}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* High Potential Revival Candidates */}
        {analytics.highestPotential.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-theme-gold" />
              <h2 className="text-sm font-serif-title font-semibold uppercase tracking-wider text-theme-text">
                Strongest Revival Candidates
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.highestPotential.map((project) => (
                <Link
                  key={project.id}
                  to={`/grave/${project.id}`}
                  className="p-5 bg-theme-surface border border-theme-border hover:border-theme-accent/60 rounded-xl transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-theme-text group-hover:text-theme-accent transition-colors truncate">
                        {project.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-theme-accent">
                        {project.health}%
                      </span>
                    </div>
                    <p className="text-xs text-theme-text-muted line-clamp-2 mb-3">
                      {project.epitaph || project.originalIdea}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-theme-text-subtle pt-3 border-t border-theme-border/60">
                    <span>{project.completed?.length || 0} completed parts</span>
                    <span className="text-theme-accent font-medium flex items-center gap-0.5">
                      Review <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Autopsy;
