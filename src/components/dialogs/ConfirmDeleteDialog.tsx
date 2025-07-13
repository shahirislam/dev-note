"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  itemType: 'project' | 'task' | 'note';
  itemId: string;
}

export default function ConfirmDeleteDialog({ open, onOpenChange, itemType, itemId }: ConfirmDeleteDialogProps) {
  const { deleteProject, deleteTask, deleteNote, getProjectById } = useData();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = () => {
    let itemName = "Item";
    switch (itemType) {
      case 'project':
        const project = getProjectById(itemId);
        itemName = project?.title || 'Project';
        deleteProject(itemId);
        toast({ title: "Project Deleted", description: `"${itemName}" and all its contents have been deleted.` });
        router.push('/');
        break;
      case 'task':
        deleteTask(itemId);
        toast({ title: "Task Deleted", description: "The task has been successfully deleted." });
        break;
      case 'note':
        deleteNote(itemId);
        toast({ title: "Note Deleted", description: "The note has been successfully deleted." });
        break;
    }
    onOpenChange(false);
  };

  const description = itemType === 'project' 
    ? "This will permanently delete the project and all of its associated tasks and notes."
    : `This will permanently delete the ${itemType}.`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
