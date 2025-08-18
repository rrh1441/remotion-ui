import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { processAddCommand } from '../commands/add';
import { processInitCommand } from '../commands/init';
import { processAddAssetsCommand } from '../commands/add-assets';

vi.mock('fs');
vi.mock('../utils/files');
vi.mock('../utils/logger');

describe('CLI Commands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('init command', () => {
    it('should initialize project with default settings', async () => {
      const mockFs = vi.mocked(fs);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined as any);
      mockFs.writeFileSync.mockImplementation(() => {});

      await processInitCommand({
        path: 'src/remotion/ui',
        tailwind: false
      });

      expect(mockFs.mkdirSync).toHaveBeenCalled();
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });

    it('should skip existing files', async () => {
      const mockFs = vi.mocked(fs);
      mockFs.existsSync.mockReturnValue(true);

      await processInitCommand({
        path: 'src/remotion/ui',
        tailwind: false
      });

      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should update tailwind config when tailwind option is true', async () => {
      const mockFs = vi.mocked(fs);
      mockFs.existsSync.mockImplementation((filePath) => {
        if (typeof filePath === 'string' && filePath.includes('tailwind.config')) {
          return true;
        }
        return false;
      });
      mockFs.readFileSync.mockReturnValue('module.exports = { theme: { extend: {} } }');
      mockFs.writeFileSync.mockImplementation(() => {});

      await processInitCommand({
        path: 'src/remotion/ui',
        tailwind: true
      });

      expect(mockFs.readFileSync).toHaveBeenCalled();
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('add command', () => {
    it('should add specified components', async () => {
      const mockFs = vi.mocked(fs);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined as any);
      mockFs.copyFileSync.mockImplementation(() => {});
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        components: {
          'title-card': {
            path: 'components/TitleCard.tsx',
            dependencies: []
          }
        }
      }));

      await processAddCommand({
        components: ['title-card'],
        path: 'src/remotion/ui',
        yes: true
      });

      expect(mockFs.copyFileSync).toHaveBeenCalled();
    });

    it('should install component dependencies', async () => {
      const mockFs = vi.mocked(fs);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        components: {
          'stat-block': {
            path: 'components/StatBlock.tsx',
            dependencies: ['stack', 'fade-in']
          },
          'stack': {
            path: 'core/primitives/Stack.tsx',
            dependencies: []
          },
          'fade-in': {
            path: 'core/primitives/FadeIn.tsx',
            dependencies: []
          }
        }
      }));
      mockFs.copyFileSync.mockImplementation(() => {});

      await processAddCommand({
        components: ['stat-block'],
        path: 'src/remotion/ui',
        yes: true
      });

      expect(mockFs.copyFileSync).toHaveBeenCalledTimes(3);
    });
  });

  describe('add-assets command', () => {
    it('should add specified asset packs', async () => {
      const mockFs = vi.mocked(fs);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined as any);
      mockFs.copyFileSync.mockImplementation(() => {});
      mockFs.readdirSync.mockReturnValue(['icon1.svg', 'icon2.svg'] as any);
      mockFs.statSync.mockReturnValue({ isDirectory: () => false, isFile: () => true } as any);

      await processAddAssetsCommand({
        packs: ['icons@v1'],
        path: 'public/assets'
      });

      expect(mockFs.mkdirSync).toHaveBeenCalled();
      expect(mockFs.copyFileSync).toHaveBeenCalled();
    });

    it('should handle all asset pack alias', async () => {
      const mockFs = vi.mocked(fs);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined as any);
      mockFs.copyFileSync.mockImplementation(() => {});
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true, isFile: () => false } as any);

      await processAddAssetsCommand({
        packs: ['all'],
        path: 'public/assets'
      });

      expect(mockFs.mkdirSync).toHaveBeenCalled();
    });
  });
});