'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File) => void;
  previewType?: 'image' | 'audio' | 'pdf' | 'any';
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = '*/*',
  maxSizeMB = 10,
  onFileSelect,
  previewType = 'any',
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    const sizeInMB = file.size / (1024 * 1024);
    
    if (sizeInMB > maxSizeMB) {
      setError(`File size exceeds the ${maxSizeMB}MB limit.`);
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;
    
    setSelectedFile(file);
    onFileSelect(file);

    // Generate previews
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Simulate progress bar upload effect
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <span className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">
        {label}
      </span>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px]
          ${dragActive 
            ? 'border-gold-500 bg-gold-50/10 dark:bg-gold-950/10 shadow-gold-glow' 
            : 'border-surface-200 dark:border-surface-800 bg-surface-50/10 hover:border-surface-400 dark:hover:border-surface-700'
          }
        `}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">
              Drag & Drop file here, or <span className="text-gold-500 font-bold hover:underline">browse</span>
            </p>
            <p className="text-xs text-surface-400">
              Supports files up to {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {previewUrl ? (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-500">
                {previewType === 'audio' ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            )}

            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-surface-800 dark:text-surface-200">
                {selectedFile.name}
              </span>
              <span className="text-xs text-surface-400">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>

            {uploading && (
              <div className="w-full max-w-[240px] flex flex-col items-center gap-1.5">
                <div className="w-full bg-surface-200 dark:bg-surface-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-gold-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs font-semibold text-gold-500">{progress}% Uploaded</span>
              </div>
            )}

            {!uploading && (
              <button
                onClick={removeFile}
                className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/5 transition-all"
              >
                Remove File
              </button>
            )}
          </div>
        )}
      </div>

      {error && <span className="text-xs font-semibold text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default FileUpload;
