"use client";

import { useData } from "@/contexts/DataContext";
import ProjectCard from "./ProjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FolderKanban } from "lucide-react";

export default function ProjectList() {
  const { data } = useData();

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">Projects</h2>
      {data.projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-10 border-dashed">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <div className="bg-secondary p-4 rounded-full">
                        <FolderKanban className="h-10 w-10 text-muted-foreground"/>
                    </div>
                </div>
                <CardTitle className="text-center">No Projects Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center">Click the '+' button to create your first project.</p>
            </CardContent>
        </Card>
      )}
    </section>
  );
}
