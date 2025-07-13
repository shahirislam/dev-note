"use client";

import { useState } from 'react';
import type { Task } from "@/lib/types";
import { useData } from "@/contexts/DataContext";
import { formatDate, cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Calendar, Edit, Trash2 } from "lucide-react";
import AddTaskDialog from "./dialogs/AddTaskDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask } = useData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleDone = () => {
    updateTask({ ...task, isDone: !task.isDone });
  };

  return (
    <>
      <div className={cn(
          "p-3 rounded-lg border flex items-start gap-4 transition-all",
          task.isDone ? 'bg-muted/50 border-dashed' : 'bg-background hover:bg-muted/50'
        )}>
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isDone}
          onCheckedChange={handleToggleDone}
          className="mt-1"
          aria-label={`Mark task ${task.title} as ${task.isDone ? 'not done' : 'done'}`}
        />
        <div className="flex-grow">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              "font-medium cursor-pointer",
              task.isDone && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </label>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
             {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
          
          {task.description && (
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-sm py-1 hover:no-underline text-muted-foreground">View Description</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pt-1 pb-0">
                  {task.description}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

        </div>
        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Task</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Task</span>
          </Button>
        </div>
      </div>
      <AddTaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        taskToEdit={task}
        projectId={task.projectId}
      />
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {}} // The dialog itself will handle deletion via context
        itemType="task"
        itemId={task.id}
      />
    </>
  );
}
