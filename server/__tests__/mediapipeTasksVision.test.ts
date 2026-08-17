import { describe, expect, it } from 'vitest';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

describe('MediaPipe Tasks Vision runtime contract', () => {
  it('exposes the supported vision fileset resolver', () => {
    expect(typeof FilesetResolver.forVisionTasks).toBe('function');
  });

  it('exposes the HandLandmarker factory and video detector', () => {
    expect(typeof HandLandmarker.createFromOptions).toBe('function');
    expect(typeof HandLandmarker.prototype.detectForVideo).toBe('function');
    expect(typeof HandLandmarker.prototype.close).toBe('function');
  });
});
