import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  RefreshCw, 
  Archive, 
  Trash2, 
  Activity, 
  Download, 
  FileText, 
  Plus, 
  HelpCircle,
  X,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Move
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import ActionZone from './ActionZone';
import DraggableProjectCard from './DraggableProjectCard';
import NewBurialModal from '../NewBurialModal';

/**
 * GraveyardCanvas - Canvas Protocol workspace with interactive drag-and-drop zones
 * 
 * Interactions:
 * 1. New Burial: Drag empty project draft or click to launch creation wizard
 * 2. Save/Preserve: Drops project into active vault
 * 3. Revive: Drag a resting project into Revive chamber
 * 4. Crypt/Archive: Drag a project into Crypt archive
 * 5. Autopsy: Drag project to inspect post-mortem stats without modifying status
 * 6. Restore: Drag an archived/salvaged project back to Graveyard
 * 7. Delete (Final Rest): Drag into Final Rest with confirmation dialog
 * 8. Log Progress: Drag project to open quick timeline update modal
 * 9. Export: Drag project or click to export JSON file
 */
const GraveyardCanvas = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    changeStatus, 
    deleteProject, 
    logProgress, 
    exportData 
  } = useProjects();

  // Modals & Panels
  const [burialModalOpen, setBurialModalOpen] = useState(false);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);
  const [progressModalProject, setProgressModalProject] = useState(null);
  const [progressNote, setProgressNote] = useState('');
  const [activeFeedback, setActiveFeedback] = useState(null);

  const showNotification = (message, type = 'info') => {
    setActiveFeedback({ message, type });
    setTimeout(() => setActiveFeedback(null), 4000);
  };

  // Group projects for visual sections
  const restingProjects = projects.filter((p) => p.status === 'Resting' || p.status === 'Fresh Grave');
  const archivedProjects = projects.filter((p) => p.status === 'At Peace' || p.status === 'Salvaged');
  const revivedProjects = projects.filter((p) => p.status === 'Revived' || p.status === 'Reborn');

  // Handle Drag & Drop to Zones
  const handleDropToRevive = (data) => {
    if (!data.projectId) return;
    changeStatus(data.projectId, 'Revived');
    showNotification(`Awakened "${data.name}" to Revived status.`, 'mint');
    navigate(`/revive/${data.projectId}`);
  };

  const handleDropToCrypt = (data) => {
    if (!data.projectId) return;
    changeStatus(data.projectId, 'At Peace');
    showNotification(`Archived "${data.name}" peacefully in the Crypt.`, 'info');
  };

  const handleDropToAutopsy = (data) => {
    if (!data.projectId) return;
    // Autopsy inspects without altering status per spec
    showNotification(`Opening post-mortem autopsy for "${data.name}"...`, 'info');
    navigate('/autopsy');
  };

  const handleDropToRestore = (data) => {
    if (!data.projectId) return;
    changeStatus(data.projectId, 'Resting');
    showNotification(`Restored "${data.name}" to the active Graveyard.`, 'mint');
  };

  const handleDropToDelete = (data) => {
    if (!data.projectId) return;
    const project = projects.find((p) => p.id === data.projectId);
    if (project) {
      setDeleteConfirmProject(project);
    }
  };

  const handleDropToProgress = (data) => {
    if (!data.projectId) return;
    const project = projects.find((p) => p.id === data.projectId);
    if (project) {
      setProgressModalProject(project);
      setProgressNote('');
    }
  };

  const handleDropToExport = (data) => {
    if (!data.projectId) return;
    const project = projects.find((p) => p.id === data.projectId);
    if (project) {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${project.name.toLowerCase().replace(/\s+/g, '_')}_record.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showNotification(`Exported record for "${project.name}".`, 'mint');
    }
  };

  const handleDragStartDraft = (e) => {
    const payload = {
      type: 'draft',
      isNew: true,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmProject) {
      deleteProject(deleteConfirmProject.id);
      showNotification(`Permanently cleared "${deleteConfirmProject.name}".`, 'destructive');
      setDeleteConfirmProject(null);
    }
  };

  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!progressNote.trim() || !progressModalProject) return;
    logProgress(progressModalProject.id, progressNote.trim());
    showNotification(`Logged progress note on "${progressModalProject.name}".`, 'mint');
    setProgressModalProject(null);
    setProgressNote('');
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Toast Feedback Notification */}
      {activeFeedback && (
        <div 
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md text-xs font-mono flex items-center gap-2 animate-bounce ${
            activeFeedback.type === 'mint' 
              ? 'bg-theme-surface border-theme-mint text-theme-mint'
              : activeFeedback.type === 'destructive'
              ? 'bg-theme-surface border-theme-destructive text-theme-destructive'
              : 'bg-theme-surface border-theme-border text-theme-text'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{activeFeedback.message}</span>
        </div>
      )}

      {/* Protocol Banner */}
      <div className="p-4 rounded-xl border border-theme-border bg-theme-surface-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent">
            <Move className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-theme-text font-serif-title">
              Canvas Protocol Active
            </h3>
            <p className="text-theme-text-muted text-[11px]">
              Drag cards directly into lifecycle zones to revive, analyze, archive, or record updates.
            </p>
          </div>
        </div>

        {/* Quick Draggable New Draft Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            draggable
            onDragStart={handleDragStartDraft}
            onClick={() => setBurialModalOpen(true)}
            className="cursor-grab active:cursor-grabbing px-3 py-1.5 rounded-lg border border-dashed border-theme-accent bg-theme-surface hover:bg-theme-accent-surface text-theme-accent text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-sm"
            title="Drag to New Burial zone or click to open"
          >
            <Plus className="w-3 h-3" />
            <span>Drag or Click + New Project</span>
          </div>
        </div>
      </div>

      {/* Top Action Zones Grid (Lifecycle Targets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Zone 1: New Burial / Preserve */}
        <ActionZone
          id="zone-burial"
          title="New Burial"
          subtitle="Drop draft to document"
          icon={Plus}
          badgeText="Creation"
          colorScheme="mint"
          accepts={['draft']}
          onDrop={() => setBurialModalOpen(true)}
          className="min-h-[120px]"
        >
          <div 
            onClick={() => setBurialModalOpen(true)}
            className="cursor-pointer text-center py-2 text-[11px] text-theme-text-muted hover:text-theme-text font-mono underline underline-offset-2"
          >
            Or click to open wizard
          </div>
        </ActionZone>

        {/* Zone 2: Revive Chamber */}
        <ActionZone
          id="zone-revive"
          title="Revive Chamber"
          subtitle="Drop project to awaken"
          icon={RefreshCw}
          badgeText="Trajectory"
          colorScheme="gold"
          accepts={['project']}
          onDrop={handleDropToRevive}
          className="min-h-[120px]"
        >
          <p className="text-[10px] text-theme-text-muted text-center py-1">
            Reopen codebase or harvest reusable modules
          </p>
        </ActionZone>

        {/* Zone 3: Crypt Archive */}
        <ActionZone
          id="zone-crypt"
          title="Crypt Archive"
          subtitle="Drop project to rest"
          icon={Archive}
          badgeText="Peaceful"
          colorScheme="default"
          accepts={['project']}
          onDrop={handleDropToCrypt}
          className="min-h-[120px]"
        >
          <p className="text-[10px] text-theme-text-muted text-center py-1">
            Store peacefully without deleting notes
          </p>
        </ActionZone>

        {/* Zone 4: Autopsy Lab */}
        <ActionZone
          id="zone-autopsy"
          title="Autopsy Lab"
          subtitle="Drop to inspect history"
          icon={Activity}
          badgeText="Analytics"
          colorScheme="accent"
          accepts={['project']}
          onDrop={handleDropToAutopsy}
          className="min-h-[120px]"
        >
          <p className="text-[10px] text-theme-text-muted text-center py-1">
            Audit abandonment metrics non-destructively
          </p>
        </ActionZone>
      </div>

      {/* Main Draggable Repository Canvas */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-theme-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-theme-text font-serif-title">
              Resting Vault ({restingProjects.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-theme-text-muted">
            Drag cards across zones
          </span>
        </div>

        {restingProjects.length === 0 ? (
          <div className="p-8 text-center border border-theme-border rounded-xl bg-theme-surface">
            <p className="text-xs text-theme-text-muted">
              No resting projects found. Drag a new card into New Burial above to lay one to rest.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restingProjects.map((project) => (
              <DraggableProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Revived & Archived Collections Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* Revived Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-theme-border">
            <CheckCircle2 className="w-4 h-4 text-theme-mint" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-theme-text font-serif-title">
              Revived Ideas ({revivedProjects.length})
            </h3>
          </div>
          {revivedProjects.length === 0 ? (
            <p className="text-xs text-theme-text-muted italic py-4">No projects awakened yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {revivedProjects.map((p) => (
                <DraggableProjectCard key={p.id} project={p} compact={true} />
              ))}
            </div>
          )}
        </div>

        {/* Crypt / Archived Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-theme-border">
            <Archive className="w-4 h-4 text-theme-text-muted" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-theme-text font-serif-title">
              Crypt / Peacefully Retired ({archivedProjects.length})
            </h3>
          </div>
          {archivedProjects.length === 0 ? (
            <p className="text-xs text-theme-text-muted italic py-4">No retired projects.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {archivedProjects.map((p) => (
                <DraggableProjectCard key={p.id} project={p} compact={true} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Auxiliary Action Zones (Restore, Progress, Export, Final Rest) */}
      <div className="pt-6 border-t border-theme-border">
        <h3 className="text-xs font-mono uppercase tracking-wider text-theme-text-muted mb-3">
          Secondary Operations & Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Restore Zone */}
          <ActionZone
            id="zone-restore"
            title="Restore to Graveyard"
            subtitle="Drop archived project here"
            icon={RotateCcw}
            badgeText="Un-archive"
            colorScheme="default"
            accepts={['project']}
            onDrop={handleDropToRestore}
            className="min-h-[100px]"
          />

          {/* Record Progress Zone */}
          <ActionZone
            id="zone-progress"
            title="Record Progress"
            subtitle="Drop project to log entry"
            icon={FileText}
            badgeText="Log"
            colorScheme="mint"
            accepts={['project']}
            onDrop={handleDropToProgress}
            className="min-h-[100px]"
          />

          {/* Export Zone */}
          <ActionZone
            id="zone-export"
            title="Export Dossier"
            subtitle="Drop project to export JSON"
            icon={Download}
            badgeText="Backup"
            colorScheme="accent"
            accepts={['project']}
            onDrop={handleDropToExport}
            className="min-h-[100px]"
          />

          {/* Final Rest / Delete Zone */}
          <ActionZone
            id="zone-delete"
            title="Final Rest"
            subtitle="Drop to permanently remove"
            icon={Trash2}
            badgeText="Confirm Panel"
            colorScheme="destructive"
            accepts={['project']}
            onDrop={handleDropToDelete}
            className="min-h-[100px]"
          />
        </div>
      </div>

      {/* Confirm Final Rest / Delete Modal */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-theme-surface border border-theme-border rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-theme-destructive/10 text-theme-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-serif-title font-semibold text-theme-text">
                  Confirm Final Rest
                </h3>
                <p className="text-xs text-theme-text-muted mt-1 leading-relaxed">
                  Are you sure you want to permanently delete <strong className="text-theme-text">{deleteConfirmProject.name}</strong>? This action cannot be reversed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-theme-border">
              <button
                type="button"
                onClick={() => setDeleteConfirmProject(null)}
                className="px-3.5 py-1.5 rounded-lg border border-theme-border text-xs font-medium text-theme-text hover:bg-theme-surface-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-theme-destructive hover:opacity-90 text-white text-xs font-semibold shadow-sm"
              >
                Permanently Clear Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Progress Modal */}
      {progressModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-theme-surface border border-theme-border rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-border">
              <div>
                <h3 className="text-sm font-semibold font-serif-title text-theme-text">
                  Log Progress on {progressModalProject.name}
                </h3>
                <p className="text-[11px] text-theme-text-muted">
                  Add an event note to this project's burial timeline.
                </p>
              </div>
              <button
                onClick={() => setProgressModalProject(null)}
                className="p-1 rounded text-theme-text-muted hover:text-theme-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-theme-text-muted mb-1.5">
                  Update Note
                </label>
                <textarea
                  rows={3}
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="e.g. Exported smart contracts into npm package, or investigated bugs..."
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg bg-theme-surface-secondary border border-theme-border text-theme-text placeholder:text-theme-text-subtle focus:outline-none focus:ring-1 focus:ring-theme-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProgressModalProject(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-theme-border text-xs font-medium text-theme-text hover:bg-theme-surface-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-theme-mint hover:bg-theme-mint-hover text-theme-mint-foreground text-xs font-semibold shadow-sm"
                >
                  Append to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Burial Modal */}
      <NewBurialModal 
        isOpen={burialModalOpen} 
        onClose={() => setBurialModalOpen(false)} 
      />
    </div>
  );
};

export default GraveyardCanvas;
