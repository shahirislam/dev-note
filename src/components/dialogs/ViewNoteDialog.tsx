
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Note } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface ViewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note | null;
}

export default function ViewNoteDialog({ open, onOpenChange, note }: ViewNoteDialogProps) {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{note.title || "Untitled Note"}</DialogTitle>
          <DialogDescription>
            Created on {formatDate(note.createdAt)}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-6">
            <div className="whitespace-pre-wrap text-sm text-foreground my-4">
                {note.content}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}