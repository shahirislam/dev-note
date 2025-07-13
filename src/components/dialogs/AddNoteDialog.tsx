"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/lib/types";
import { useEffect } from "react";
import { AiNoteEditor } from "../AiNoteEditor";

const formSchema = z.object({
  title: z.string().trim().max(100).optional(),
  content: z.string().min(1, { message: "Note content cannot be empty." }),
});

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  noteToEdit?: Note;
}

export default function AddNoteDialog({ open, onOpenChange, projectId, noteToEdit }: AddNoteDialogProps) {
  const { addNote, updateNote } = useData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!noteToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (noteToEdit) {
        form.reset({
          title: noteToEdit.title,
          content: noteToEdit.content,
        });
      } else {
        form.reset({
          title: "",
          content: "",
        });
      }
    }
  }, [noteToEdit, form, open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const noteData = {
        ...values,
        projectId,
        title: values.title || '',
      };
      
      if (isEditing) {
        updateNote({ ...noteToEdit, ...noteData });
        toast({ title: "Note Updated", description: "Your note has been successfully updated." });
      } else {
        addNote(noteData);
        toast({ title: "Note Added", description: "A new note has been added to your project." });
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleNoteGenerated = (data: { title: string; content: string }) => {
    form.setValue("title", data.title);
    form.setValue("content", data.content, { shouldValidate: true });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Note" : "Add New Note"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your project note." : "Create a new note for your project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Meeting Summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name="content"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <AiNoteEditor
                      projectId={projectId}
                      currentNoteId={noteToEdit?.id}
                      onNoteGenerated={handleNoteGenerated}
                      contentValue={field.value}
                      onChange={field.onChange}
                      placeholder="Type your note here. Use the AI to help you!"
                      rows={8}
                    />
                  </FormControl>
                  {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add Note")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
