import React from 'react';
import { Composition } from 'remotion';
import { TitleCard } from '../../templates/components/TitleCard';
import { BarChart } from '../../templates/components/BarChart';
import { LineChart } from '../../templates/components/LineChart';
import { FadeIn } from '../../templates/core/primitives/FadeIn';
import { SlideIn } from '../../templates/core/primitives/SlideIn';
import { LoadingSpinner } from '../../templates/components/LoadingSpinner';

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

// Register all test compositions
export const RemotionRoot = () => {
  return (
    <>
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
    </>
  );
};