import { OloDescriptor, OloDescriptorParameter, isOloDescriptor, isOloDescriptorList } from './olo-descriptor.ts';

import { Format } from '../types/index.ts';

const descriptorParam: OloDescriptorParameter = { uri: { type1: 'value1', type2: 'value2' }, format: Format.document, parts: { part1: true, part2: false } };
describe('OloDescriptor', () => {
  it('should create an OloDescriptor', () => {
    const descriptor = new OloDescriptor(descriptorParam);
    expect(descriptor.toString()).toBe('value1/value2');
    expect(descriptor.format).toBe(Format.document);
    expect(descriptor.parts).toStrictEqual({ part1: true, part2: false });
    expect(descriptor.toJSON()).toEqual(descriptorParam);
  });

  it('should create an OloDescriptor with default values', () => {
    const descriptor = new OloDescriptor({ uri: { type1: 'value1', type2: 'value2' } });
    expect(descriptor.toString()).toBe('value1/value2');
    expect(descriptor.format).toBe(Format.term);
    expect(descriptor.parts).toStrictEqual({});
    expect(descriptor.toJSON()).toEqual({ uri: { type1: 'value1', type2: 'value2' }, format: Format.term, parts: {} });
  });

  it('should create an OloDescriptor from an object', () => {
    const descriptor1 = new OloDescriptor(descriptorParam);

    expect(descriptor1.toString()).toBe('value1/value2');
    expect(descriptor1.format).toBe(Format.document);
    expect(descriptor1.parts).toStrictEqual({ part1: true, part2: false });
    expect(descriptor1.toJSON()).toEqual(descriptorParam);
  });

  it('should create an OloDescriptor from another OloDescriptor', () => {
    const descriptor1 = new OloDescriptor(descriptorParam);
    const descriptor2 = new OloDescriptor(descriptor1);

    expect(descriptor2.toString()).toBe('value1/value2');
    expect(descriptor2.format).toBe(Format.document);
    expect(descriptor2.parts).toStrictEqual({ part1: true, part2: false });
    expect(descriptor2.toJSON()).toEqual(descriptorParam);
  });

  it('should check if an object is an OloDescriptor', () => {
    const descriptor = new OloDescriptor({ uri: { type1: 'value1', type2: 'value2' } });
    expect(isOloDescriptor(descriptor)).toBe(true);
    expect(isOloDescriptor({})).toBe(false);
    expect(isOloDescriptor(null)).toBe(false);
    expect(isOloDescriptor(undefined)).toBe(false);
    expect(isOloDescriptor({ uri: { type1: 'value1', type2: 'value2' } })).toBe(false);
    expect(isOloDescriptor({ uri: { type1: 'value1', type2: 'value2' }, format: 'invalid' })).toBe(false);
  });

  it('should check if an object is an OloDescriptor list', () => {
    const descriptor1 = new OloDescriptor({ uri: { type1: 'value1', type2: 'value2' } });
    const descriptor2 = new OloDescriptor({ uri: { type1: 'value3', type2: 'value4' } });
    expect(isOloDescriptorList([descriptor1, descriptor2])).toBe(true);
    expect(isOloDescriptorList([descriptor1, {}])).toBe(false);
    expect(isOloDescriptorList([])).toBe(true);
  });
});
