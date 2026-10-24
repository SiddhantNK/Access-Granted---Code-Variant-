import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  ExternalLink, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileCode,
  CheckCircle2,
  Clock,
  Pause,
  Tag,
  History,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * GraveView - Detailed Project Dossier Record
 */
const GraveView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, deleteProject, updateProject, calculateHealthScore, exportProjects } = useProjects();
  const [showDelete, setShowDelete] = useState(false);
  const [expandTimeline, setExpandTimeline] = useState(true);
  const [isEditingStructure, setIsEditingStructure] = useState(false);
  const [structureText, setStructureText] = useState('');

  const project = getProject(projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <GhostMascot size="lg" expression="sad" animated={true} className="mb-4 mx-auto" />
          <h2 className="text-xl font-serif-title font-semibold mb-1">Grave Record Not Found</h2>
          <p className="text-xs text-theme-text-muted mb-6">This repository tomb may have been cleared.</p>
          <Link to="/dashboard" className="text-xs font-semibold text-theme-accent hover:underline">
            ← Return to Graveyard
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

  const handleExportSingle = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.name.toLowerCase().replace(/\s+/g, '_')}_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveStructure = () => {
    updateProject(projectId, { projectStructure: structureText.trim() });
    setIsEditingStructure(false);
  };

  const handleStartEditStructure = () => {
    setStructureText(project.projectStructure || '');
    setIsEditingStructure(true);
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      
      {/* Header Bar */}
      <section className="bg-theme-surface border-b border-theme-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-theme-text-muted hover:text-theme-text mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Graveyard</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-theme-text-muted">
                  {project.category || 'Repository Vault'}
                </span>
                <span className="text-theme-border">•</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-theme-surface-secondary text-theme-text-muted border border-theme-border">
                  {project.status}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-theme-text">
                {project.name}
              </h1>
              <p className="text-xs sm:text-sm text-theme-text-muted italic max-w-2xl">
                &ldquo;{project.epitaph}&rdquo;
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleExportSingle}
                className="p-2 rounded-lg border border-theme-border text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary transition-colors"
                title="Export Project Dossier JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="p-2 rounded-lg border border-theme-border text-theme-text-muted hover:text-theme-destructive hover:bg-theme-destructive-surface transition-colors"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Link
                to={`/revive/${projectId}`}
                className="px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-foreground text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Revive Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dossier Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-theme-surface border border-theme-border rounded-xl">
            <p className="text-[11px] font-mono uppercase text-theme-text-muted">Revival Path</p>
            <p className="text-sm font-semibold text-theme-text mt-0.5">{project.revivalPath || 'Undecided'}</p>
          </div>
          <div className="p-4 bg-theme-surface border border-theme-border rounded-xl">
            <p className="text-[11px] font-mono uppercase text-theme-text-muted">Health Score</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm font-semibold text-theme-text">{healthScore}%</p>
              <div className="flex-1 bg-theme-surface-secondary rounded-full h-1.5">
                <div
                  className="bg-theme-accent h-1.5 rounded-full"
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>
          </div>
          <div className="p-4 bg-theme-surface border border-theme-border rounded-xl">
            <p className="text-[11px] font-mono uppercase text-theme-text-muted">Buried Date</p>
            <p className="text-sm font-semibold text-theme-text mt-0.5">{createdDate.toLocaleDateString()}</p>
          </div>
          <div className="p-4 bg-theme-surface border border-theme-border rounded-xl">
            <p className="text-[11px] font-mono uppercase text-theme-text-muted">Last Activity</p>
            <p className="text-sm font-semibold text-theme-text mt-0.5">{updatedDate.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Two-column dossier layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main 2-columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Original Idea */}
            <div className="p-6 bg-theme-surface border border-theme-border rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-theme-text">
                <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
                <h3 className="text-sm font-semibold font-serif-title">Original Vision & Objective</h3>
              </div>
              <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
                {project.originalIdea}
              </p>
            </div>

            {/* Completed vs Unfinished Work */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Completed */}
              <div className="p-5 bg-theme-surface border border-theme-border rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-theme-accent" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-text">
                    Completed Work ({project.completed?.length || 0})
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-theme-text-muted">
                  {project.completed && project.completed.length > 0 ? (
                    project.completed.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-theme-accent font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-theme-text-subtle italic">None logged</li>
                  )}
                </ul>
              </div>

              {/* Unfinished */}
              <div className="p-5 bg-theme-surface border border-theme-border rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-theme-gold" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-text">
                    Unfinished Work ({project.unfinished?.length || 0})
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-theme-text-muted">
                  {project.unfinished && project.unfinished.length > 0 ? (
                    project.unfinished.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-theme-gold font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-theme-text-subtle italic">None logged</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Why it paused */}
            <div className="p-5 bg-theme-surface border border-theme-border rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-theme-text">
                <Pause className="w-4 h-4 text-theme-text-muted" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">Reason for Inactivity</h4>
              </div>
              <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
                {project.pauseReason || 'No pause reason recorded.'}
              </p>
            </div>

            {/* Repository File Tree & Project Structure */}
            <div className="p-5 bg-theme-surface border border-theme-border rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-theme-accent" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-text">
                    Archived Repository Structure
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-theme-text-subtle">
                    {project.name.toLowerCase().replace(/\s+/g, '-')}/
                  </span>
                  {!isEditingStructure && (
                    <button
                      onClick={handleStartEditStructure}
                      className="text-[11px] text-theme-accent hover:underline font-mono"
                    >
                      {project.projectStructure ? 'Edit' : '+ Add'}
                    </button>
                  )}
                </div>
              </div>

              {isEditingStructure ? (
                <div className="space-y-2">
                  <textarea
                    value={structureText}
                    onChange={(e) => setStructureText(e.target.value)}
                    rows={6}
                    placeholder={`my-project/\n├── src/\n│   └── index.js\n└── package.json`}
                    className="w-full project-structure-field p-3 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs text-theme-text font-mono focus:border-theme-accent focus:outline-none whitespace-pre resize-y"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingStructure(false)}
                      className="px-3 py-1 text-xs rounded border border-theme-border text-theme-text-muted hover:text-theme-text"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveStructure}
                      className="px-3 py-1 text-xs rounded bg-theme-accent text-theme-accent-foreground font-semibold hover:bg-theme-accent-hover"
                    >
                      Save Structure
                    </button>
                  </div>
                </div>
              ) : project.projectStructure ? (
                <div className="p-4 rounded-lg bg-theme-surface-secondary border border-theme-border overflow-x-auto">
                  <pre className="font-mono text-xs text-theme-text-muted leading-relaxed whitespace-pre">
                    {project.projectStructure}
                  </pre>
                </div>
              ) : project.fileTree && project.fileTree.length > 0 ? (
                <div className="p-4 rounded-lg bg-theme-surface-secondary border border-theme-border font-mono text-xs">
                  <div className="space-y-1.5 text-theme-text-muted">
                    {project.fileTree.map((item, idx) => (
                      <div key={idx}>
                        {item.type === 'dir' ? (
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-theme-text py-0.5">
                              <FolderOpen className="w-3.5 h-3.5 text-theme-accent" />
                              <span>{item.name}</span>
                            </div>
                            {item.children && (
                              <div className="pl-4 space-y-1 py-0.5 border-l border-theme-border ml-1.5">
                                {item.children.map((child, cIdx) => (
                                  <div key={cIdx} className="flex items-center justify-between text-theme-text-muted hover:text-theme-text py-0.5">
                                    <span className="flex items-center gap-1.5">
                                      <FileCode className="w-3 h-3 text-theme-text-subtle" />
                                      <span>{child.name}</span>
                                    </span>
                                    <span className="text-[10px] text-theme-text-subtle">{child.size}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-theme-text-muted hover:text-theme-text py-0.5">
                            <span className="flex items-center gap-1.5">
                              <FileCode className="w-3.5 h-3.5 text-theme-text-subtle" />
                              <span>{item.name}</span>
                            </span>
                            <span className="text-[10px] text-theme-text-subtle">{item.size}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-theme-surface-secondary border border-theme-border text-center">
                  <p className="text-theme-text-subtle italic text-xs mb-2">No directory structure archived.</p>
                  <button
                    onClick={handleStartEditStructure}
                    className="text-xs text-theme-accent hover:underline font-mono"
                  >
                    + Record project structure
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Next Smallest Step */}
            <div className="p-5 bg-theme-surface border border-theme-border rounded-xl text-center space-y-3">
              <GhostMascot size="sm" expression="thinking" animated={true} className="mx-auto" />
              <div>
                <p className="text-[11px] font-mono uppercase text-theme-text-muted">Next Smallest Step</p>
                <p className="text-xs sm:text-sm font-semibold text-theme-text mt-1">
                  {project.nextSmallestStep || 'No next step recorded yet.'}
                </p>
              </div>
            </div>

            {/* Salvage Tags */}
            {project.salvageTags && project.salvageTags.length > 0 && (
              <div className="p-5 bg-theme-surface border border-theme-border rounded-xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-theme-text uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-theme-accent" />
                  <span>Salvageable Assets</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.salvageTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-theme-surface-secondary text-theme-text-muted text-xs font-mono rounded border border-theme-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            {(project.links?.github || project.links?.demo || project.links?.notes) && (
              <div className="p-5 bg-theme-surface border border-theme-border rounded-xl space-y-2.5">
                <p className="text-xs font-semibold text-theme-text uppercase tracking-wider">External Links</p>
                <div className="space-y-1.5 text-xs">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-theme-accent hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-theme-accent hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demonstration</span>
                    </a>
                  )}
                  {project.links.notes && (
                    <p className="text-theme-text-muted text-[11px] pt-1">
                      {project.links.notes}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="p-6 bg-theme-surface border border-theme-border rounded-xl space-y-4">
          <button
            onClick={() => setExpandTimeline(!expandTimeline)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-theme-accent" />
              <h3 className="text-sm font-semibold font-serif-title text-theme-text">
                Historical Timeline ({project.timeline?.length || 0})
              </h3>
            </div>
            <ChevronDown className={`w-4 h-4 text-theme-text-muted transition-transform ${expandTimeline ? 'rotate-180' : ''}`} />
          </button>

          {expandTimeline && (
            <div className="space-y-3 pt-2">
              {project.timeline && project.timeline.length > 0 ? (
                project.timeline.slice().reverse().map((event) => (
                  <div key={event.id} className="p-3 bg-theme-surface-secondary border border-theme-border rounded-lg text-xs flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-theme-text capitalize">{event.type}</p>
                      {event.note && <p className="text-theme-text-muted mt-0.5">{event.note}</p>}
                    </div>
                    <span className="text-[11px] font-mono text-theme-text-subtle whitespace-nowrap">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-theme-text-subtle italic">No timeline events yet.</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-theme-surface border border-theme-border rounded-xl p-6 max-w-sm w-full text-center shadow-lg space-y-4 animate-slideUp">
            <GhostMascot size="md" expression="scared" animated={true} className="mx-auto" />
            <h3 className="text-lg font-serif-title font-semibold text-theme-text">Permanently Delete Record?</h3>
            <p className="text-xs text-theme-text-muted">
              This action permanently purges the grave record from your vault.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2 text-xs rounded-lg border border-theme-border text-theme-text hover:bg-theme-surface-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 text-xs rounded-lg bg-theme-destructive text-white hover:opacity-90 font-semibold transition-opacity"
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
