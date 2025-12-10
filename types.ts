export interface EntropyResult {
  entropy: number; // In bits
  charSetSize: number;
  length: number;
  strengthLabel: 'Very Weak' | 'Weak' | 'Reasonable' | 'Strong' | 'Very Strong';
}

export interface AiAnalysisResult {
  score: number; // 0-100
  critique: string;
  timeToCrackEstimate: string;
  improvements: string[];
}

export enum AppMode {
  GENERATOR = 'GENERATOR',
  ANALYZER = 'ANALYZER'
}

export interface GeneratedPassword {
  value: string;
  type: 'random' | 'memorable' | 'pin';
  entropy: number;
}