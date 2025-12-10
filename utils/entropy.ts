import { EntropyResult } from '../types';

export const calculateEntropy = (password: string): EntropyResult => {
  if (!password) {
    return { entropy: 0, charSetSize: 0, length: 0, strengthLabel: 'Very Weak' };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/\d/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32; // Approx symbols

  // Basic Shannon Entropy: H = L * log2(R)
  const entropy = password.length * Math.log2(Math.max(poolSize, 1));
  
  let strengthLabel: EntropyResult['strengthLabel'] = 'Very Weak';
  if (entropy > 120) strengthLabel = 'Very Strong';
  else if (entropy > 80) strengthLabel = 'Strong';
  else if (entropy > 60) strengthLabel = 'Reasonable';
  else if (entropy > 40) strengthLabel = 'Weak';

  return {
    entropy: parseFloat(entropy.toFixed(2)),
    charSetSize: poolSize,
    length: password.length,
    strengthLabel
  };
};

export const generateRandomString = (
  length: number, 
  useSymbols: boolean, 
  useNumbers: boolean, 
  useUppercase: boolean,
  excludeAmbiguous: boolean,
  useLowercase: boolean = true
): string => {
  let chars = '';
  if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumbers) chars += '0123456789';
  if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Safety fallback if no character sets are selected
  if (chars.length === 0) {
     chars = '0123456789'; // Default to numbers if nothing else
  }

  if (excludeAmbiguous) {
    // Exclude I, l, 1, O, 0
    chars = chars.replace(/[Il1O0]/g, '');
  }

  let result = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};

export const estimateCrackTime = (entropy: number): string => {
  if (entropy === 0) return "Instant";
  
  // Assumption: Massive supercomputer array capable of 100 Trillion guesses/sec (10^14)
  // This is a conservative "Engineering Grade" paranoia level estimate.
  const guessesPerSecond = 1e14; 
  const totalCombinations = Math.pow(2, entropy);
  const seconds = totalCombinations / guessesPerSecond;

  if (seconds < 1) return "Instant";
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
  if (seconds < 3153600000) return `${Math.floor(seconds / 31536000)} years`;
  if (seconds < 315360000000) return `${Math.floor(seconds / 3153600000)} centuries`;
  
  return "Heat Death of Universe";
};

export const getNatoPhonetic = (char: string): string => {
  const map: Record<string, string> = {
    'a': 'Alpha', 'b': 'Bravo', 'c': 'Charlie', 'd': 'Delta', 'e': 'Echo', 
    'f': 'Foxtrot', 'g': 'Golf', 'h': 'Hotel', 'i': 'India', 'j': 'Juliett', 
    'k': 'Kilo', 'l': 'Lima', 'm': 'Mike', 'n': 'November', 'o': 'Oscar', 
    'p': 'Papa', 'q': 'Quebec', 'r': 'Romeo', 's': 'Sierra', 't': 'Tango', 
    'u': 'Uniform', 'v': 'Victor', 'w': 'Whiskey', 'x': 'X-ray', 'y': 'Yankee', 
    'z': 'Zulu',
    '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', 
    '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
    '!': 'Exclamation', '@': 'At', '#': 'Hash', '$': 'Dollar', '%': 'Percent',
    '^': 'Caret', '&': 'Ampersand', '*': 'Asterisk', '(': 'Open-Paren', ')': 'Close-Paren',
    '-': 'Dash', '_': 'Underscore', '+': 'Plus', '=': 'Equals', '[': 'Open-Bracket',
    ']': 'Close-Bracket', '{': 'Open-Brace', '}': 'Close-Brace', '|': 'Pipe',
    ';': 'Semicolon', ':': 'Colon', ',': 'Comma', '.': 'Dot', '<': 'Less-Than',
    '>': 'Greater-Than', '?': 'Question', '/': 'Slash', '\\': 'Backslash',
    ' ': 'Space'
  };

  const lower = char.toLowerCase();
  return map[lower] || char; // Return original if not found
};