"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Textarea, TextareaProps } from "./ui/textarea";
import { Sparkles } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { generateNoteAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";

interface AiNoteEditorProps extends TextareaProps {
  projectId: string;
  currentNoteId?: string;
  onNoteGenerated: (data: { title: string; content: string }) => void;
  contentValue: string;
}

export function AiNoteEditor({
  projectId,
  currentNoteId,
  onNoteGenerated,
  contentValue,
  ...props
}: AiNoteEditorProps) {
  const [isPending, startTransition] = useTransition();
  const { getNotesByProjectId } = useData();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt) {
        toast({
            variant: "destructive",
            title: "Prompt is empty",
            description: "Please enter a prompt to generate content.",
        });
        return;
    }

    startTransition(async () => {
      const allNotes = getNotesByProjectId(projectId);
      const contextNotes = allNotes
        .filter((note) => note.id !== currentNoteId)
        .map((note) => `Title: ${note.title}\nContent: ${note.content}`);

      const result = await generateNoteAction({ contextNotes, prompt });

      if (result) {
        onNoteGenerated(result);
        toast({
          title: "AI Content Generated",
          description: "The AI has generated content and a title for your note.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "AI Generation Failed",
          description: "Could not generate content. Please try again.",
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={contentValue}
        {...props}
      />
      <Card className="bg-muted/50">
        <CardContent className="pt-6 space-y-4">
            <Label htmlFor="ai-prompt">AI Prompt</Label>
            <div className="flex gap-2">
                <Input
                    id="ai-prompt"
                    placeholder="e.g., Summarize the context notes"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isPending}
                />
                <Button onClick={handleGenerate} disabled={isPending} className="whitespace-nowrap">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isPending ? "Generating..." : "Generate"}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                Use the AI to generate a title and content based on other notes in this project.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}