'use client';

import { useState } from 'react';
import { RemotionPlayer } from './RemotionPlayer';
import { ComponentType } from 'react';

interface PropControl {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color';
  defaultValue: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

interface ComponentDemoProps {
  component: ComponentType<any>;
  durationInFrames: number;
  fps?: number;
  width?: number;
  height?: number;
  controls?: PropControl[];
  defaultProps?: Record<string, any>;
}

export function ComponentDemo({
  component,
  durationInFrames,
  fps = 30,
  width = 1920,
  height = 1080,
  controls = [],
  defaultProps = {},
}: ComponentDemoProps) {
  const [props, setProps] = useState(() => {
    const initial: Record<string, any> = { ...defaultProps };
    controls.forEach((control) => {
      initial[control.name] = control.defaultValue;
    });
    return initial;
  });

  const updateProp = (name: string, value: any) => {
    setProps((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <RemotionPlayer
        component={component}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        props={props}
        showControls
        loop
      />

      {controls.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Props</h3>
          <div className="space-y-4">
            {controls.map((control) => (
              <div key={control.name} className="flex items-center gap-4">
                <label className="min-w-[120px] text-sm font-medium">
                  {control.name}
                </label>
                {control.type === 'text' && (
                  <input
                    type="text"
                    value={props[control.name]}
                    onChange={(e) => updateProp(control.name, e.target.value)}
                    className="flex-1 px-3 py-1.5 border rounded-md"
                  />
                )}
                {control.type === 'number' && (
                  <input
                    type="number"
                    value={props[control.name]}
                    onChange={(e) => updateProp(control.name, Number(e.target.value))}
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    className="flex-1 px-3 py-1.5 border rounded-md"
                  />
                )}
                {control.type === 'boolean' && (
                  <input
                    type="checkbox"
                    checked={props[control.name]}
                    onChange={(e) => updateProp(control.name, e.target.checked)}
                    className="w-5 h-5"
                  />
                )}
                {control.type === 'select' && (
                  <select
                    value={props[control.name]}
                    onChange={(e) => updateProp(control.name, e.target.value)}
                    className="flex-1 px-3 py-1.5 border rounded-md"
                  >
                    {control.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {control.type === 'color' && (
                  <input
                    type="color"
                    value={props[control.name]}
                    onChange={(e) => updateProp(control.name, e.target.value)}
                    className="h-10 w-20"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}