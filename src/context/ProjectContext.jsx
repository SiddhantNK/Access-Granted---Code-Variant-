import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * ProjectContext - Project Management
 * 
 * Handles all project operations:
 * - Create, read, update, delete projects
 * - Project status and revival paths
 * - Timeline events
 * - Health score calculation
 * - localStorage persistence per user
 */

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load projects from localStorage when user changes
  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  // Default seed projects with realistic file directory trees
  const getInitialSeedProjects = (userId) => [
    {
      id: `proj_seed_1`,
      name: 'OmniChain DEX Aggregator',
      epitaph: 'Paused after Hackathon submission due to RPC rate limits and liquidity complexity.',
      category: 'Web3 / DeFi',
      originalIdea: 'A unified decentralized exchange routing orders across Arbitrum, Base, and Solana with gasless transfers.',
      completed: ['Core routing smart contract', 'MetaMask + Phantom wallet connector', 'Token swap UI in Tailwind'],
      unfinished: ['Cross-chain bridge relayers', 'Slippage protector bots', 'Sub-graph indexing server'],
      pauseReason: 'Hackathon ended, team dispersed and RPC node infrastructure became too costly.',
      status: 'Resting',
      revivalPath: 'Reborn',
      salvageTags: ['Smart Contracts', 'Web3 Connectors', 'Tailwind UI', 'Router Hook'],
      links: { github: 'https://github.com/example/omnichain-dex', demo: 'https://omnichain-dex.dev', notes: 'Consider pivoting into Solana-only aggregator.' },
      nextSmallestStep: 'Refactor swap routing algorithm into a standalone lightweight NPM library.',
      revisitAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      timeline: [
        { id: 't1', type: 'created', note: 'Project created during ETHGlobal', createdAt: new Date(Date.now() - 86400000 * 45).toISOString() },
        { id: 't2', type: 'progress', note: 'Finished Uniswap V3 quoter integration', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
        { id: 't3', type: 'status', note: 'Project laid to rest in Crypt', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
      ],
      fileTree: [
        { name: 'contracts/', type: 'dir', children: [{ name: 'AggregatorRouter.sol', type: 'file', size: '4.2 KB' }, { name: 'GaslessRelay.sol', type: 'file', size: '2.8 KB' }] },
        { name: 'src/', type: 'dir', children: [
          { name: 'components/', type: 'dir', children: [{ name: 'SwapCard.tsx', type: 'file', size: '8.1 KB' }, { name: 'TokenSelector.tsx', type: 'file', size: '5.3 KB' }] },
          { name: 'hooks/', type: 'dir', children: [{ name: 'useQuote.ts', type: 'file', size: '3.1 KB' }] },
          { name: 'App.tsx', type: 'file', size: '2.4 KB' }
        ]},
        { name: 'README.md', type: 'file', size: '1.2 KB' },
        { name: 'package.json', type: 'file', size: '840 B' },
      ],
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      id: `proj_seed_2`,
      name: 'NeuroNotes Canvas',
      epitaph: 'Brain-dump markdown editor with bi-directional knowledge graphs.',
      category: 'Developer Tools',
      originalIdea: 'Infinite canvas markdown editor that connects thoughts like synaptic nodes.',
      completed: ['Markdown WYSIWYG parser', 'Force-directed graph renderer with D3.js', 'Local SQLite storage'],
      unfinished: ['End-to-end encrypted cloud sync', 'AI auto-linking tags', 'Mobile responsive view'],
      pauseReason: 'Scope creep took over; tried to build a personal Obsidian competitor in 3 weeks.',
      status: 'Fresh Grave',
      revivalPath: 'Salvage',
      salvageTags: ['D3 Graph Engine', 'Markdown Parser', 'Canvas Zoom Hook'],
      links: { github: 'https://github.com/example/neuro-notes', demo: '', notes: 'D3 graph component is ready to plug into other apps.' },
      nextSmallestStep: 'Extract the D3 force-graph component and publish it as an open-source React component.',
      revisitAt: new Date(Date.now() - 86400000 * 2).toISOString(), // Time capsule due!
      timeline: [
        { id: 't4', type: 'created', note: 'Idea sparked after frustration with note apps', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() },
        { id: 't5', type: 'progress', note: 'Completed force directed graph rendering', createdAt: new Date(Date.now() - 86400000 * 25).toISOString() },
      ],
      fileTree: [
        { name: 'src/', type: 'dir', children: [
          { name: 'canvas/', type: 'dir', children: [{ name: 'ForceGraph.tsx', type: 'file', size: '12.4 KB' }, { name: 'NodeRenderer.tsx', type: 'file', size: '4.6 KB' }] },
          { name: 'editor/', type: 'dir', children: [{ name: 'MarkdownEditor.tsx', type: 'file', size: '6.7 KB' }] },
          { name: 'store/', type: 'dir', children: [{ name: 'notesStore.ts', type: 'file', size: '3.9 KB' }] }
        ]},
        { name: 'public/', type: 'dir', children: [{ name: 'favicon.ico', type: 'file', size: '1.4 KB' }] },
        { name: 'vite.config.ts', type: 'file', size: '450 B' }
      ],
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: `proj_seed_3`,
      name: 'GhostWriter PR Reviewer',
      epitaph: 'Automated GitHub Action bot that leaves context-aware comments on pull requests.',
      category: 'AI / Automation',
      originalIdea: 'CLI and GitHub action that summarizes PR diffs and detects security regressions.',
      completed: ['GitHub Webhook receiver', 'Diff tokenizer & chunker', 'OpenAI prompt chain'],
      unfinished: ['OAuth permission management', 'Stripe billing integration', 'Support for mono-repos'],
      pauseReason: 'Burnout from job and exams; left waiting for OAuth app verification.',
      status: 'Revived',
      revivalPath: 'Revive',
      salvageTags: ['GitHub API Client', 'Git Diff Parser', 'OpenAI Prompts'],
      links: { github: 'https://github.com/example/ghostwriter-bot', demo: '', notes: 'Clean architecture, easy to finish.' },
      nextSmallestStep: 'Update OpenAI API keys and run local integration test against sample PR.',
      revisitAt: new Date(Date.now() + 86400000 * 14).toISOString(),
      timeline: [
        { id: 't6', type: 'created', note: 'Project created', createdAt: new Date(Date.now() - 86400000 * 90).toISOString() },
        { id: 't7', type: 'progress', note: 'Wrote AST diff parser', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() },
        { id: 't8', type: 'progress', note: 'Revived and tested local webhook server', createdAt: new Date().toISOString() },
      ],
      fileTree: [
        { name: 'action/', type: 'dir', children: [{ name: 'index.js', type: 'file', size: '7.8 KB' }, { name: 'action.yml', type: 'file', size: '520 B' }] },
        { name: 'lib/', type: 'dir', children: [
          { name: 'analyzer.ts', type: 'file', size: '5.1 KB' },
          { name: 'github.ts', type: 'file', size: '4.3 KB' },
          { name: 'prompts.ts', type: 'file', size: '2.9 KB' }
        ]},
        { name: 'tests/', type: 'dir', children: [{ name: 'analyzer.test.ts', type: 'file', size: '3.4 KB' }] }
      ],
      createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // Load projects for current user from localStorage
  const loadProjects = () => {
    if (!user) return;
    try {
      const key = `pg_projects_${user.id}`;
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        setProjects(parsed.length > 0 ? parsed : getInitialSeedProjects(user.id));
      } else {
        const initial = getInitialSeedProjects(user.id);
        localStorage.setItem(key, JSON.stringify(initial));
        setProjects(initial);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setProjects([]);
    }
  };

  // Save projects to localStorage
  const saveProjects = (updatedProjects) => {
    if (!user) return;
    try {
      const key = `pg_projects_${user.id}`;
      localStorage.setItem(key, JSON.stringify(updatedProjects));
    } catch (err) {
      console.error('Failed to save projects:', err);
    }
  };

  // Create new project
  const createProject = (projectData) => {
    if (!user) throw new Error('User not authenticated');

    const newProject = {
      id: `project_${Date.now()}`,
      userId: user.id,
      name: projectData.name,
      epitaph: projectData.epitaph || '',
      category: projectData.category || 'Other',
      originalIdea: projectData.originalIdea,
      completed: projectData.completed || [],
      unfinished: projectData.unfinished || [],
      pauseReason: projectData.pauseReason,
      status: 'Fresh Grave',
      revivalPath: projectData.revivalPath || null,
      salvageTags: projectData.salvageTags || [],
      links: projectData.links || { github: '', demo: '', notes: '' },
      nextSmallestStep: projectData.nextSmallestStep || '',
      revisitAt: projectData.revisitAt || null,
      timeline: [
        {
          id: `event_${Date.now()}`,
          type: 'created',
          note: 'Project created',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    return newProject;
  };

  // Get single project
  const getProject = (projectId) => {
    return projects.find((p) => p.id === projectId);
  };

  // Update project
  const updateProject = (projectId, updates) => {
    const updatedProjects = projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : p
    );

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    return updatedProjects.find((p) => p.id === projectId);
  };

  // Delete project
  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  // Add timeline event
  const addTimelineEvent = (projectId, eventType, note = '') => {
    const newEvent = {
      id: `event_${Date.now()}`,
      type: eventType,
      note,
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            timeline: [...p.timeline, newEvent],
            updatedAt: new Date().toISOString(),
          }
        : p
    );

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  // Log progress
  const logProgress = (projectId, progressNote) => {
    const project = getProject(projectId);
    if (!project) return;

    addTimelineEvent(projectId, 'progress', progressNote);

    // Update updatedAt
    updateProject(projectId, {
      updatedAt: new Date().toISOString(),
    });
  };

  // Change status
  const changeStatus = (projectId, newStatus) => {
    updateProject(projectId, { status: newStatus });
  };

  // Set revival path and update status
  const setRevivalPath = (projectId, revivalPath) => {
    const statusMap = {
      Revive: 'Revived',
      Reborn: 'Reborn',
      Pivot: 'Pivoted',
      Salvage: 'Salvaged',
      'Lay to Rest': 'At Peace',
    };

    const newStatus = statusMap[revivalPath] || 'Under Review';
    addTimelineEvent(projectId, revivalPath.toLowerCase(), `Project path set to: ${revivalPath}`);

    updateProject(projectId, {
      revivalPath,
      status: newStatus,
    });
  };

  // Calculate health score
  const calculateHealthScore = (project) => {
    let score = 0;

    // Completed work: 0-20 points
    const completedPoints = Math.min(project.completed.length * 5, 20);
    score += completedPoints;

    // Unfinished work clarity: 0-20 points
    const unfinishedClarity = project.unfinished.length > 0 ? 20 : 0;
    score += unfinishedClarity;

    // Recent activity: 0-20 points
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const recencyPoints = Math.max(20 - daysSinceUpdate, 0);
    score += recencyPoints;

    // Revival path selected: 0-15 points
    if (project.revivalPath) {
      score += 15;
    }

    // Salvage tags: 0-15 points
    if (project.salvageTags.length > 0) {
      score += Math.min(project.salvageTags.length * 3, 15);
    }

    // Next step defined: 0-10 points
    if (project.nextSmallestStep) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  // Get analytics data
  const getAnalytics = () => {
    const stats = {
      total: projects.length,
      byStatus: {},
      byRevivalPath: {},
      abandonmentReasons: {},
      salvageTags: {},
      averageAge: 0,
      averageHealthScore: 0,
      highestPotential: [],
      staleProjects: [],
    };

    if (projects.length === 0) return stats;

    // Count by status
    projects.forEach((p) => {
      stats.byStatus[p.status] = (stats.byStatus[p.status] || 0) + 1;
      stats.byRevivalPath[p.revivalPath || 'None'] = (stats.byRevivalPath[p.revivalPath || 'None'] || 0) + 1;
      stats.abandonmentReasons[p.pauseReason] = (stats.abandonmentReasons[p.pauseReason] || 0) + 1;

      p.salvageTags.forEach((tag) => {
        stats.salvageTags[tag] = (stats.salvageTags[tag] || 0) + 1;
      });
    });

    // Average age
    const totalAge = projects.reduce((sum, p) => {
      const age = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return sum + age;
    }, 0);
    stats.averageAge = Math.round(totalAge / projects.length);

    // Average health score
    const healthScores = projects.map((p) => calculateHealthScore(p));
    stats.averageHealthScore = Math.round(healthScores.reduce((a, b) => a + b, 0) / projects.length);

    // Highest potential
    stats.highestPotential = projects
      .map((p) => ({ ...p, health: calculateHealthScore(p) }))
      .sort((a, b) => b.health - a.health)
      .slice(0, 5);

    // Stale projects (not updated in 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    stats.staleProjects = projects.filter((p) => new Date(p.updatedAt).getTime() < thirtyDaysAgo);

    return stats;
  };

  // Export data as JSON
  const exportData = () => {
    const data = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      projects,
      analytics: getAnalytics(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-graveyard-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const importData = (jsonData, mode = 'merge') => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

      let importedProjects = data.projects || [];

      // Filter to current user if needed
      if (mode === 'merge') {
        // Keep existing projects, add new ones
        const existingIds = new Set(projects.map((p) => p.id));
        importedProjects = importedProjects.filter((p) => !existingIds.has(p.id));
        const combined = [...projects, ...importedProjects];
        setProjects(combined);
        saveProjects(combined);
      } else if (mode === 'replace') {
        // Replace all
        importedProjects = importedProjects.map((p) => ({
          ...p,
          userId: user.id,
        }));
        setProjects(importedProjects);
        saveProjects(importedProjects);
      }

      return { success: true, count: importedProjects.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Search projects
  const searchProjects = (query) => {
    if (!query.trim()) return projects;

    const lowercaseQuery = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.originalIdea.toLowerCase().includes(lowercaseQuery) ||
        p.epitaph.toLowerCase().includes(lowercaseQuery) ||
        p.salvageTags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  // Filter projects
  const filterProjects = (filters) => {
    let filtered = [...projects];

    if (filters.status) {
      filtered = filtered.filter((p) => filters.status.includes(p.status));
    }

    if (filters.revivalPath) {
      filtered = filtered.filter((p) => filters.revivalPath.includes(p.revivalPath));
    }

    if (filters.salvageTag) {
      filtered = filtered.filter((p) => p.salvageTags.includes(filters.salvageTag));
    }

    if (filters.category) {
      filtered = filtered.filter((p) => filters.category.includes(p.category));
    }

    return filtered;
  };

  const value = {
    projects,
    isLoading,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    addTimelineEvent,
    logProgress,
    changeStatus,
    setRevivalPath,
    calculateHealthScore,
    getAnalytics,
    exportData,
    importData,
    searchProjects,
    filterProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export default ProjectProvider;
