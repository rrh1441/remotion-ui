'use client';

import { Player } from '@remotion/player';
import { ComponentType, useMemo } from 'react';
// import { ThemeProvider } from '@/templates/themes/ThemeProvider';

interface RemotionPlayerProps {
  component: ComponentType<any>;
  durationInFrames: number;
  fps?: number;
  compositionWidth?: number;
  compositionHeight?: number;
  props?: Record<string, any>;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
}

export function RemotionPlayer({
  component: Component,
  durationInFrames,
  fps = 30,
  compositionWidth = 1920,
  compositionHeight = 1080,
  props = {},
  showControls = true,
  autoPlay = false,
  loop = false,
}: RemotionPlayerProps) {
  const Composition = useMemo(() => {
    return () => (
      <Component {...props} />
    );
  }, [Component, props]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <Player
        component={Composition}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        controls={showControls}
        autoPlay={autoPlay}
        loop={loop}
        style={{
          width: '100%',
          aspectRatio: `${compositionWidth} / ${compositionHeight}`,
        }}
        inputProps={props}
      />
    </div>
  );
}