import { FocusMap, FocusMapKey } from './focus-map.ts';

import { MediaImageRatio } from '../../config/index.ts';

describe('FocusMap', () => {
  it('should initialize with default values', () => {
    const focusMap = new FocusMap();
    expect(focusMap.DEFAULT).toEqual([0.5, 0.5]);
    expect(focusMap[MediaImageRatio.oneXone]).toBeUndefined();
    expect(focusMap[MediaImageRatio.twoXone]).toBeUndefined();
    expect(focusMap[MediaImageRatio.fourXseven]).toBeUndefined();
    expect(focusMap[MediaImageRatio.sixteenXnine]).toBeUndefined();
  });

  it('should initialize with custom default values', () => {
    const focusMap = new FocusMap([0.2, 0.8]);
    expect(focusMap.DEFAULT).toEqual([0.2, 0.8]);
    expect(focusMap[MediaImageRatio.oneXone]).toBeUndefined();
    expect(focusMap[MediaImageRatio.twoXone]).toBeUndefined();
    expect(focusMap[MediaImageRatio.fourXseven]).toBeUndefined();
    expect(focusMap[MediaImageRatio.sixteenXnine]).toBeUndefined();
  });

  it('should initialize with custom ratio values', () => {
    const focusMap = new FocusMap({
      DEFAULT: [0.1, 0.9],
      [MediaImageRatio.oneXone]: [0.2, 0.8],
      [MediaImageRatio.twoXone]: [0.3, 0.7],
      [MediaImageRatio.fourXseven]: [0.4, 0.6],
      [MediaImageRatio.sixteenXnine]: [0.5, 0.5],
    });
    expect(focusMap.DEFAULT).toEqual([0.1, 0.9]);
    expect(focusMap[MediaImageRatio.oneXone]).toEqual([0.2, 0.8]);
    expect(focusMap[MediaImageRatio.twoXone]).toEqual([0.3, 0.7]);
    expect(focusMap[MediaImageRatio.fourXseven]).toEqual([0.4, 0.6]);
    expect(focusMap[MediaImageRatio.sixteenXnine]).toEqual([0.5, 0.5]);
  });

  it('should get the correct focus point for a given ratio', () => {
    const focusMap = new FocusMap({
      DEFAULT: [0.1, 0.9],
      [MediaImageRatio.oneXone]: [0.2, 0.8],
      [MediaImageRatio.twoXone]: [0.3, 0.7],
      [MediaImageRatio.fourXseven]: [0.4, 0.6],
      [MediaImageRatio.sixteenXnine]: [0.5, 0.5],
    });
    expect(focusMap.get(MediaImageRatio.oneXone)).toEqual([0.2, 0.8]);
    expect(focusMap.get(MediaImageRatio.twoXone)).toEqual([0.3, 0.7]);
    expect(focusMap.get(MediaImageRatio.fourXseven)).toEqual([0.4, 0.6]);
    expect(focusMap.get(MediaImageRatio.sixteenXnine)).toEqual([0.5, 0.5]);
    expect(focusMap.get('DEFAULT')).toEqual([0.1, 0.9]);
  });

  it('should return the default focus point if the ratio is not defined', () => {
    const focusMap = new FocusMap({ DEFAULT: [0.1, 0.9] });
    expect(focusMap.get(MediaImageRatio.oneXone)).toEqual([0.1, 0.9]);
    expect(focusMap.get('unknown' as FocusMapKey)).toEqual([0.1, 0.9]);
  });

  it('should return the original focus point if the ratio is original', () => {
    const focusMap = new FocusMap({ DEFAULT: [0.1, 0.9] });
    expect(focusMap.get('original')).toEqual([0.5, 0.5]);
    expect(focusMap.get()).toEqual([0.1, 0.9]);
  });

  it('should return the correct string representation for a given ratio', () => {
    const focusMap = new FocusMap({
      DEFAULT: [0.1, 0.9],
      [MediaImageRatio.oneXone]: [0.2, 0.8],
      [MediaImageRatio.twoXone]: [0.3, 0.7],
      [MediaImageRatio.fourXseven]: [0.4, 0.6],
      [MediaImageRatio.sixteenXnine]: [0.5, 0.5],
    });
    expect(focusMap.toString(MediaImageRatio.oneXone)).toBe('0d2x0d8');
    expect(focusMap.toString(MediaImageRatio.twoXone)).toBe('0d3x0d7');
    expect(focusMap.toString(MediaImageRatio.fourXseven)).toBe('0d4x0d6');
    expect(focusMap.toString(MediaImageRatio.sixteenXnine)).toBe('0d5x0d5');
    expect(focusMap.toString()).toBe('0d1x0d9');
  });

  it('should return the correct string representation for original ratio', () => {
    const focusMap = new FocusMap({ DEFAULT: [0.1, 0.9] });
    expect(focusMap.toString('original')).toBe('0d5x0d5');
  });

  it('should return the default string representation if the ratio is not defined', () => {
    const focusMap = new FocusMap({ DEFAULT: [0.1, 0.9] });
    expect(focusMap.toString(MediaImageRatio.oneXone)).toBe('0d1x0d9');
    expect(focusMap.toString('unknown' as FocusMapKey)).toBe('0d1x0d9');
  });
});
