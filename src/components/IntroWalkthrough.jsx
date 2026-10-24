import React, { useState, useEffect } from 'react';
import GhostMascot from './GhostMascot';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

/**
 * IntroWalkthrough Component
 * 
 * Calm, accessible, archival walkthrough guide.
 * Follows semantic design tokens in both light and dark themes.
 */
export const IntroWalkthrough = ({ isOpen = true, onClose = () => {} }) => {
  const [step, setStep] = useState(0);

  // Always reset to step 0 whenever the tutorial opens
  useEffect(() => {
    if (isOpen) {
      setStep(0);
    }
  }, [isOpen]);

  const steps = [
    {
      title: "Welcome to The Graveyard",
      description: "A peaceful archive for unfinished projects. Preserve context, record why work ceased, and decide when to revive or salvage components.",
      ghostExpression: 'happy',
      ghostSize: 'lg',
    },
    {
      title: "Lay a Project to Rest",
      description: "Document what you finished, what remains, and the honest reason it paused. Keep code links and salvageable modules organized.",
      ghostExpression: 'thinking',
      ghostSize: 'md',
    },
    {
      title: "The Crypt & Time Capsules",
      description: "Filter projects by tags or status. Set revisit dates so dormant ideas awaken when you have time and fresh perspective.",
      ghostExpression: 'neutral',
      ghostSize: 'md',
    },
    {
      title: "Five Revival Paths",
      description: "When returning to a project, choose a deliberate route: Revive, Reborn, Pivot, Salvage, or Lay to Rest peacefully.",
      ghostExpression: 'thinking',
      ghostSize: 'md',
    },
    {
      title: "Autopsy & Health Analytics",
      description: "Discover recurring abandonment patterns across your projects and identify high-potential candidates for your next build.",
      ghostExpression: 'happy',
      ghostSize: 'lg',
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem('pg_intro_seen', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-theme-surface border border-theme-border rounded-2xl shadow-lg max-w-xl w-full p-6 sm:p-8 animate-slideUp text-theme-text relative">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary rounded-lg transition-colors"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Mascot Side */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-theme-surface-secondary rounded-xl border border-theme-border w-32 h-32 sm:w-36 sm:h-36">
              <GhostMascot
                size={currentStep.ghostSize}
                expression={currentStep.ghostExpression}
                animated={true}
              />
            </div>

            {/* Content Side */}
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider text-theme-text-muted">
                Step {step + 1} of {steps.length}
              </span>
              <h2 className="text-xl font-serif-title font-bold text-theme-text mt-1 mb-2">
                {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Bottom Bar: Indicators & Controls */}
          <div className="mt-8 pt-5 border-t border-theme-border flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step
                      ? 'w-6 bg-theme-mint'
                      : 'w-1.5 bg-theme-border hover:bg-theme-text-subtle'
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="text-xs text-theme-text-muted hover:text-theme-text px-2 py-1.5 transition-colors"
              >
                Skip
              </button>

              <button
                onClick={handlePrev}
                disabled={isFirstStep}
                className="px-3 py-1.5 rounded-lg border border-theme-border text-xs text-theme-text hover:bg-theme-surface-secondary transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 inline mr-0.5" />
                Back
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg bg-theme-mint hover:bg-theme-mint-hover text-theme-mint-foreground text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
              >
                <span>{isLastStep ? 'Enter Archive' : 'Next'}</span>
                {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntroWalkthrough;
