export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  isDone: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt:string;
}

export interface Project {
  id: string;
  title: string;
  createdAt: string;
}

export interface AppData {
  projects: Project[];
  tasks: Task[];
  notes: Note[];
  apiKey: string;
}
