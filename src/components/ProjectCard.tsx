"use client";

import Link from 'next/link';
import type { Project } from '@/lib/types';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { formatDate } from '@/lib/utils';
import { FolderKanban } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { getTasksByProjectId } = useData();
  const tasks = getTasksByProjectId(project.id);
  const completedTasks = tasks.filter(task => task.isDone).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Link href={`/project/${project.id}`} className="block hover:-translate-y-1 transition-transform duration-300">
      <Card className="h-full flex flex-col hover:border-primary transition-colors duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="font-headline">{project.title}</CardTitle>
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardDescription>Created: {formatDate(project.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground mb-2">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </CardContent>
        <CardFooter>
          <Progress value={progress} className="w-full" />
        </CardFooter>
      </Card>
    </Link>
  );
}
