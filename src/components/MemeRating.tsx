import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemeRatingProps {
  rating: number;
  confidence?: number;
  isLoading?: boolean;
  extractedText?: string;
}

export const MemeRating: React.FC<MemeRatingProps> = ({
  rating,
  confidence,
  isLoading,
  extractedText
}) => {
  const getColor = (score: number) =>
    score >= 8 ? 'text-success' : score >= 6 ? 'text-warning' : score >= 4 ? 'text-accent' : 'text-destructive';

  const getEmoji = (score: number) =>
    score >= 8 ? '😂' : score >= 6 ? '😄' : score >= 4 ? '😐' : '😴';

  const getLabel = (score: number) =>
    score >= 8 ? 'Hilarious' : score >= 6 ? 'Funny' : score >= 4 ? 'Okay' : 'Not Funny';

  const getIcon = (score: number) =>
    score >= 8 ? Award : score >= 6 ? TrendingUp : score >= 4 ? Star : Zap;

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-card">
        <CardContent className="text-center space-y-6 py-8">
          <div className="animate-pulse-glow w-16 h-16 mx-auto bg-gradient-primary rounded-full flex justify-center items-center">
            <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary-foreground border-t-transparent" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Analyzing Meme...</p>
            <p className="text-sm text-muted-foreground">AI is judging your meme</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-card hover:shadow-glow transition-all duration-300">
      <CardContent className="text-center space-y-6 py-8">
        <div className="space-y-3">
          <div className={cn("text-5xl font-bold transition-all duration-500", getColor(rating))}>
            {rating.toFixed(1)}
          </div>
          <div className="text-3xl">{getEmoji(rating)}</div>

          <Badge
            variant="secondary"
            className={cn(
              "text-base px-3 py-1 font-bold",
              rating >= 8 && "bg-gradient-primary text-primary-foreground",
              rating >= 6 && rating < 8 && "bg-gradient-meme text-primary-foreground"
            )}
          >
            {getLabel(rating)}
          </Badge>
        </div>

        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              rating >= 8
                ? "bg-gradient-primary"
                : rating >= 6
                ? "bg-gradient-meme"
                : "bg-gradient-to-r from-destructive to-warning"
            )}
            style={{ width: `${(rating / 10) * 100}%` }}
          />
        </div>

        {extractedText && extractedText.length > 3 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs italic text-muted-foreground">
              "{extractedText.slice(0, 100)}
              {extractedText.length > 100 ? '...' : ''}"
            </p>
          </div>
        )}

        {confidence !== undefined && (
          <p className="text-xs text-muted-foreground">
            Confidence: {(confidence * 100).toFixed(0)}%
          </p>
        )}
      </CardContent>
    </Card>
  );
};
