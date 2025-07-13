"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { AlertCircle, Sparkles } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { generateNoteAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Link from "next/link";

interface AiNoteEditorProps {
  projectId: string;
  currentNoteId?: string;
  onNoteGenerated: (data: { title: string; content: string }) => void;
  contentValue: string;
  rows?: number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function AiNoteEditor({
  projectId,
  currentNoteId,
  onNoteGenerated,
  contentValue,
  ...props
}: AiNoteEditorProps) {
  const [isPending, startTransition] = useTransition();
  const { data, getNotesByProjectId } = useData();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");

  const hasApiKey = !!data.apiKey;

  const handleGenerate = () => {
    if (!prompt) {
        toast({
            variant: "destructive",
            title: "Prompt is empty",
            description: "Please enter a prompt to generate content.",
        });
        return;
    }
    if (!hasApiKey) {
        toast({
            variant: "destructive",
            title: "API Key Missing",
            description: "Please set your Gemini API key in settings.",
        });
        return;
    }

    startTransition(async () => {
      const allNotes = getNotesByProjectId(projectId);
      const contextNotes = allNotes
        .filter((note) => note.id !== currentNoteId)
        .map((note) => `Title: ${note.title}\nContent: ${note.content}`);

      const result = await generateNoteAction({ contextNotes, prompt }, data.apiKey);

      if (result && result.title !== 'AI Generation Failed') {
        onNoteGenerated(result);
        toast({
          title: "AI Content Generated",
          description: "The AI has generated content and a title for your note.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "AI Generation Failed",
          description: result?.content || "Could not generate content. Please check your API key and try again.",
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
            {!hasApiKey && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Key Required</AlertTitle>
                <AlertDescription>
                  Please <Link href="/settings" className="font-semibold underline">add your Gemini API key</Link> to enable AI features.
                </AlertDescription>
              </Alert>
            )}
            <Label htmlFor="ai-prompt">AI Prompt</Label>
            <div className="flex gap-2">
                <Input
                    id="ai-prompt"
                    placeholder="e.g., Summarize the context notes"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isPending || !hasApiKey}
                />
                <Button onClick={handleGenerate} disabled={isPending || !hasApiKey} className="whitespace-nowrap">
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
