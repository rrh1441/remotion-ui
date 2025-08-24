import React, { createContext, useContext, useMemo } from 'react';
import { staticFile } from 'remotion';

export interface TTSProviderConfig {
  provider: 'browser' | 'google' | 'azure' | 'elevenlabs' | 'polly' | 'openai' | 'local';
  apiKey?: string;
  apiEndpoint?: string;
  defaultVoice?: string;
  defaultLanguage?: string;
  defaultSpeed?: number;
  defaultPitch?: number;
  cachePath?: string;
}

export interface TTSOptions {
  voice?: string;
  language?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  ssml?: boolean;
}

export interface TTSResult {
  audioUrl: string;
  duration: number;
  transcript?: string;
  timestamps?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

interface TTSContextValue {
  config: TTSProviderConfig;
  synthesize: (text: string, options?: TTSOptions) => Promise<TTSResult>;
  getCachedAudio: (text: string, options?: TTSOptions) => string | null;
}

const TTSContext = createContext<TTSContextValue | null>(null);

export interface TTSProviderProps {
  config: TTSProviderConfig;
  children: React.ReactNode;
}

export const TTSProvider: React.FC<TTSProviderProps> = ({ config, children }) => {
  const synthesize = useMemo(() => {
    return async (text: string, options?: TTSOptions): Promise<TTSResult> => {
      const mergedOptions = {
        voice: options?.voice || config.defaultVoice,
        language: options?.language || config.defaultLanguage || 'en-US',
        speed: options?.speed || config.defaultSpeed || 1.0,
        pitch: options?.pitch || config.defaultPitch || 1.0,
        volume: options?.volume || 1.0,
        ssml: options?.ssml || false,
      };

      switch (config.provider) {
        case 'browser':
          return synthesizeBrowser(text, mergedOptions);
        case 'local':
          return synthesizeLocal(text, mergedOptions, config);
        case 'google':
        case 'azure':
        case 'elevenlabs':
        case 'polly':
        case 'openai':
          return synthesizeCloud(text, mergedOptions, config);
        default:
          throw new Error(`Unsupported TTS provider: ${config.provider}`);
      }
    };
  }, [config]);

  const getCachedAudio = useMemo(() => {
    return (text: string, options?: TTSOptions): string | null => {
      if (!config.cachePath) return null;
      
      const cacheKey = generateCacheKey(text, {
        ...options,
        provider: config.provider,
      });
      
      try {
        return staticFile(`${config.cachePath}/${cacheKey}.mp3`);
      } catch {
        return null;
      }
    };
  }, [config]);

  const value = useMemo(() => ({
    config,
    synthesize,
    getCachedAudio,
  }), [config, synthesize, getCachedAudio]);

  return (
    <TTSContext.Provider value={value}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};

async function synthesizeBrowser(text: string, options: Required<TTSOptions>): Promise<TTSResult> {
  if (!('speechSynthesis' in window)) {
    throw new Error('Browser TTS not supported');
  }

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language;
    utterance.rate = options.speed;
    utterance.pitch = options.pitch;
    utterance.volume = options.volume;

    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    const estimatedDuration = (text.length / 15) * (1 / options.speed);

    utterance.onend = () => {
      resolve({
        audioUrl: 'browser-tts',
        duration: estimatedDuration,
        transcript: text,
      });
    };

    utterance.onerror = (event) => {
      reject(new Error(`Browser TTS error: ${event.error}`));
    };

    speechSynthesis.speak(utterance);
  });
}

async function synthesizeLocal(
  text: string,
  options: Required<TTSOptions>,
  config: TTSProviderConfig
): Promise<TTSResult> {
  if (!config.cachePath) {
    throw new Error('Local TTS requires cachePath to be set');
  }

  const cacheKey = generateCacheKey(text, { ...options, provider: 'local' });
  const audioPath = `${config.cachePath}/${cacheKey}.mp3`;

  try {
    const audioUrl = staticFile(audioPath);
    
    const metadataPath = `${config.cachePath}/${cacheKey}.json`;
    const metadata = await fetch(staticFile(metadataPath)).then(r => r.json());

    return {
      audioUrl,
      duration: metadata.duration,
      transcript: text,
      timestamps: metadata.timestamps,
    };
  } catch (error) {
    throw new Error(`Local audio file not found: ${audioPath}. Please pre-generate TTS audio.`);
  }
}

async function synthesizeCloud(
  text: string,
  options: Required<TTSOptions>,
  config: TTSProviderConfig
): Promise<TTSResult> {
  if (!config.apiKey) {
    throw new Error(`${config.provider} TTS requires apiKey to be set`);
  }

  if (!config.apiEndpoint) {
    throw new Error(`${config.provider} TTS requires apiEndpoint to be set`);
  }

  const response = await fetch(config.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      text,
      voice: options.voice,
      language: options.language,
      speed: options.speed,
      pitch: options.pitch,
      ssml: options.ssml,
    }),
  });

  if (!response.ok) {
    throw new Error(`${config.provider} TTS API error: ${response.statusText}`);
  }

  const result = await response.json();
  
  return {
    audioUrl: result.audioUrl,
    duration: result.duration,
    transcript: text,
    timestamps: result.timestamps,
  };
}

function generateCacheKey(text: string, options: any): string {
  const normalized = JSON.stringify({ text, ...options });
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}