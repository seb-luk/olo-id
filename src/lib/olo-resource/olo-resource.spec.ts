import { Format, OloUri, ReferenceType } from '../../types/index.ts';
import { OloResource, isOloResource, isOloResourceList } from './olo-resource.ts';

import { FocusMap, } from './focus-map.js';

describe('OloResource', () => {
  const testUri: OloUri<['type1', 'type2']> = { type1: 'value1', type2: 'value2' };

  it('should create an OloResource with minimal data', () => {
    const resource = new OloResource({ uri: testUri });
    expect(resource.toString()).toBe('value1/value2');
    expect(resource.format).toBe(Format.term);
    expect(resource.parts).toStrictEqual({});
    expect(resource.type).toBe(ReferenceType.self);
    expect(resource.label).toBe('');
    expect(resource.filetype).toBeUndefined();
    expect(resource.ratio).toBeUndefined();
    expect(resource.focus).toBeUndefined();
    expect(resource.size).toBeUndefined();
    expect(resource.width).toBeUndefined();
    expect(resource.height).toBeUndefined();
    expect(resource.framerate).toBeUndefined();
    expect(resource.duration).toBeUndefined();
    expect(resource.kompression).toBeUndefined();
    expect(resource.cropable).toBe(true);
  });

  it('should create an OloResource with all data', () => {
    const focusMap = new FocusMap({ DEFAULT: [0.2, 0.8] });
    const resource = new OloResource({
      uri: testUri,
      format: Format.document,
      parts: {},
      type: ReferenceType.external,
      label: 'Test Resource',
      filetype: 'image/png',
      ratio: [16, 9],
      focus: focusMap,
      size: 1024,
      width: 1920,
      height: 1080,
      framerate: 30,
      duration: 60,
      kompression: 'lossless',
      cropable: true,
    });
    expect(resource.toString()).toBe('value1/value2');
    expect(resource.format).toBe(Format.document);
    expect(resource.parts).toStrictEqual({});
    expect(resource.type).toBe(ReferenceType.external);
    expect(resource.label).toBe('Test Resource');
    expect(resource.filetype).toBe('image/png');
    expect(resource.ratio).toEqual([16, 9]);
    expect(resource.focus).toBeInstanceOf(FocusMap);
    expect(resource.focus?.DEFAULT).toEqual([0.2, 0.8]);
    expect(resource.size).toBe(1024);
    expect(resource.width).toBe(1920);
    expect(resource.height).toBe(1080);
    expect(resource.framerate).toBe(30);
    expect(resource.duration).toBe(60);
    expect(resource.kompression).toBe('lossless');
    expect(resource.cropable).toBe(true);
  });

  it('should create an OloResource from another OloResource', () => {
    const resource1 = new OloResource({
      uri: testUri,
      format: Format.document,
      parts: {},
      type: ReferenceType.external,
      label: 'Test Resource',
      filetype: 'image/png',
      ratio: [16, 9],
      focus: [0.2, 0.8],
      size: 1024,
      width: 1920,
      height: 1080,
      framerate: 30,
      duration: 60,
      kompression: 'lossless',
      cropable: true,
    });
    const resource2 = new OloResource(resource1);
    expect(resource2.toString()).toBe('value1/value2');
    expect(resource2.format).toBe(Format.document);
    expect(resource2.parts).toStrictEqual({});
    expect(resource2.type).toBe(ReferenceType.external);
    expect(resource2.label).toBe('Test Resource');
    expect(resource2.filetype).toBe('image/png');
    expect(resource2.ratio).toEqual([16, 9]);
    expect(resource2.focus).toBeInstanceOf(FocusMap);
    expect(resource2.focus?.DEFAULT).toEqual([0.2, 0.8]);
    expect(resource2.size).toBe(1024);
    expect(resource2.width).toBe(1920);
    expect(resource2.height).toBe(1080);
    expect(resource2.framerate).toBe(30);
    expect(resource2.duration).toBe(60);
    expect(resource2.kompression).toBe('lossless');
    expect(resource2.cropable).toBe(true);
  });

  it('should create an OloResource with focus as array', () => {
    const resource = new OloResource({
      uri: testUri,
      focus: [0.2, 0.8],
    });
    expect(resource.focus).toBeInstanceOf(FocusMap);
    expect(resource.focus?.DEFAULT).toEqual([0.2, 0.8]);
  });

  it('should check if an object is an OloResource', () => {
    const resource = new OloResource({ uri: testUri });
    expect(isOloResource(resource)).toBe(true);
    expect(isOloResource({})).toBe(false);
    expect(isOloResource(null)).toBe(false);
    expect(isOloResource(undefined)).toBe(false);
    expect(isOloResource({ uri: testUri })).toBe(false);
    expect(isOloResource({ ...resource, filetype: 123 })).toBe(false);
    expect(isOloResource({ ...resource, ratio: [1, 2, 3] })).toBe(false);
    expect(isOloResource({ ...resource, focus: 'invalid' })).toBe(false);
    expect(isOloResource({ ...resource, size: 'invalid' })).toBe(false);
    expect(isOloResource({ ...resource, width: 'invalid' })).toBe(false);
    expect(isOloResource({ ...resource, height: 'invalid' })).toBe(false);
    expect(isOloResource({ ...resource, framerate: 'invalid' })).toBe(false);
    expect(isOloResource({ ...resource, duration: 'invalid' })).toBe(false);
    expect(isOloResource({ ...resource, kompression: 123 })).toBe(false);
    expect(isOloResource({ ...resource, cropable: 123 })).toBe(false);
  });

  it('should check if an object is an OloResource list', () => {
    const resource1 = new OloResource({ uri: testUri });
    const resource2 = new OloResource({ uri: { type1: 'value3', type2: 'value4' } });
    expect(isOloResourceList([resource1, resource2])).toBe(true);
    expect(isOloResourceList([resource1, {}])).toBe(false);
    expect(isOloResourceList([])).toBe(true);
  });

  it('should handle toJSON', () => {
    const focusMap = new FocusMap({ DEFAULT: [0.2, 0.8] });
    const resource = new OloResource({
      uri: testUri,
      format: Format.document,
      parts: {},
      type: ReferenceType.external,
      label: 'Test Resource',
      filetype: 'image/png',
      ratio: [16, 9],
      focus: focusMap,
      size: 1024,
      width: 1920,
      height: 1080,
      framerate: 30,
      duration: 60,
      kompression: 'lossless',
      cropable: true,
    });
    expect(resource.toJSON()).toEqual({
      uri: testUri,
      format: Format.document,
      parts: {},
      type: ReferenceType.external,
      label: 'Test Resource',
      filetype: 'image/png',
      ratio: [16, 9],
      focus: focusMap,
      size: 1024,
      width: 1920,
      height: 1080,
      framerate: 30,
      duration: 60,
      kompression: 'lossless',
      cropable: true,
    });
  });
});
