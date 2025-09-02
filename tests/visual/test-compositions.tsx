import React from 'react';
import { Composition } from 'remotion';
import { TitleCard } from '../../templates/components/TitleCard';
import { BarChart } from '../../templates/components/BarChart';
import { LineChart } from '../../templates/components/LineChart';
import { FadeIn } from '../../templates/core/primitives/FadeIn';
import { SlideIn } from '../../templates/core/primitives/SlideIn';
import { ScaleIn } from '../../templates/core/primitives/ScaleIn';
import { LoadingSpinner } from '../../templates/components/LoadingSpinner';
import { AnimatedNumber } from '../../templates/components/dataviz/AnimatedNumber';
import { StatBlock } from '../../templates/components/StatBlock';
import { LowerThird } from '../../templates/components/LowerThird';

// Test compositions for visual regression
export const TitleCardTest = () => (
  <TitleCard 
    title="Test Title"
    subtitle="Test Subtitle"
    backgroundColor="#1e40af"
  />
);

export const FadeInTest = () => (
  <FadeIn durationInFrames={30}>
    <div style={{
      width: 400,
      height: 200,
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 24,
    }}>
      Fade In Content
    </div>
  </FadeIn>
);

export const BarChartTest = () => (
  <BarChart
    data={[
      { label: 'Q1', value: 45 },
      { label: 'Q2', value: 72 },
      { label: 'Q3', value: 63 },
      { label: 'Q4', value: 89 },
    ]}
    animationType="grow"
  />
);

export const LineChartTest = () => (
  <LineChart
    data={[
      { x: 0, y: 10, label: 'Jan' },
      { x: 1, y: 25, label: 'Feb' },
      { x: 2, y: 15, label: 'Mar' },
      { x: 3, y: 30, label: 'Apr' },
    ]}
    showGrid
    showDots
  />
);

export const LoadingSpinnerTest = () => (
  <div style={{ 
    display: 'flex', 
    gap: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6'
  }}>
    <LoadingSpinner variant="circle" />
    <LoadingSpinner variant="dots" />
    <LoadingSpinner variant="bars" />
    <LoadingSpinner variant="pulse" />
  </div>
);

export const AnimatedNumberTest = () => (
  <div style={{
    display: 'flex',
    gap: 40,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  }}>
    <AnimatedNumber value={1234} format="number" duration={60} />
    <AnimatedNumber value={1234.56} format="currency" currency="USD" decimals={2} duration={60} />
    <AnimatedNumber value={85} format="percent" decimals={1} duration={60} />
    <AnimatedNumber value={1500000} format="compact" decimals={1} duration={60} />
  </div>
);

export const ScaleInTest = () => (
  <ScaleIn durationInFrames={30} easing="ease-out-back">
    <div style={{
      width: 300,
      height: 150,
      backgroundColor: '#10b981',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 20,
      borderRadius: 8,
    }}>
      Scale In Content
    </div>
  </ScaleIn>
);

export const StatBlockTest = () => (
  <div style={{
    display: 'flex',
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f9fafb',
  }}>
    <StatBlock value="1,234" label="Users" />
    <StatBlock value="89.5%" label="Success Rate" delta={+5.2} />
    <StatBlock value="$45,678" label="Revenue" delta={-2.1} />
  </div>
);

export const LowerThirdTest = () => (
  <LowerThird 
    primary="John Smith"
    secondary="Senior Product Manager"
    align="left"
  />
);

// Register all test compositions
export const RemotionRoot = () => {
  return (
    <>
      {/* Landscape (1920x1080) Tests */}
      <Composition
        id="title-card-test"
        component={TitleCardTest}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="fade-in-test"
        component={FadeInTest}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="bar-chart-test"
        component={BarChartTest}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="line-chart-test"
        component={LineChartTest}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="loading-spinner-test"
        component={LoadingSpinnerTest}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="animated-number-test"
        component={AnimatedNumberTest}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="scale-in-test"
        component={ScaleInTest}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="stat-block-test"
        component={StatBlockTest}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="lower-third-test"
        component={LowerThirdTest}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Portrait (1080x1920) Tests */}
      <Composition
        id="title-card-test-portrait"
        component={TitleCardTest}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="animated-number-test-portrait"
        component={AnimatedNumberTest}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="stat-block-test-portrait"
        component={StatBlockTest}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="lower-third-test-portrait"
        component={LowerThirdTest}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};