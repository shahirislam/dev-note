"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { DataSync } from "@/components/DataSync";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { data, setApiKey } = useData();
  const [apiKeyInput, setApiKeyInput] = useState(data.apiKey || "");
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    setApiKey(apiKeyInput);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been updated.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="text-base">Theme</Label>
              <p className="text-sm text-muted-foreground">
                Select the application theme.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Provide your own Google Gemini API key to enable AI features. Your key is stored securely in your browser's local storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
              <Button onClick={handleSaveApiKey}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                (This is a demo and does not send real notifications)
              </p>
            </div>
            <Switch id="notifications" disabled />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export your data for backup or import it to another device.</CardDescription>
        </CardHeader>
        <CardContent>
            <DataSync />
        </CardContent>
      </Card>
    </div>
  );
}
