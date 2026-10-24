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

  // Load projects for current user from localStorage
  const loadProjects = () => {
    if (!user) return;
    try {
      const key = `pg_projects_${user.id}`;
      const data = localStorage.getItem(key);
      setProjects(data ? JSON.parse(data) : []);
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
