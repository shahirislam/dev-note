
"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/types';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { formatDate } from '@/lib/utils';
import { FolderKanban, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import ConfirmDeleteDialog from './dialogs/ConfirmDeleteDialog';
import RenameProjectDialog from './dialogs/RenameProjectDialog';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { getTasksByProjectId } = useData();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const tasks = getTasksByProjectId(project.id);
  const completedTasks = tasks.filter(task => task.isDone).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const handleMenuSelect = (e: Event) => {
    e.preventDefault();
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:border-primary transition-colors duration-300 relative group">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Project options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onSelect={() => setIsRenameDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href={`/project/${project.id}`} className="block h-full flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="font-headline pr-10">{project.title}</CardTitle>
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
        </Link>
      </Card>

      <RenameProjectDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        project={project}
      />
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemType="project"
        itemId={project.id}
      />
    </>
  );
}
