import { useCallback, useMemo } from 'react';

const FEATURE_SCALE = {
  brightness: { mean: 128, std: 64 },
  contrast: { mean: 50, std: 25 },
  colorfulness: { mean: 50, std: 40 },
  edgeRatio: { mean: 0.2, std: 0.1 },
};

const STORAGE_KEY = 'meme_judge_model_v2';

type Weights = {
  brightness: number;
  contrast: number;
  colorfulness: number;
  edgeRatio: number;
  bias: number;
};

const defaultWeights: Weights = {
  brightness: 0.8,
  contrast: 1.2,
  colorfulness: 0.6,
  edgeRatio: 1.1,
  bias: 4.5,
};

const loadWeights = (): Weights => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { ...defaultWeights };
};

const saveWeights = (w: Weights) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(w));
  } catch {}
};

const extractFeaturesFromImage = (image: HTMLImageElement): {
  brightness: number;
  contrast: number;
  colorfulness: number;
  edgeRatio: number;
} => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 224;
  canvas.height = 224;
  ctx.drawImage(image, 0, 0, 224, 224);
  const imageData = ctx.getImageData(0, 0, 224, 224);
  const data = imageData.data;

  let brightness = 0;
  let colorfulness = 0;
  const pixels: { gray: number }[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    pixels.push({ gray });
    brightness += gray;
    colorfulness += Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
  }

  brightness /= pixels.length;
  colorfulness /= pixels.length;

  let variance = 0;
  for (const p of pixels) {
    variance += Math.pow(p.gray - brightness, 2);
  }
  const contrast = Math.sqrt(variance / pixels.length);

  let edgeCount = 0;
  for (let i = 0; i < 220; i++) {
    for (let j = 0; j < 220; j++) {
      const idx = i * 224 + j;
      const current = pixels[idx]?.gray || 0;
      const right = pixels[idx + 1]?.gray || 0;
      const bottom = pixels[(i + 1) * 224 + j]?.gray || 0;
      if (Math.abs(current - right) > 30 || Math.abs(current - bottom) > 30) {
        edgeCount++;
      }
    }
  }
  const edgeRatio = edgeCount / (220 * 220);

  return {
    brightness,
    contrast,
    colorfulness,
    edgeRatio,
  };
};

const normalize = (feature: keyof typeof FEATURE_SCALE, value: number) => {
  const { mean, std } = FEATURE_SCALE[feature];
  return (value - mean) / (std || 1);
};

export const useTensorFlow = () => {
  const weightsRef = useMemo(() => ({ current: loadWeights() }), []);
  const learningRate = 0.01;

  const predictMemeRating = useCallback(
    async (imageFile: File): Promise<{ rating: number; confidence: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const raw = extractFeaturesFromImage(img);
          const nb = normalize('brightness', raw.brightness);
          const nc = normalize('contrast', raw.contrast);
          const ncol = normalize('colorfulness', raw.colorfulness);
          const ne = normalize('edgeRatio', raw.edgeRatio);

          const w = weightsRef.current;
          let score =
            w.brightness * nb +
            w.contrast * nc +
            w.colorfulness * ncol +
            w.edgeRatio * ne +
            w.bias;

          let rating = Math.min(10, Math.max(1, score));
          const confidence = Math.max(0.5, Math.min(1, 1 - Math.abs(score - rating) / 5));

          resolve({
            rating: Math.round(rating * 10) / 10,
            confidence: Math.round(confidence * 100) / 100,
          });
        };
        img.onerror = (e) => reject(e);
        img.src = URL.createObjectURL(imageFile);
      });
    },
    []
  );

  const trainOnExample = useCallback(
    async (imageFile: File, humanRating: number): Promise<void> => {
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => {
          const raw = extractFeaturesFromImage(img);
          const nb = normalize('brightness', raw.brightness);
          const nc = normalize('contrast', raw.contrast);
          const ncol = normalize('colorfulness', raw.colorfulness);
          const ne = normalize('edgeRatio', raw.edgeRatio);

          const w = weightsRef.current;

          const pred =
            w.brightness * nb +
            w.contrast * nc +
            w.colorfulness * ncol +
            w.edgeRatio * ne +
            w.bias;

          const error = humanRating - pred;

          w.brightness += learningRate * error * nb;
          w.contrast += learningRate * error * nc;
          w.colorfulness += learningRate * error * ncol;
          w.edgeRatio += learningRate * error * ne;
          w.bias += learningRate * error;

          const decay = 0.998;
          w.brightness *= decay;
          w.contrast *= decay;
          w.colorfulness *= decay;
          w.edgeRatio *= decay;

          saveWeights(w);
          resolve();
        };
        img.src = URL.createObjectURL(imageFile);
      });
    },
    []
  );

  return {
    predictMemeRating,
    trainOnExample,
  };
};
