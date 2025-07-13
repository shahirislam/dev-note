"use client";

import { useState } from 'react';
import type { Note } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import AddNoteDialog from "./dialogs/AddNoteDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from './ui/badge';

interface NoteItemProps {
  note: Note;
}

export default function NoteItem({ note }: NoteItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="p-4 rounded-lg border bg-background">
         <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1" className="border-b-0">
                <div className="flex justify-between items-start">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline flex-1 text-left py-1">
                       {note.title || "Untitled Note"}
                    </AccordionTrigger>
                    <div className="flex gap-1 ml-4 flex-shrink-0">
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
                <div className="mb-2">
                    <Badge variant="secondary">{formatDate(note.createdAt)}</Badge>
                </div>
                <AccordionContent className="text-muted-foreground whitespace-pre-wrap pt-2">
                    {note.content}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>

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
