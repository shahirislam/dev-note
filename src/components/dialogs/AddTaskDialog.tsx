"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@/lib/types";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "Task title is required." }).max(100),
  description: z.string().max(500).optional(),
  dueDate: z.date().optional(),
});

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  taskToEdit?: Task;
}

export default function AddTaskDialog({ open, onOpenChange, projectId, taskToEdit }: AddTaskDialogProps) {
  const { addTask, updateTask } = useData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!taskToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      form.reset({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        dueDate: undefined,
      });
    }
  }, [taskToEdit, form, open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const taskData = {
        ...values,
        projectId,
        description: values.description || '',
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      if (isEditing) {
        updateTask({ ...taskToEdit, ...taskData });
        toast({ title: "Task Updated", description: "Your task has been successfully updated." });
      } else {
        addTask(taskData);
        toast({ title: "Task Added", description: "A new task has been added to your project." });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details of your task." : "Fill in the details for your new task."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Implement feature X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more details about the task..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add Task")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
