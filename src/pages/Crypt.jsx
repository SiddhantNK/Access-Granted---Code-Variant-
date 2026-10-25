import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChevronDown, Filter, X, ArrowUpRight } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import NewBurialModal from '../components/NewBurialModal';
import { useProjects } from '../context/ProjectContext';

/**
 * Crypt - Project archive with structured search and filtering
 */
const Crypt = () => {
  const { projects, searchProjects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandFilters, setExpandFilters] = useState(false);
  const [burialModalOpen, setBurialModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    revivalPath: [],
    salvageTag: [],
  });

  const statuses = ['Fresh Grave', 'Resting', 'Revived', 'Reborn', 'Salvaged', 'At Peace'];
  const revivalPaths = ['Revive', 'Reborn', 'Pivot', 'Salvage', 'Lay to Rest'];

  // All unique salvage tags
  const allTags = useMemo(() => {
    const tags = new Set();
    projects.forEach((p) => {
      if (Array.isArray(p.salvageTags)) {
        p.salvageTags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [projects]);

  // Filtered results
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
        filters.salvageTag.some((tag) => Array.isArray(p.salvageTags) && p.salvageTags.includes(tag))
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

  const activeFilterCount = filters.status.length + filters.revivalPath.length + filters.salvageTag.length;

  const ProjectCard = ({ project }) => (
    <Link
      to={`/grave/${project.id}`}
      className="p-5 bg-theme-surface border border-theme-border hover:border-theme-accent/60 rounded-xl transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted">
              {project.category || 'Archive Item'}
            </span>
            <h3 className="text-base font-semibold text-theme-text group-hover:text-theme-accent transition-colors truncate">
              {project.name}
            </h3>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-theme-surface-secondary text-theme-text-muted border border-theme-border flex-shrink-0">
            {project.status}
          </span>
        </div>

        <p className="text-xs text-theme-text-muted line-clamp-2 leading-relaxed mb-4">
          {project.epitaph || project.originalIdea}
        </p>
      </div>

      <div className="pt-3 border-t border-theme-border/60">
        <div className="flex flex-wrap gap-1 mb-2">
          {project.salvageTags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-theme-surface-secondary text-theme-text-muted text-[10px] font-mono rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-theme-text-subtle font-mono">
          <span>Buried: {new Date(project.createdAt).toLocaleDateString()}</span>
          <span className="text-theme-accent font-medium flex items-center gap-0.5">
            Dossier <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      
      {/* Header */}
      <section className="border-b border-theme-border bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent" />
                <span className="text-xs font-mono uppercase tracking-wider text-theme-text-muted">
                  Crypt Vault
                </span>
              </div>
              <h1 className="text-3xl font-serif-title font-semibold text-theme-text mt-1">
                Project Archives
              </h1>
              <p className="text-xs sm:text-sm text-theme-text-muted mt-1">
                Catalog and retrieve dormant codebases, ideas, and component scraps.
              </p>
            </div>
            
            <button
              onClick={() => setBurialModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-foreground text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Burial</span>
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-theme-text-subtle" />
              <input
                type="text"
                placeholder="Search by project name, idea, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-theme-surface border border-theme-border rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors shadow-sm"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setExpandFilters(!expandFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                expandFilters || activeFilterCount > 0
                  ? 'bg-theme-surface-secondary border-theme-accent text-theme-text'
                  : 'bg-theme-surface border-theme-border text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-theme-accent text-theme-accent-foreground text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Filter Drawer */}
          {expandFilters && (
            <div className="p-5 bg-theme-surface border border-theme-border rounded-xl shadow-sm space-y-5 animate-slideUp">
              
              {/* Status */}
              <div>
                <p className="text-xs font-mono uppercase text-theme-text-muted mb-2 font-semibold">Status</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => {
                    const selected = filters.status.includes(status);
                    return (
                      <button
                        key={status}
                        onClick={() => toggleFilter('status', status)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          selected
                            ? 'bg-theme-accent text-theme-accent-foreground border-theme-accent'
                            : 'bg-theme-surface-secondary text-theme-text-muted border-theme-border hover:text-theme-text'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Revival Paths */}
              <div>
                <p className="text-xs font-mono uppercase text-theme-text-muted mb-2 font-semibold">Revival Path</p>
                <div className="flex flex-wrap gap-2">
                  {revivalPaths.map((path) => {
                    const selected = filters.revivalPath.includes(path);
                    return (
                      <button
                        key={path}
                        onClick={() => toggleFilter('revivalPath', path)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          selected
                            ? 'bg-theme-accent text-theme-accent-foreground border-theme-accent'
                            : 'bg-theme-surface-secondary text-theme-text-muted border-theme-border hover:text-theme-text'
                        }`}
                      >
                        {path}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Salvage Tags */}
              {allTags.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase text-theme-text-muted mb-2 font-semibold">Salvage Tags</p>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {allTags.map((tag) => {
                      const selected = filters.salvageTag.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleFilter('salvageTag', tag)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                            selected
                              ? 'bg-theme-accent text-theme-accent-foreground border-theme-accent'
                              : 'bg-theme-surface-secondary text-theme-text-muted border-theme-border hover:text-theme-text'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reset Controls */}
              {activeFilterCount > 0 && (
                <div className="pt-2 border-t border-theme-border flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-xs text-theme-destructive hover:underline font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filtered.length === 0 ? (
          <div className="max-w-md mx-auto my-12 p-8 bg-theme-surface border border-theme-border rounded-2xl text-center shadow-sm">
            <GhostMascot size="md" expression="sad" animated={true} className="mx-auto mb-4" />
            <h3 className="text-lg font-serif-title font-semibold text-theme-text mb-1">
              No matching archive records
            </h3>
            <p className="text-xs text-theme-text-muted mb-4">
              Try adjusting your search criteria or clearing selected filters.
            </p>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-theme-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-theme-text-muted">
              <span>Showing {filtered.length} of {projects.length} archived projects</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* New Burial Modal */}
      <NewBurialModal 
        isOpen={burialModalOpen} 
        onClose={() => setBurialModalOpen(false)} 
      />
    </div>
  );
};

export default Crypt;
