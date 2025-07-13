"use client";

import { useState } from 'react';
import type { Note } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import AddNoteDialog from "./dialogs/AddNoteDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { Badge } from './ui/badge';
import ViewNoteDialog from './dialogs/ViewNoteDialog';

interface NoteItemProps {
  note: Note;
}

export default function NoteItem({ note }: NoteItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent dialog from opening when clicking on buttons inside the card
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <div 
        className="p-4 rounded-lg border bg-background hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e as any)}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{note.title || "Untitled Note"}</h3>
            <div className="mt-2 mb-3">
              <Badge variant="secondary">{formatDate(note.createdAt)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-wrap">
              {note.content}
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit Note</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Note</span>
            </Button>
          </div>
        </div>
      </div>

      <ViewNoteDialog 
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        note={note}
      />

      <AddNoteDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        noteToEdit={note}
        projectId={note.projectId}
      />
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemType="note"
        itemId={note.id}
      />
    </>
  );
}