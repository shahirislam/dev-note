"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectList from '@/components/ProjectList';
import TodaysTasks from '@/components/TodaysTasks';
import { Fab } from '@/components/ui/fab';
import AddProjectDialog from '@/components/dialogs/AddProjectDialog';

export default function Home() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your projects.</p>
      </div>

      <TodaysTasks />
      
      <ProjectList />

      <AddProjectDialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen} />
      
      <Fab onClick={() => setIsAddProjectOpen(true)}>
        <Plus className="h-6 w-6" />
      </Fab>
    </div>
  );
}
