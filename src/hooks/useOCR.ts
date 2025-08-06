import { useCallback } from 'react';
import Tesseract from 'tesseract.js';

export const useOCR = () => {
  const extractText = useCallback(async (imageFile: File): Promise<string> => {
    try {
      const result = await Tesseract.recognize(imageFile, 'eng');
      return result.data.text
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.,!?\-'"]/g, '')
        .trim();
    } catch {
      return '';
    }
  }, []);

  return { extractText };
};