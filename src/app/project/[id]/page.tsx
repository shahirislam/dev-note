"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import TaskList from '@/components/TaskList';
import NoteList from '@/components/NoteList';
import { Fab } from '@/components/ui/fab';
import AddTaskDialog from '@/components/dialogs/AddTaskDialog';
import AddNoteDialog from '@/components/dialogs/AddNoteDialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { getProjectById } = useData();
  const [isClient, setIsClient] = useState(false);

  const projectId = typeof params.id === 'string' ? params.id : '';
  const project = getProjectById(projectId);
  
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  const activeTab = searchParams.get('tab') || 'tasks';
  
  const handleTabChange = (value: string) => {
    router.push(`/project/${projectId}?tab=${value}`);
  };

  const openDialog = () => {
    if (activeTab === 'tasks') {
      setIsAddTaskOpen(true);
    } else {
      setIsAddNoteOpen(true);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-48" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-16">
         <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <FolderKanban className="h-10 w-10 text-destructive"/>
        </div>
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <p className="text-muted-foreground mt-2">The project you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <p className="text-muted-foreground">Manage your tasks and notes for this project.</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <TaskList projectId={projectId} />
        </TabsContent>
        <TabsContent value="notes">
          <NoteList projectId={projectId} />
        </TabsContent>
      </Tabs>
      
      <AddTaskDialog projectId={projectId} open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
      <AddNoteDialog projectId={projectId} open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen} />
      
      <Fab onClick={openDialog}>
        <Plus className="h-6 w-6" />
      </Fab>
    </div>
  );
}
