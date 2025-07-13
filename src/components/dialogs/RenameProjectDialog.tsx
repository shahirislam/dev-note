
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
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
import type { Project } from "@/lib/types";

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "Project title is required." }).max(50),
});

interface RenameProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export default function RenameProjectDialog({ open, onOpenChange, project }: RenameProjectDialogProps) {
  const { updateProject, data } = useData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ title: project.title });
    }
  }, [open, project.title, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const trimmedTitle = values.title.trim();
      const isTitleTaken = data.projects.some(
        p => p.title.toLowerCase() === trimmedTitle.toLowerCase() && p.id !== project.id
      );

      if (isTitleTaken) {
        form.setError("title", {
          type: "manual",
          message: "A project with this title already exists.",
        });
        setIsSubmitting(false);
        return;
      }
      
      updateProject({ ...project, title: trimmedTitle });
      
      toast({
        title: "Project Renamed",
        description: `Project has been successfully renamed to "${trimmedTitle}".`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while renaming the project.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription>
            Enter a new name for your project &quot;{project.title}&quot;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
