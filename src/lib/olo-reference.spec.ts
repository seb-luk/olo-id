import { Format, ReferenceType } from '../types/index.ts';

import { OloReference } from './olo-reference.ts';

describe('OloReference', () => {
  it('should create an OloReference', () => {
    const reference = new OloReference({ uri: { type1: 'value1', type2: 'value2' }, format: Format.document, type: ReferenceType.external, label: 'Test Label', parts: { part1: true, part2: false } });
    expect(reference.toString()).toBe('value1/value2');
    expect(reference.format).toBe(Format.document);
    expect(reference.type).toBe(ReferenceType.external);
    expect(reference.label).toBe('Test Label');
    expect(reference.toJSON()).toEqual({ uri: { type1: 'value1', type2: 'value2' }, format: Format.document, type: ReferenceType.external, label: 'Test Label', parts: { part1: true, part2: false } });
  });

  it('should create an OloReference with default values', () => {
    const reference = new OloReference({ uri: { type1: 'value1', type2: 'value2' } });
    expect(reference.toString()).toBe('value1/value2');
    expect(reference.format).toBe(Format.term);
    expect(reference.type).toBe(ReferenceType.self);
    expect(reference.label).toBe('');
    expect(reference.toJSON()).toEqual({ uri: { type1: 'value1', type2: 'value2' }, format: Format.term, parts: {}, type: ReferenceType.self, label: '' });
  });

  it('should create an OloReference from another OloReference', () => {
    const reference1 = new OloReference({
      uri: { type1: 'value1', type2: 'value2' },
      format: Format.document,
      type: ReferenceType.external,
      label: 'Test Label',
      parts: { part1: true, part2: false }
    });
    const reference2 = new OloReference(reference1);

    expect(reference2.toString()).toBe('value1/value2');
    expect(reference2.format).toBe(Format.document);
    expect(reference2.type).toBe(ReferenceType.external);
    expect(reference2.label).toBe('Test Label');
    expect(reference2.toJSON()).toEqual({
      uri: { type1: 'value1', type2: 'value2' },
      format: Format.document,
      type: ReferenceType.external,
      label: 'Test Label',
      parts: { part1: true, part2: false }
    });
  });
});
