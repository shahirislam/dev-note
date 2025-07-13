"use client";

import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function TodaysTasks() {
  const { getTodaysTasks, getProjectById } = useData();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const todaysTasks = getTodaysTasks();

  if (!isClient || todaysTasks.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">Today's Focus</h2>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="h-6 w-6 text-primary" />
            <CardTitle>Tasks Due Today</CardTitle>
          </div>
          <CardDescription>Here are the tasks you should focus on today.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {todaysTasks.map(task => {
              const project = getProjectById(task.projectId);
              return (
                <li key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{project?.title || 'Unknown Project'}</p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/project/${task.projectId}?tab=tasks`}>View Task</Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
