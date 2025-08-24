export { 
  TTSProvider, 
  useTTS,
  type TTSProviderConfig,
  type TTSOptions,
  type TTSResult,
  type TTSProviderProps 
} from './components/TTSProvider';

export { 
  AudioSequence,
  AudioTimeline,
  type AudioSegment,
  type AudioSequenceProps,
  type AudioMarker,
  type AudioTimelineProps
} from './components/AudioSequence';

export {
  CaptionSync,
  MultiLanguageCaptions,
  parseSRT,
  parseVTT,
  type Caption,
  type CaptionSyncProps,
  type SubtitleTrack,
  type MultiLanguageCaptionsProps
} from './components/CaptionSync';

export {
  WaveformVisualizer,
  SpectrumAnalyzer,
  generateWaveformData,
  type WaveformData,
  type WaveformVisualizerProps,
  type SpectrumAnalyzerProps
} from './components/WaveformVisualizer';