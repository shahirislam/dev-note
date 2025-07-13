"use client";

import { useData } from "@/contexts/DataContext";
import TaskItem from "./TaskItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { ListTodo, CheckCircle } from "lucide-react";

interface TaskListProps {
  projectId: string;
}

export default function TaskList({ projectId }: TaskListProps) {
  const { getTasksByProjectId } = useData();
  const tasks = getTasksByProjectId(projectId);
  const completedTasks = tasks.filter(task => task.isDone).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  const openTasks = tasks.filter(task => !task.isDone);
  const doneTasks = tasks.filter(task => task.isDone);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Progress</CardTitle>
        <CardDescription>{completedTasks} of {tasks.length} tasks completed.</CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {openTasks.length > 0 && (
                <div>
                    <h3 className="mb-2 text-lg font-semibold">To-Do</h3>
                    <div className="space-y-2">
                        {openTasks.map(task => <TaskItem key={task.id} task={task} />)}
                    </div>
                </div>
            )}
            {doneTasks.length > 0 && (
                 <div>
                    <h3 className="mb-2 text-lg font-semibold text-muted-foreground">Completed</h3>
                    <div className="space-y-2">
                        {doneTasks.map(task => <TaskItem key={task.id} task={task} />)}
                    </div>
                </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
             <div className="flex justify-center mb-4">
                <div className="bg-secondary p-4 rounded-full">
                    <ListTodo className="h-10 w-10 text-muted-foreground"/>
                </div>
            </div>
            <h3 className="text-xl font-semibold">No tasks yet</h3>
            <p className="text-muted-foreground mt-2">Add your first task using the '+' button below.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
