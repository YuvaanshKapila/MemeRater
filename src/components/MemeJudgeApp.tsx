import React, { useState } from 'react';
import { MemeUploader } from './MemeUploader';
import { MemeRating } from './MemeRating';
import { useTensorFlow } from '@/hooks/useTensorFlow';
import { useOCR } from '@/hooks/useOCR';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

export const MemeJudgeApp: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { predictMemeRating } = useTensorFlow();
  const { extractText } = useOCR();
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    setImage(file);
    setRating(null);
    setConfidence(null);
    setText(null);
    setLoading(true);

    try {
      const [ratingRes, textRes] = await Promise.allSettled([
        predictMemeRating(file),
        extractText(file),
      ]);

      if (ratingRes.status === 'fulfilled') {
        setRating(ratingRes.value.rating);
        setConfidence(ratingRes.value.confidence);
      } else {
        toast({
          title: 'Analysis Failed',
          description: 'Could not analyze your meme. Please try again.',
          variant: 'destructive',
        });
      }

      if (textRes.status === 'fulfilled' && textRes.value.trim()) {
        setText(textRes.value);
      }
    } catch {
      toast({
        title: 'Analysis Failed',
        description: 'Something went wrong during analysis.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex justify-center">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex justify-center items-center shadow-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-primary">Meme Judge</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold">Rate Your Meme</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload or paste your meme and get an instant rating from 1–10
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MemeUploader onImageUpload={handleUpload} isLoading={loading} />
          {(rating !== null || loading) && (
            <MemeRating
              rating={rating || 0}
              confidence={confidence || undefined}
              isLoading={loading}
              extractedText={text || undefined}
            />
          )}
        </div>
      </main>
    </div>
  );
};
