import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

/**
 * NewBurialModal - Modal to document an unfinished project and lay it to rest
 */
const NewBurialModal = ({ isOpen, onClose }) => {
  const { createProject } = useProjects();
  const [formData, setFormData] = useState({
    name: '',
    epitaph: '',
    category: 'Web App',
    originalIdea: '',
    completedInput: '',
    unfinishedInput: '',
    pauseReason: '',
    salvageTagsInput: '',
    nextSmallestStep: '',
    projectStructure: '',
    github: '',
    demo: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a project name.');
      return;
    }
    if (!formData.originalIdea.trim()) {
      setError('Please write what the original idea was.');
      return;
    }

    setIsSubmitting(true);
    try {
      const completed = formData.completedInput
        ? formData.completedInput.split('\n').map((s) => s.trim()).filter(Boolean)
        : [];
      const unfinished = formData.unfinishedInput
        ? formData.unfinishedInput.split('\n').map((s) => s.trim()).filter(Boolean)
        : [];
      const salvageTags = formData.salvageTagsInput
        ? formData.salvageTagsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      createProject({
        name: formData.name.trim(),
        epitaph: formData.epitaph.trim() || 'Laid to rest until inspiration returns.',
        category: formData.category,
        originalIdea: formData.originalIdea.trim(),
        completed,
        unfinished,
        pauseReason: formData.pauseReason.trim() || 'Life and other priorities intervened.',
        salvageTags,
        nextSmallestStep: formData.nextSmallestStep.trim(),
        projectStructure: formData.projectStructure.trim(),
        links: {
          github: formData.github.trim(),
          demo: formData.demo.trim(),
          notes: formData.notes.trim(),
        },
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to document project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-2xl bg-theme-surface border border-theme-border rounded-2xl shadow-lg my-8 p-6 sm:p-8 z-10 animate-slideUp text-theme-text max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-theme-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-theme-accent" />
              <span className="text-xs uppercase tracking-wider font-semibold text-theme-text-muted">New Archive Entry</span>
            </div>
            <h2 className="text-2xl font-serif-title font-semibold text-theme-text mt-1">Lay a Project to Rest</h2>
            <p className="text-xs text-theme-text-muted mt-0.5">
              Preserve context, learnings, and components before your memory fades.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-theme-destructive-surface border border-theme-destructive/30 text-theme-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Markdown Flowchart Generator"
                className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text focus:border-theme-accent focus:outline-none transition-colors"
              >
                <option value="Web App">Web App</option>
                <option value="Developer Tools">Developer Tools</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Web3 / DeFi">Web3 / DeFi</option>
                <option value="Open Source">Open Source</option>
                <option value="Game">Game</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
              Epitaph (A memorable one-line summary)
            </label>
            <input
              type="text"
              name="epitaph"
              value={formData.epitaph}
              onChange={handleChange}
              placeholder="e.g. A valiant attempt at solving real-time collaborative state."
              className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
              Original Idea & Vision *
            </label>
            <textarea
              name="originalIdea"
              required
              rows={3}
              value={formData.originalIdea}
              onChange={handleChange}
              placeholder="What problem did you set out to solve? What was the spark?"
              className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-theme-text-muted mb-1">
              Project Structure (Optional)
            </label>
            <p className="text-[11px] text-theme-text-subtle mb-1.5">
              Paste your directory and file hierarchy — Unicode tree characters and indentation are preserved.
            </p>
            <textarea
              name="projectStructure"
              rows={5}
              value={formData.projectStructure}
              onChange={handleChange}
              placeholder={`my-project/\n├── src/\n│   ├── components/\n│   ├── pages/\n│   └── utils/\n├── package.json\n└── README.md`}
              className="w-full project-structure-field px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors font-mono whitespace-pre resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                Completed Work (One item per line)
              </label>
              <textarea
                name="completedInput"
                rows={3}
                value={formData.completedInput}
                onChange={handleChange}
                placeholder="Auth flow with Supabase&#10;Landing page hero&#10;Database schema migrations"
                className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                Unfinished Work (One item per line)
              </label>
              <textarea
                name="unfinishedInput"
                rows={3}
                value={formData.unfinishedInput}
                onChange={handleChange}
                placeholder="Stripe billing webhook&#10;PDF export module&#10;Edge case testing"
                className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
              Why Did It Pause? (The honest truth)
            </label>
            <input
              type="text"
              name="pauseReason"
              value={formData.pauseReason}
              onChange={handleChange}
              placeholder="e.g. Scope got too big, lost interest in the UI, or hit an external API barrier."
              className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                Salvage Tags (Comma-separated)
              </label>
              <input
                type="text"
                name="salvageTagsInput"
                value={formData.salvageTagsInput}
                onChange={handleChange}
                placeholder="React hooks, Stripe webhook, Canvas UI"
                className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                Next Smallest Step (If ever revisited)
              </label>
              <input
                type="text"
                name="nextSmallestStep"
                value={formData.nextSmallestStep}
                onChange={handleChange}
                placeholder="e.g. Extract the auth provider into a snippet"
                className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
              GitHub Repository / Code Link (Optional)
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-theme-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-foreground transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lay to Rest</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBurialModal;
