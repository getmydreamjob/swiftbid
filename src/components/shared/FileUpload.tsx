// src/components/shared/FileUpload.tsx
'use client';

import React, { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, XCircle, FileText, FileImage, FileType, FileJson, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFilesUpdated: (files: File[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string; // e.g., ".pdf,.docx,.jpg,.png,application/pdf,image/*"
  maxFiles?: number;
  maxFileSizeMB?: number;
  id?: string;
}

const getFileIcon = (fileType: string): React.ReactElement => {
  if (fileType.startsWith('image/')) return <FileImage className="h-6 w-6 text-primary shrink-0" />;
  if (fileType === 'application/pdf') return <FileType className="h-6 w-6 text-red-500 shrink-0" />; // Using FileType for PDF for variety or specific PDF icon
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') return <FileText className="h-6 w-6 text-blue-500 shrink-0" />;
  if (fileType === 'application/json') return <FileJson className="h-6 w-6 text-yellow-500 shrink-0" />;
  return <FileQuestion className="h-6 w-6 text-muted-foreground shrink-0" />;
};


export function FileUpload({
  onFilesUpdated,
  multiple = true,
  acceptedFileTypes = ".pdf,.docx,.jpeg,.jpg,.png",
  maxFiles = 5,
  maxFileSizeMB = 10,
  id = "file-upload-input"
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File "${file.name}" (${(file.size / (1024*1024)).toFixed(2)}MB) exceeds the ${maxFileSizeMB}MB limit.`;
    }
    
    const allowedTypesArray = acceptedFileTypes.split(',').map(t => t.trim().toLowerCase());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
    const fileMimeType = file.type.toLowerCase();

    const isTypeAllowed = allowedTypesArray.some(type => {
      if (type.startsWith('.')) { // Match by extension
        return fileExtension === type;
      }
      if (type.endsWith('/*')) { // Match by wildcard MIME type (e.g., image/*)
        return fileMimeType.startsWith(type.slice(0, -2));
      }
      return fileMimeType === type; // Match by exact MIME type
    });

    if (!isTypeAllowed) {
       return `File "${file.name}" has an unsupported type. Allowed types: ${acceptedFileTypes.replace(/\./g, '').toUpperCase().split(',').join(', ')}.`;
    }
    return null;
  };

  const handleFiles = (newFilesArray: File[]) => {
    const currentErrors: string[] = [];
    let currentSelectedCount = selectedFiles.length;

    const validNewFiles = newFilesArray.filter(file => {
      if (currentSelectedCount >= maxFiles && multiple) {
        currentErrors.push(`Cannot add "${file.name}". Maximum of ${maxFiles} files already selected.`);
        return false;
      }
      const error = validateFile(file);
      if (error) {
        currentErrors.push(error);
        return false;
      }
      // Prevent duplicates by name
      if (selectedFiles.some(sf => sf.name === file.name && sf.size === file.size)) {
        currentErrors.push(`File "${file.name}" is already selected.`);
        return false;
      }
      currentSelectedCount++;
      return true;
    });

    setFileErrors(currentErrors);

    if (validNewFiles.length === 0 && currentErrors.length > 0 && newFilesArray.length > 0) {
      // Only errors from new files, don't update selected files unless some are valid
      return;
    }
    
    const updatedFiles = multiple ? [...selectedFiles, ...validNewFiles].slice(0, maxFiles) : validNewFiles.slice(0,1);
    setSelectedFiles(updatedFiles);
    onFilesUpdated(updatedFiles);

    validNewFiles.forEach(file => {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        } else {
          clearInterval(interval);
        }
      }, 100);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(Array.from(event.target.files));
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFiles(Array.from(event.dataTransfer.files));
      event.dataTransfer.clearData();
    }
  };

  const handleRemoveFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter(file => file.name !== fileName);
    setSelectedFiles(updatedFiles);
    onFilesUpdated(updatedFiles);
    setUploadProgress(prev => {
      const newProgress = {...prev};
      delete newProgress[fileName];
      return newProgress;
    });
    setFileErrors(prev => prev.filter(err => !err.includes(`"${fileName}"`))); // Clear errors related to this file
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/80 transition-colors",
          isDragging ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && triggerFileInput()}
        aria-labelledby={`${id}-label`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept={acceptedFileTypes}
          className="hidden"
          id={id}
        />
        <UploadCloud className={cn("w-12 h-12 mb-3", isDragging ? "text-primary" : "text-muted-foreground")} />
        <p id={`${id}-label`} className="mb-2 text-sm text-center text-muted-foreground">
          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-center text-muted-foreground">
          {acceptedFileTypes.replace(/\./g, '').toUpperCase().split(',').join(', ')} (Max {multiple ? maxFiles : 1} file{multiple && maxFiles > 1 ? 's' : ''}, {maxFileSizeMB}MB each)
        </p>
      </div>

      {fileErrors.length > 0 && (
        <div className="mt-2 space-y-1">
          {fileErrors.map((error, index) => (
            <p key={index} className="text-xs text-destructive">
              {error}
            </p>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Uploaded Files ({selectedFiles.length}{multiple ? `/${maxFiles}`: ''}):
          </h4>
          <ul className="space-y-3">
            {selectedFiles.map((file) => (
              <li key={file.name + file.size} className="flex items-center justify-between p-3 border rounded-lg bg-card shadow-sm">
                <div className="flex items-center space-x-3 overflow-hidden">
                  {getFileIcon(file.type)}
                  <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                      {uploadProgress[file.name] < 100 && ` - Uploading...`}
                      {uploadProgress[file.name] === 100 && ` - Uploaded`}
                    </p>
                     {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                        <Progress value={uploadProgress[file.name]} className="h-1.5 mt-1 w-full" />
                      )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(file.name)} aria-label={`Remove ${file.name}`} className="shrink-0">
                  <XCircle className="h-5 w-5 text-destructive/70 hover:text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
