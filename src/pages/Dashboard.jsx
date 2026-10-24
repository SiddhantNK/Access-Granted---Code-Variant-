import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, TrendingUp, Clock, Moon, Sparkles, Sprout, Archive, FileText, Code2, Flame } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * Dashboard - Main graveyard view
 * 
 * Shows:
 * - Time capsule due projects
 * - Resting projects
 * - Revived projects
 * - Quick actions
 */

const Dashboard = () => {
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');

  const categorizedProjects = {
    timeCapsule: projects.filter((p) => p.revisitAt && new Date(p.revisitAt) <= new Date()),
    resting: projects.filter((p) => p.status === 'Resting'),
    revived: projects.filter((p) => p.status === 'Revived'),
  };

  const ProjectCard = ({ project }) => (
    <Link
      to={`/grave/${project.id}`}
      className="bg-slate-800/50 hover:bg-slate-800/80 border border-purple-500/20 hover:border-purple-500/50 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 group"
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-white/60 text-sm line-clamp-2">{project.epitaph}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2 flex-wrap">
            {project.salvageTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              project.status === 'Fresh Grave'
                ? 'bg-cyan-500/20 text-cyan-300'
                : project.status === 'Resting'
                ? 'bg-gray-500/20 text-gray-300'
                : 'bg-green-500/20 text-green-300'
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-[28rem] h-[28rem] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Atmospheric floating aesthetic icons directly on the screen */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute top-28 left-[5%] text-purple-400/20 animate-ambientDrift" style={{ animationDelay: '0s' }}>
          <FileText className="w-6 h-6" />
        </div>
        <div className="absolute top-48 right-[7%] text-purple-400/20 animate-ambientDrift" style={{ animationDelay: '2s' }}>
          <Archive className="w-5 h-5" />
        </div>
        <div className="absolute bottom-40 left-[8%] text-purple-400/20 animate-ambientDrift" style={{ animationDelay: '3.5s' }}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute top-1/2 right-[4%] text-purple-400/15 animate-ambientDrift" style={{ animationDelay: '1.2s' }}>
          <Clock className="w-6 h-6" />
        </div>
        <div className="absolute bottom-20 right-[15%] text-purple-400/20 animate-ambientDrift" style={{ animationDelay: '4.8s' }}>
          <Flame className="w-5 h-5" />
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-slate-900/60 border-b border-purple-500/20 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-slideUp">
              <div className="flex items-center gap-2 mb-1">
                <Archive className="w-6 h-6 text-purple-400" />
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
                  Your Graveyard
                </h1>
              </div>
              <p className="text-white/50 text-sm">
                {projects.length === 0
                  ? 'No souls laid to rest yet'
                  : `${projects.length} project${projects.length === 1 ? '' : 's'} preserved in peace`}
              </p>
            </div>
            
            <div className="flex items-center gap-3 animate-slideUp">
              <Link
                to="/crypt"
                className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-purple-950/40 text-sm"
              >
                <Plus className="w-4 h-4" />
                Lay a Project to Rest
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {projects.length === 0 ? (
          // Empty State with floating ghost & quick actions
          <div className="relative max-w-xl mx-auto my-12 p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-purple-500/20 backdrop-blur-xl text-center animate-fadeIn shadow-2xl">
            <div className="relative inline-block mb-6">
              <GhostMascot 
                size="lg" 
                expression="happy" 
                animated={true}
                className="mx-auto drop-shadow-[0_10px_20px_rgba(168,85,247,0.3)]"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              The Crypt is Quiet
            </h2>
            <p className="text-white/60 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
              No dead repos or abandoned hacks here yet. Whenever a project hits pause, bury it here with its context so your ideas never truly die.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/crypt"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-7 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-lg shadow-purple-900/30 text-sm"
              >
                Bury Your First Project
              </Link>
              <Link
                to="/autopsy"
                className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-purple-200 rounded-xl transition-all duration-200 text-sm border border-purple-500/20"
              >
                Explore Analytics
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Time Capsule Section */}
            {categorizedProjects.timeCapsule.length > 0 && (
              <section className="animate-slideUp">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Time Capsules Ready to Open ({categorizedProjects.timeCapsule.length})
                    </h2>
                    <p className="text-xs text-white/50">Scheduled reminder date has arrived</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categorizedProjects.timeCapsule.map((p, idx) => (
                    <div key={p.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-scaleIn">
                      <ProjectCard project={p} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Resting Projects */}
            {categorizedProjects.resting.length > 0 && (
              <section className="animate-slideUp" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Resting Projects ({categorizedProjects.resting.length})
                    </h2>
                    <p className="text-xs text-white/50">Dormant repos awaiting decision or revival</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categorizedProjects.resting.map((p, idx) => (
                    <div key={p.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-scaleIn">
                      <ProjectCard project={p} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Revived Projects */}
            {categorizedProjects.revived.length > 0 && (
              <section className="animate-slideUp" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Brought Back to Life ({categorizedProjects.revived.length})
                    </h2>
                    <p className="text-xs text-white/50">Projects reborn, pivoted, or back in active progress</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categorizedProjects.revived.map((p, idx) => (
                    <div key={p.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-scaleIn">
                      <ProjectCard project={p} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Links */}
            <section className="flex flex-wrap gap-4 pt-6 border-t border-purple-500/10 animate-slideUp" style={{ animationDelay: '300ms' }}>
              <Link
                to="/crypt"
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/60 hover:bg-slate-800/80 text-white/80 hover:text-white rounded-xl transition-all duration-200 text-sm border border-purple-500/20"
              >
                <Search className="w-4 h-4 text-purple-400" />
                Browse Crypt Archives
              </Link>
              <Link
                to="/autopsy"
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/60 hover:bg-slate-800/80 text-white/80 hover:text-white rounded-xl transition-all duration-200 text-sm border border-purple-500/20"
              >
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Autopsy & Abandonment Analytics
              </Link>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
