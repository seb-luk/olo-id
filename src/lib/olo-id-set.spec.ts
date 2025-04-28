import { OloIdSet, isOloIdSet, isOloIdSetList } from './olo-id-set.ts';

import { OloUri } from '../types/index.ts';

describe('OloIdSet', () => {
  it('should create an OloIdSet from a string', () => {
    const idSet = new OloIdSet('value1/value2', { syntax: ['type1', 'type2'] });
    expect(idSet.toString()).toBe('value1/value2');
    expect(idSet.toJSON()).toEqual({ type1: 'value1', type2: 'value2' });
  });

  it('should create an OloIdSet from an OloUri', () => {
    const uri: OloUri<['type1', 'type2']> = { type1: 'value1', type2: 'value2' };
    const idSet = new OloIdSet(uri);
    expect(idSet.toString()).toBe('value1/value2');
    expect(idSet.toJSON()).toEqual(uri);
  });

  it('should create an OloIdSet from an OloIdSet', () => {
    const idSet1 = new OloIdSet<[['type1', 'type2']]>('value1/value2', { syntax: 'type1/type2' });
    const idSet2 = new OloIdSet(idSet1);
    expect(idSet2.toString()).toBe('value1/value2');
    expect(idSet2.toJSON()).toEqual({ type1: 'value1', type2: 'value2' });
  });

  it('should check if two OloIdSets are the same', () => {
    const idSet1 = new OloIdSet('value1/value2', { syntax: ['type1', 'type2'] });
    const idSet2 = new OloIdSet('value1/value2', { syntax: ['type1', 'type2'] });
    const idSet3 = new OloIdSet('value2/value2', { syntax: ['type1', 'type2'] });
    const idSet4 = new OloIdSet('value2/value1', { syntax: ['type1', 'type2'] });

    expect(idSet1.isSame(idSet2)).toBe(true);
    expect(idSet1.isSame(idSet3)).toBe(false);
    expect(idSet1.isSame('value1/value2', { syntax: ['type1', 'type2'] })).toBe(true);
    expect(idSet1.isSame('value2/value2', { syntax: ['type1', 'type2'] })).toBe(false);
    expect(idSet1.isSame(idSet4)).toBe(false);
    expect(idSet1.isSame('value2/value1', { syntax: ['type2', 'type1'] })).toBe(true);
    expect(idSet1.isSame('value1/undefined', { syntax: ['type1', 'type2'] })).toBe(false);
    expect(idSet1.isSame('undefined/value2', { syntax: ['type1', 'type2'] })).toBe(false);
  });

  it('should check if an object is an OloIdSet', () => {
    const idSet = new OloIdSet('value1/value2', { syntax: ['type1', 'type2'] });
    expect(isOloIdSet(idSet)).toBe(true);
    expect(isOloIdSet({})).toBe(false);
    expect(isOloIdSet(null)).toBe(false);
    expect(isOloIdSet(undefined)).toBe(false);
  });

  it('should check if an object is an OloIdSet list', () => {
    const idSet1 = new OloIdSet('value1/value2', { syntax: ['type1', 'type2'] });
    const idSet2 = new OloIdSet('value2/value2', { syntax: ['type1', 'type2'] });
    expect(isOloIdSetList([idSet1, idSet2])).toBe(true);
    expect(isOloIdSetList([idSet1, {}])).toBe(false);
    expect(isOloIdSetList([])).toBe(true);
  });

  it('should handle toPrimitive', () => {
    const idSet = new OloIdSet('value1/value2', { syntax: ['type1', 'type2'] });

    expect(`${idSet}`).toBe('value1/value2');
  });

  it('should handle multiple OloIds in the set', () => {
    const idSet = new OloIdSet({ type1: 'value1', type2: 'value2', type3: 'value3' }, { register: true });
    expect(idSet.toString()).toBe('value1/value2/value3');
    expect(idSet.toJSON()).toEqual({ type1: 'value1', type2: 'value2', type3: 'value3' });
  });
});
