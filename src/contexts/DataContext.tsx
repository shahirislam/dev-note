"use client";

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Project, Task, Note, AppData } from '@/lib/types';
import { isToday, parseISO } from 'date-fns';

const defaultAppData: AppData = {
  projects: [],
  tasks: [],
  notes: [],
};

interface DataContextType {
  data: AppData;
  addProject: (title: string) => Project;
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
  const [data, setData] = useLocalStorage<AppData>('devflow-data', defaultAppData);

  const value = useMemo(() => {
    const getProjectById = (projectId: string) => data.projects.find(p => p.id === projectId);

    const addProject = (title: string): Project => {
      const newProject: Project = {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date().toISOString(),
      };
      setData(d => ({ ...d, projects: [...d.projects, newProject] }));
      return newProject;
    };

    const updateProject = (project: Project) => {
      setData(d => ({ ...d, projects: d.projects.map(p => p.id === project.id ? project : p) }));
    };
    
    const deleteProject = (projectId: string) => {
      setData(d => ({
        projects: d.projects.filter(p => p.id !== projectId),
        tasks: d.tasks.filter(t => t.projectId !== projectId),
        notes: d.notes.filter(n => n.projectId !== projectId),
      }));
    };

    const getTasksByProjectId = (projectId: string) => {
      return data.tasks.filter(t => t.projectId === projectId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    };

    const getTodaysTasks = () => {
      return data.tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)) && !t.isDone);
    };

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'isDone'>): Task => {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        isDone: false,
        createdAt: new Date().toISOString(),
      };
      setData(d => ({ ...d, tasks: [...d.tasks, newTask] }));
      return newTask;
    };

    const updateTask = (task: Task) => {
      setData(d => ({ ...d, tasks: d.tasks.map(t => t.id === task.id ? task : t) }));
    };

    const deleteTask = (taskId: string) => {
      setData(d => ({ ...d, tasks: d.tasks.filter(t => t.id !== taskId) }));
    };

    const getNotesByProjectId = (projectId: string) => {
      return data.notes.filter(n => n.projectId === projectId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    };

    const addNote = (noteData: Omit<Note, 'id' | 'createdAt'>): Note => {
      const newNote: Note = {
        ...noteData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setData(d => ({ ...d, notes: [...d.notes, newNote] }));
      return newNote;
    };

    const updateNote = (note: Note) => {
      setData(d => ({ ...d, notes: d.notes.map(n => n.id === note.id ? note : n) }));
    };

    const deleteNote = (noteId: string) => {
      setData(d => ({ ...d, notes: d.notes.filter(n => n.id !== noteId) }));
    };
    
    const importData = (importedData: AppData): boolean => {
      if (importedData && importedData.projects && importedData.tasks && importedData.notes) {
        setData(importedData);
        return true;
      }
      return false;
    };

    return { 
      data, 
      getProjectById,
      addProject,
      updateProject,
      deleteProject,
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
    };
  }, [data, setData]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
