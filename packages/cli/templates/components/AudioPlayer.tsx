import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, Audio, staticFile } from 'remotion';

export interface AudioPlayerProps {
  src: string;
  volume?: number;
  startFrom?: number;
  endAt?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  loop?: boolean;
  playbackRate?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  volume = 1,
  startFrom = 0,
  endAt,
  fadeInDuration = 0,
  fadeOutDuration = 0,
  loop = false,
  playbackRate = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  const actualEndAt = endAt ?? durationInFrames;
  
  let currentVolume = volume;
  
  // Fade in
  if (fadeInDuration > 0 && frame < startFrom + fadeInDuration) {
    currentVolume = volume * ((frame - startFrom) / fadeInDuration);
  }
  
  // Fade out
  if (fadeOutDuration > 0 && frame > actualEndAt - fadeOutDuration) {
    currentVolume = volume * ((actualEndAt - frame) / fadeOutDuration);
  }
  
  // Don't play if outside range
  if (frame < startFrom || frame > actualEndAt) {
    currentVolume = 0;
  }
  
  return (
    <Audio
      src={staticFile(src)}
      volume={currentVolume}
      startFrom={startFrom}
      endAt={actualEndAt}
      loop={loop}
      playbackRate={playbackRate}
    />
  );
};

// Hook for using audio from manifest
export const useAudioAsset = (audioId: string) => {
  const [audioData, setAudioData] = React.useState<any>(null);
  
  useEffect(() => {
    fetch('/assets/audio/v1/audio-manifest.json')
      .then(res => res.json())
      .then(manifest => {
        const sound = manifest.sounds.find((s: any) => s.id === audioId);
        if (sound) {
          setAudioData({
            ...sound,
            url: `/assets/audio/v1/${sound.path}`,
          });
        }
      })
      .catch(console.error);
  }, [audioId]);
  
  return audioData;
};