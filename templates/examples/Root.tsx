import React from 'react';
import { Composition } from 'remotion';
import { ThemeProvider } from '../themes/ThemeProvider';
import { ASPECT_PRESETS, createComposition } from '../presets/AspectPresets';
import { TitleCard } from '../components/TitleCard';
import { LowerThird } from '../components/LowerThird';
import { StatBlock } from '../components/StatBlock';
import { ListReveal } from '../components/ListReveal';
import { QuoteBlock } from '../components/QuoteBlock';
import { EndCard } from '../components/EndCard';
import { DeviceFrame } from '../components/DeviceFrame';
import { CrossFade } from '../components/transitions/CrossFade';
import { Push } from '../components/transitions/Push';
import { Wipe } from '../components/transitions/Wipe';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Aspect Ratio Presets */}
      {Object.values(ASPECT_PRESETS).map((preset) => (
        <Composition
          key={`preset-${preset.id}`}
          id={`preset-${preset.id}`}
          component={() => (
            <ThemeProvider>
              <div style={{ background: '#000' }}>
                <TitleCard
                  title={preset.name}
                  subtitle={`${preset.width}×${preset.height} @ ${preset.fps}fps`}
                />
              </div>
            </ThemeProvider>
          )}
          width={preset.width}
          height={preset.height}
          fps={preset.fps}
          durationInFrames={preset.durationInFrames}
        />
      ))}

      {/* Component Demos */}
      <Composition
        id="demo-title-card"
        component={() => (
          <ThemeProvider>
            <TitleCard
              title="Welcome to Remotion-UI"
              subtitle="Beautiful motion components for your videos"
            />
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />

      <Composition
        id="demo-lower-third"
        component={() => (
          <ThemeProvider>
            <div style={{ background: 'linear-gradient(to bottom, #667eea, #764ba2)' }}>
              <LowerThird
                primary="John Doe"
                secondary="CEO & Founder"
                align="left"
                startAt={30}
              />
            </div>
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />

      <Composition
        id="demo-stat-block"
        component={() => (
          <ThemeProvider>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#f3f4f6' }}>
              <StatBlock
                value="$1.2M"
                label="Revenue"
                delta={{ value: 15, direction: 'up' }}
                startAt={20}
              />
            </div>
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />

      <Composition
        id="demo-list-reveal"
        component={() => (
          <ThemeProvider>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#1f2937' }}>
              <ListReveal
                items={[
                  'Fast and efficient',
                  'Beautiful animations',
                  'Easy to customize',
                  'Production ready'
                ]}
                perItem={15}
                startAt={30}
              />
            </div>
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={200}
      />

      <Composition
        id="demo-quote-block"
        component={() => (
          <ThemeProvider>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#ffffff' }}>
              <QuoteBlock
                quote="The best way to predict the future is to create it."
                author="Peter Drucker"
                startAt={30}
              />
            </div>
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={180}
      />

      <Composition
        id="demo-end-card"
        component={() => (
          <ThemeProvider>
            <EndCard
              heading="Thanks for watching!"
              cta={{
                label: 'Visit our website',
                href: 'https://remotion-ui.dev'
              }}
              startAt={0}
            />
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />

      <Composition
        id="demo-device-frame-browser"
        component={() => (
          <ThemeProvider>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#e5e7eb', padding: '60px' }}>
              <DeviceFrame
                kind="browser"
                url="https://remotion-ui.dev"
                showControls={true}
              >
                <div style={{ padding: '40px', background: '#fff', height: '100%' }}>
                  <h1 style={{ fontSize: '48px', margin: 0 }}>Hello World</h1>
                  <p style={{ fontSize: '24px', color: '#6b7280' }}>This is a browser frame demo</p>
                </div>
              </DeviceFrame>
            </div>
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />

      <Composition
        id="demo-device-frame-phone"
        component={() => (
          <ThemeProvider>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#f3f4f6' }}>
              <DeviceFrame
                kind="phone"
                showControls={true}
              >
                <div style={{ padding: '20px', background: 'linear-gradient(to bottom, #667eea, #764ba2)', height: '100%', color: '#fff' }}>
                  <h2 style={{ fontSize: '32px', margin: '0 0 20px' }}>Mobile App</h2>
                  <p style={{ fontSize: '18px' }}>Beautiful on every device</p>
                </div>
              </DeviceFrame>
            </div>
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />

      {/* Transition Demos */}
      <Composition
        id="demo-cross-fade"
        component={() => (
          <ThemeProvider>
            <CrossFade
              from={
                <div style={{ width: '100%', height: '100%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h1 style={{ color: '#fff', fontSize: '60px' }}>Scene 1</h1>
                </div>
              }
              to={
                <div style={{ width: '100%', height: '100%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h1 style={{ color: '#fff', fontSize: '60px' }}>Scene 2</h1>
                </div>
              }
              startAt={60}
              durationInFrames={30}
            />
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />

      <Composition
        id="demo-push"
        component={() => (
          <ThemeProvider>
            <Push
              from={
                <div style={{ width: '100%', height: '100%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h1 style={{ color: '#fff', fontSize: '60px' }}>Slide Out</h1>
                </div>
              }
              to={
                <div style={{ width: '100%', height: '100%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h1 style={{ color: '#fff', fontSize: '60px' }}>Slide In</h1>
                </div>
              }
              direction="left"
              startAt={60}
              durationInFrames={30}
            />
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />

      <Composition
        id="demo-wipe"
        component={() => (
          <ThemeProvider>
            <Wipe
              from={
                <div style={{ width: '100%', height: '100%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h1 style={{ color: '#fff', fontSize: '60px' }}>Wipe Away</h1>
                </div>
              }
              to={
                <div style={{ width: '100%', height: '100%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h1 style={{ color: '#fff', fontSize: '60px' }}>Reveal</h1>
                </div>
              }
              direction="right"
              startAt={60}
              durationInFrames={30}
              blur={true}
            />
          </ThemeProvider>
        )}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
      />
    </>
  );
};