import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

/**
 * NewBurialModal - 3-Step Wizard to document an unfinished project and lay it to rest
 * Step 1: Essentials (Name, Category, Epitaph)
 * Step 2: Context & Structure (Original Idea, Project Structure tree, Completed & Unfinished)
 * Step 3: Post-Mortem & Links (Pause reason, Salvage tags, Next step, Links)
 */
const NewBurialModal = ({ isOpen, onClose }) => {
  const { createProject } = useProjects();
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleNextStep = (e) => {
    e?.preventDefault();
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError('Please provide a project name before proceeding.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.originalIdea.trim()) {
        setError('Please describe the original idea before proceeding.');
        return;
      }
    }
    setError('');
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a project name.');
      setCurrentStep(1);
      return;
    }
    if (!formData.originalIdea.trim()) {
      setError('Please write what the original idea was.');
      setCurrentStep(2);
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
      setCurrentStep(1);
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
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-theme-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-theme-mint" />
              <span className="text-xs uppercase tracking-wider font-semibold text-theme-text-muted">
                Step {currentStep} of 3
              </span>
            </div>
            <h2 className="text-2xl font-serif-title font-semibold text-theme-text mt-1">
              Lay a Project to Rest
            </h2>
            <p className="text-xs text-theme-text-muted mt-0.5">
              {currentStep === 1 && 'Define the essential identity and epitaph.'}
              {currentStep === 2 && 'Document the vision, project structure, and progress.'}
              {currentStep === 3 && 'Record honest post-mortem insights and links.'}
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

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 1 ? 'bg-theme-mint' : 'bg-theme-border'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 2 ? 'bg-theme-mint' : 'bg-theme-border'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 3 ? 'bg-theme-mint' : 'bg-theme-border'}`} />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-theme-destructive-surface border border-theme-destructive/30 text-theme-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={currentStep === 3 ? handleSubmit : handleNextStep} className="mt-6 space-y-4">
          
          {/* STEP 1: ESSENTIALS */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors"
                    autoFocus
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text focus:border-theme-mint focus:outline-none transition-colors"
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
                  className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 2: CONTEXT & STRUCTURE */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
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
                  className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors resize-none"
                  autoFocus
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
                  className="w-full project-structure-field px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors font-mono whitespace-pre resize-y"
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors resize-none"
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: POST-MORTEM & LINKS */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                  Why Did It Pause? (The honest truth)
                </label>
                <input
                  type="text"
                  name="pauseReason"
                  value={formData.pauseReason}
                  onChange={handleChange}
                  placeholder="e.g. Scope got too big, lost interest in UI, or external API barrier."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors"
                  autoFocus
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors"
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
                    placeholder="e.g. Extract auth provider into snippet"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                  GitHub Repository / Code Link (Optional)
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-theme-surface-secondary border border-theme-border text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-mint focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-theme-border">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-3.5 py-2 text-xs font-medium rounded-lg border border-theme-border text-theme-text hover:bg-theme-surface-secondary transition-colors inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary transition-colors"
              >
                Cancel
              </button>
            )}

            <div className="flex items-center gap-2">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-theme-mint hover:bg-theme-mint-hover text-theme-mint-foreground transition-all shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-theme-mint hover:bg-theme-mint-hover text-theme-mint-foreground transition-all shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Burying...' : 'Lay to Rest'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBurialModal;
