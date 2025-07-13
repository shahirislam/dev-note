"use client";

import React, { useRef } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload } from 'lucide-react';
import { AppData } from '@/lib/types';

export function DataSync() {
  const { data, importData } = useData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = `devdiary_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      toast({
        title: 'Success',
        description: 'Your data has been exported.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to export data.',
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File content is not a string");
        
        const parsedData: AppData = JSON.parse(text);
        const success = importData(parsedData);
        if (success) {
          toast({
            title: 'Success',
            description: 'Your data has been imported successfully.',
          });
        } else {
            throw new Error("Invalid data format.");
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Import Error',
          description: 'Failed to import data. Please check the file format.',
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export Data
      </Button>
      <Button variant="outline" onClick={handleImportClick}>
        <Upload className="mr-2 h-4 w-4" />
        Import Data
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
}
