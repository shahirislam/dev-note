"use client";

import { useData } from "@/contexts/DataContext";
import NoteItem from "./NoteItem";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StickyNote } from "lucide-react";

interface NoteListProps {
  projectId: string;
}

export default function NoteList({ projectId }: NoteListProps) {
  const { getNotesByProjectId } = useData();
  const notes = getNotesByProjectId(projectId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map(note => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <div className="flex justify-center mb-4">
                <div className="bg-secondary p-4 rounded-full">
                    <StickyNote className="h-10 w-10 text-muted-foreground"/>
                </div>
            </div>
            <h3 className="text-xl font-semibold">No notes yet</h3>
            <p className="text-muted-foreground mt-2">Add your first note using the '+' button below.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
