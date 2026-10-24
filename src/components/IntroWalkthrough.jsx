import React, { useState } from 'react';
import GhostMascot from './GhostMascot';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

/**
 * IntroWalkthrough Component
 * 
 * A beautiful, skippable walkthrough tour for new users.
 * Ghost mascot appears and guides users through key features.
 * 
 * Props:
 * - isOpen: boolean - whether to show the walkthrough
 * - onClose: callback - called when user skips or completes
 */
export const IntroWalkthrough = ({ isOpen = true, onClose = () => {} }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to The Project Graveyard",
      description: "A peaceful place where unfinished projects get a second life. Let's take a quick tour!",
      position: 'center',
      ghostExpression: 'happy',
      ghostSize: 'xl',
      highlight: null,
      action: null,
    },
    {
      title: "Create a New Burial",
      description: "Click 'New Burial' to document your unfinished projects. Don't worry—you can revisit them anytime.",
      position: 'center',
      ghostExpression: 'thinking',
      ghostSize: 'lg',
      highlight: '[data-tour="new-burial"]',
      action: 'Click here to start',
    },
    {
      title: "Search Your Graveyard",
      description: "Find old projects quickly with search and filters. Group by status, tags, or revival path.",
      position: 'center',
      ghostExpression: 'happy',
      ghostSize: 'lg',
      highlight: '[data-tour="search"]',
      action: 'Try searching',
    },
    {
      title: "Revival Paths",
      description: "When you revisit a project, decide its fate: Revive, Reborn, Pivot, Salvage, or Lay to Rest.",
      position: 'center',
      ghostExpression: 'neutral',
      ghostSize: 'lg',
      highlight: null,
      action: 'Learn more',
    },
    {
      title: "Project Health Score",
      description: "See how likely a project is worth reviving. Based on completed work, clarity, and recency.",
      position: 'center',
      ghostExpression: 'thinking',
      ghostSize: 'md',
      highlight: null,
      action: 'Check the Autopsy',
    },
    {
      title: "You're All Set!",
      description: "Your graveyard awaits. Remember: unfinished doesn't mean forgotten. Now go document your ideas.",
      position: 'center',
      ghostExpression: 'happy',
      ghostSize: 'xl',
      highlight: null,
      action: 'Start exploring',
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" />

      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-purple-500/20 overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            aria-label="Close walkthrough"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Content Container */}
          <div className="flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
            
            {/* Ghost & Visual Section */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full h-64 flex items-center justify-center">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl" />
                
                {/* Ghost Mascot */}
                <GhostMascot
                  size={currentStep.ghostSize}
                  expression={currentStep.ghostExpression}
                  animated={true}
                  className="relative z-10"
                />
              </div>

              {/* Step Indicator - Dots */}
              <div className="flex gap-2 mt-8">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === step
                        ? 'w-8 h-2 bg-purple-500'
                        : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Text & Action Section */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Progress */}
              <div className="text-sm text-white/60 mb-4">
                Step {step + 1} of {steps.length}
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                  {currentStep.title}
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  disabled={isFirstStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isFirstStep
                      ? 'text-white/40 cursor-not-allowed'
                      : 'text-white hover:bg-white/10 active:bg-white/20'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg transition-all duration-200 font-semibold active:scale-95"
                >
                  {isLastStep ? 'Start Exploring' : 'Next'}
                  {!isLastStep && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>

              {/* Skip Link */}
              <button
                onClick={handleClose}
                className="text-white/50 hover:text-white/80 text-sm mt-6 transition-colors"
              >
                Skip this tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntroWalkthrough;
