
"use client";

import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Project, Task, Note, AppData } from '@/lib/types';
import { isToday, parseISO } from 'date-fns';

const defaultAppData: AppData = {
  projects: [],
  tasks: [],
  notes: [],
  apiKey: '',
};

interface DataContextType {
  data: AppData;
  setApiKey: (key: string) => void;
  addProject: (title: string) => Project | null;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  getProjectById: (projectId: string) => Project | undefined;
  getTasksByProjectId: (projectId: string) => Task[];
  getTodaysTasks: () => Task[];
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'isDone'>) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  getNotesByProjectId: (projectId: string) => Note[];
  addNote: (noteData: Omit<Note, 'id' | 'createdAt'>) => Note;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  importData: (importedData: AppData) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useLocalStorage<AppData>('devdiary-data', defaultAppData);

  const setApiKey = useCallback((key: string) => {
    setData(d => ({ ...d, apiKey: key }));
  }, [setData]);

  const addProject = useCallback((title: string): Project | null => {
    const trimmedTitle = title.trim();
    if (data.projects.some(p => p.title.toLowerCase() === trimmedTitle.toLowerCase())) {
      return null; // Project with the same title already exists
    }
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      createdAt: new Date().toISOString(),
    };
    setData(d => ({ ...d, projects: [...d.projects, newProject] }));
    return newProject;
  }, [setData, data.projects]);

  const updateProject = useCallback((project: Project) => {
    setData(d => ({ ...d, projects: d.projects.map(p => p.id === project.id ? { ...p, title: project.title } : p) }));
  }, [setData]);

  const deleteProject = useCallback((projectId: string) => {
    setData(d => ({
      ...d,
      projects: d.projects.filter(p => p.id !== projectId),
      tasks: d.tasks.filter(t => t.projectId !== projectId),
      notes: d.notes.filter(n => n.projectId !== projectId),
    }));
  }, [setData]);

  const getProjectById = useCallback((projectId: string) => data.projects.find(p => p.id === projectId), [data.projects]);

  const getTasksByProjectId = useCallback((projectId: string) => {
    return data.tasks.filter(t => t.projectId === projectId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data.tasks]);

  const getTodaysTasks = useCallback(() => {
    return data.tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)) && !t.isDone);
  }, [data.tasks]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'isDone'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      isDone: false,
      createdAt: new Date().toISOString(),
    };
    setData(d => ({ ...d, tasks: [...d.tasks, newTask] }));
    return newTask;
  }, [setData]);

  const updateTask = useCallback((task: Task) => {
    setData(d => ({ ...d, tasks: d.tasks.map(t => t.id === task.id ? task : t) }));
  }, [setData]);

  const deleteTask = useCallback((taskId: string) => {
    setData(d => ({ ...d, tasks: d.tasks.filter(t => t.id !== taskId) }));
  }, [setData]);

  const getNotesByProjectId = useCallback((projectId: string) => {
    return data.notes.filter(n => n.projectId === projectId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data.notes]);

  const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt'>): Note => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setData(d => ({ ...d, notes: [...d.notes, newNote] }));
    return newNote;
  }, [setData]);

  const updateNote = useCallback((note: Note) => {
    setData(d => ({ ...d, notes: d.notes.map(n => n.id === note.id ? note : n) }));
  }, [setData]);

  const deleteNote = useCallback((noteId: string) => {
    setData(d => ({ ...d, notes: d.notes.filter(n => n.id !== noteId) }));
  }, [setData]);

  const importData = useCallback((importedData: AppData): boolean => {
    // Validate the imported data structure before setting it
    if (
      importedData &&
      Array.isArray(importedData.projects) &&
      Array.isArray(importedData.tasks) &&
      Array.isArray(importedData.notes) &&
      'apiKey' in importedData
    ) {
      const finalData = { ...defaultAppData, ...importedData, apiKey: importedData.apiKey || data.apiKey };
      setData(finalData);
      return true;
    }
    return false;
  }, [setData, data.apiKey]);

  const value = useMemo(() => ({
    data,
    setApiKey,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getTasksByProjectId,
    getTodaysTasks,
    addTask,
    updateTask,
    deleteTask,
    getNotesByProjectId,
    addNote,
    updateNote,
    deleteNote,
    importData
  }), [
    data, setApiKey, addProject, updateProject, deleteProject, getProjectById,
    getTasksByProjectId, getTodaysTasks, addTask, updateTask, deleteTask,
    getNotesByProjectId, addNote, updateNote, deleteNote, importData
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
