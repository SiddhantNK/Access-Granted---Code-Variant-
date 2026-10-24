import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChevronDown } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * Crypt - Project archive with search and filtering
 */

const Crypt = () => {
  const { projects, searchProjects, filterProjects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandFilters, setExpandFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    revivalPath: [],
    salvageTag: [],
  });

  const statuses = ['Fresh Grave', 'Resting', 'Under Review', 'Revived', 'Reborn', 'Salvaged', 'At Peace'];
  const revivalPaths = ['Revive', 'Reborn', 'Pivot', 'Salvage', 'Lay to Rest'];

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    projects.forEach((p) => p.salvageTags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [projects]);

  // Filter and search
  const filtered = useMemo(() => {
    let results = searchProjects(searchQuery);
    
    if (filters.status.length > 0) {
      results = results.filter((p) => filters.status.includes(p.status));
    }
    if (filters.revivalPath.length > 0) {
      results = results.filter((p) => filters.revivalPath.includes(p.revivalPath));
    }
    if (filters.salvageTag.length > 0) {
      results = results.filter((p) =>
        filters.salvageTag.some((tag) => p.salvageTags.includes(tag))
      );
    }

    return results;
  }, [searchQuery, filters, searchProjects, projects]);

  const toggleFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilters = () => {
    setFilters({ status: [], revivalPath: [], salvageTag: [] });
    setSearchQuery('');
  };

  const ProjectCard = ({ project }) => (
    <Link
      to={`/grave/${project.id}`}
      className="bg-slate-800/50 hover:bg-slate-800/80 border border-purple-500/20 hover:border-purple-500/50 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white flex-1 line-clamp-1">
            {project.name}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
              project.status === 'Fresh Grave'
                ? 'bg-cyan-500/20 text-cyan-300'
                : project.status === 'Resting'
                ? 'bg-gray-500/20 text-gray-300'
                : project.status === 'At Peace'
                ? 'bg-red-500/20 text-red-300'
                : 'bg-green-500/20 text-green-300'
            }`}
          >
            {project.status}
          </span>
        </div>
        
        <p className="text-white/60 text-sm line-clamp-2">{project.originalIdea}</p>
        
        <div className="flex flex-wrap gap-1">
          {project.salvageTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="text-xs text-white/40 pt-2">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-purple-500/20 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-slideUp">
              <h1 className="text-4xl font-bold text-white mb-2">Crypt Archive</h1>
              <p className="text-white/60">Browse and search all your projects</p>
            </div>
            
            <Link
              to="/crypt"
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Burial
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 animate-slideUp">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, idea, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-purple-500/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/80 transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setExpandFilters(!expandFilters)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${expandFilters ? 'rotate-180' : ''}`}
            />
            Filters
          </button>

          {/* Filters */}
          {expandFilters && (
            <div className="bg-slate-800/30 border border-purple-500/10 rounded-lg p-6 space-y-6 animate-slideUp">
              
              {/* Status Filter */}
              <div>
                <h3 className="text-white font-medium mb-3">Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {statuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => toggleFilter('status', status)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Revival Path Filter */}
              <div>
                <h3 className="text-white font-medium mb-3">Revival Path</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {revivalPaths.map((path) => (
                    <label
                      key={path}
                      className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.revivalPath.includes(path)}
                        onChange={() => toggleFilter('revivalPath', path)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-sm">{path}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-3">Salvage Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleFilter('salvageTag', tag)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                          filters.salvageTag.includes(tag)
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <GhostMascot 
              size="lg" 
              expression="sad" 
              animated={true}
              className="mb-6"
            />
            <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-white/60 mb-8">
              Try different search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-white/60">
              Showing {filtered.length} of {projects.length} projects
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, idx) => (
                <div key={project.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-scaleIn">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crypt;
