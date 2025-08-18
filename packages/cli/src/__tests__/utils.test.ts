import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ensureDir, copyFile, fileExists, readJsonFile, writeJsonFile } from '../utils/files';

vi.mock('fs');
vi.mock('path');

describe('File Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ensureDir', () => {
    it('should create directory if it does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined as any);

      ensureDir('/test/path');

      expect(fs.existsSync).toHaveBeenCalledWith('/test/path');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/path', { recursive: true });
    });

    it('should not create directory if it already exists', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);

      ensureDir('/test/path');

      expect(fs.existsSync).toHaveBeenCalledWith('/test/path');
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('fileExists', () => {
    it('should return true if file exists', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);

      const result = fileExists('/test/file.txt');

      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledWith('/test/file.txt');
    });

    it('should return false if file does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = fileExists('/test/file.txt');

      expect(result).toBe(false);
    });
  });

  describe('copyFile', () => {
    it('should copy file from source to destination', () => {
      vi.mocked(fs.copyFileSync).mockImplementation(() => {});

      copyFile('/source/file.txt', '/dest/file.txt');

      expect(fs.copyFileSync).toHaveBeenCalledWith('/source/file.txt', '/dest/file.txt');
    });
  });

  describe('readJsonFile', () => {
    it('should read and parse JSON file', () => {
      const mockData = { test: 'data' };
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockData));

      const result = readJsonFile('/test/file.json');

      expect(result).toEqual(mockData);
      expect(fs.readFileSync).toHaveBeenCalledWith('/test/file.json', 'utf-8');
    });

    it('should throw error for invalid JSON', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('invalid json');

      expect(() => readJsonFile('/test/file.json')).toThrow();
    });
  });

  describe('writeJsonFile', () => {
    it('should write JSON data to file', () => {
      const mockData = { test: 'data' };
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});

      writeJsonFile('/test/file.json', mockData);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/test/file.json',
        JSON.stringify(mockData, null, 2)
      );
    });
  });
});