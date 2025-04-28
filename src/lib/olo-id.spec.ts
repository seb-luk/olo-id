import { ID_PROP_UNDEFINED, OloUri } from '../types/index.ts';
import { OloId, isOloId, isOloIdList } from './olo-id.ts';

describe('OloId', () => {
  it('should create an OloId from a string', () => {
    const id = new OloId('value1/value2', { syntax: ['type1', 'type2'] });
    expect(id.toString()).toBe('value1/value2');
    expect(id.toSyntaxString()).toBe('type1/type2');
    expect(id.toJSON()).toEqual({ type1: 'value1', type2: 'value2' });
  });

  it('should create an OloId from an OloUri', () => {
    const uri: OloUri<['type1', 'type2']> = { type1: 'value1', type2: 'value2' };
    const id = new OloId(uri);
    expect(id.toString()).toBe('value1/value2');
    expect(id.toSyntaxString()).toBe('type1/type2');
    expect(id.toJSON()).toEqual(uri);
  });

  it('should create an OloId with a custom separator', () => {
    const id = new OloId('value1-value2', { syntax: ['type1', 'type2'], separator: '-' });
    expect(id.toString()).toBe('value1-value2');
    expect(id.toSyntaxString()).toBe('type1-type2');
    expect(id.toJSON()).toEqual({ type1: 'value1', type2: 'value2' });
  });

  it('should handle undefined values', () => {
    const id = new OloId('value1', { syntax: ['type1'] });
    expect(id.toString()).toBe('value1');
    expect(id.toSyntaxString()).toBe('type1');
    expect(id.toJSON()).toEqual({ type1: 'value1' });
  });

  it('should handle undefined values in OloUri', () => {
    const uri: OloUri<['type1', 'type2']> = { type1: 'value1', type2: undefined as unknown as string };
    const id = new OloId(uri);
    expect(id.toString()).toBe(`value1/${ID_PROP_UNDEFINED}`);
    expect(id.toSyntaxString()).toBe('type1/type2');
    expect(id.toJSON()).toEqual({ type1: 'value1', type2: ID_PROP_UNDEFINED });
  });

  it('should check if two OloIds are the same', () => {
    const id1 = new OloId('value1/value2', { syntax: ['type1', 'type2'] });
    const id2 = new OloId('value1/value2', { syntax: ['type1', 'type2'] });
    const id3 = new OloId('value2/value2', { syntax: ['type1', 'type2'] });
    const id4 = new OloId('value2/value1', { syntax: ['type1', 'type2']});

    expect(id1.isSame(id2)).toBe(true);
    expect(id1.isSame(id3)).toBe(false);
    expect(id1.isSame('value1/value2', { syntax: ['type1', 'type2'] })).toBe(true);
    expect(id1.isSame('value2/value2', { syntax: ['type1', 'type2'] })).toBe(false);
    expect(id1.isSame(id4)).toBe(false);
    expect(id1.isSame('value2/value1', { syntax: ['type2', 'type1'] })).toBe(true);
    expect(id1.isSame('value1/undefined', { syntax: ['type1', 'type2'] })).toBe(false);
    expect(id1.isSame('undefined/value2', { syntax: ['type1', 'type2'] })).toBe(false);
  });

  it('should check if an object is an OloId', () => {
    const id = new OloId('value1/value2', { syntax: ['type1', 'type2'] });
    expect(isOloId(id)).toBe(true);
    expect(isOloId({})).toBe(false);
    expect(isOloId(null)).toBe(false);
    expect(isOloId(undefined)).toBe(false);
  });

  it('should check if an object is an OloId list', () => {
    const id1 = new OloId('value1/value2', { syntax: ['type1', 'type2'] });
    const id2 = new OloId('value2/value2', { syntax: ['type1', 'type2'] });
    expect(isOloIdList([id1, id2])).toBe(true);
    expect(isOloIdList([id1, {}])).toBe(false);
    expect(isOloIdList([])).toBe(true);
  });

  it('should handle toPrimitive', () => {
    const id = new OloId('value1/value2', { syntax: ['type1', 'type2'] });
    expect(`${id}`).toBe('value1/value2');
  });

  it('should handle different separator in toString', () => {
    const id = new OloId('value1/value2', { syntax: ['type1', 'type2'] });
    expect(id.toString('-')).toBe('value1-value2');
  });

  it('should handle different separator in toSyntaxString', () => {
    const id = new OloId('value1/value2', { syntax: ['type1', 'type2'] });
    expect(id.toSyntaxString('-')).toBe('type1-type2');
  });

  it('should handle empty string', () => {
    const id = new OloId('', { syntax: ['type1'] });
    expect(id.toString()).toBe(ID_PROP_UNDEFINED);
    expect(id.toSyntaxString()).toBe('type1');
    expect(id.toJSON()).toEqual({ type1: ID_PROP_UNDEFINED });
  });
});





