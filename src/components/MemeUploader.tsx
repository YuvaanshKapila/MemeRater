import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Clipboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MemeUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading?: boolean;
}

export const MemeUploader: React.FC<MemeUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const selectFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setPreviewUrl(URL.createObjectURL(file));
    onImageUpload(file);
  }, [onImageUpload]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) selectFile(file);
  };

  const handlePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const ext = type.split('/')[1] || 'png';
            const file = new File([blob], `pasted-meme.${ext}`, { type });
            selectFile(file);
            toast({
              title: 'Image Pasted',
              description: 'Successfully pasted image from clipboard!',
            });
            return;
          }
        }
      }
      toast({
        title: 'No Image Found',
        description: 'No image in clipboard. Copy an image first.',
        variant: 'destructive',
      });
    } catch {
      toast({
        title: 'Paste Failed',
        description: 'Could not access clipboard. Use the upload button instead.',
        variant: 'destructive',
      });
    }
  }, [selectFile, toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handlePaste]);

  const openFilePicker = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
    e.target.value = '';
  };

  return (
    <Card className="w-full shadow-card hover:shadow-glow transition-all duration-300">
      <CardContent className="p-8">
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer',
            dragOver
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
            isLoading && 'opacity-50 pointer-events-none'
          )}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={e => { e.preventDefault(); setDragOver(false); }}
          onDrop={handleDrop}
          onClick={!previewUrl ? openFilePicker : undefined}
        >
          {!previewUrl ? (
            <div className="space-y-6">
              <Upload className="w-16 h-16 text-muted-foreground mx-auto" />
              <div className="space-y-3">
                <p className="text-xl font-medium">Upload Your Meme</p>
                <p className="text-muted-foreground">
                  Drop a file, click to browse, or paste from clipboard
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Button onClick={openFilePicker} disabled={isLoading} className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Browse Files
                  </Button>
                  <Button onClick={handlePaste} disabled={isLoading} variant="outline" className="flex items-center gap-2">
                    <Clipboard className="w-4 h-4" />
                    Paste Image
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Supports JPG, PNG, GIF • Press Ctrl+V to paste
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Meme preview"
                className="w-full h-64 object-contain rounded-lg border"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button onClick={handlePaste} variant="secondary" size="sm" disabled={isLoading}>
                  <Clipboard className="w-4 h-4" />
                </Button>
                <Button onClick={openFilePicker} variant="secondary" size="sm" disabled={isLoading}>
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        <input
          ref={el => (fileRef.current = el)}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
