import { IdentifiableEntity, OloIdentifier, isIdentifiableEntity, isIdentifiableEntityList } from './olo-identifier.types.ts';

import { MapObject } from 'olo-platform';
import { OloUri } from './olo-uri.types.ts';

// Mock OloIdentifier for testing purposes
class MockOloIdentifier implements OloIdentifier {
  constructor(private id: string) {}
  isSame(
    identifier: string | OloUri<string[]> | OloIdentifier<string[]>,
    options: MapObject<string | number | boolean | undefined | string[]> = {},
  ): boolean {
    if (typeof identifier === 'string') {
      return this.id === identifier;
    } else if (identifier instanceof MockOloIdentifier) {
      return this.id === identifier.id;
    } else if (typeof identifier === 'object' && identifier !== null) {
      // Basic check for OloUri, assuming it has a toString method for simplicity
      return this.id === Object.values(identifier).join('/');
    }
    return false;
  }
  toJSON() {
    return { id: this.id };
  }
  toString() {
    return this.id;
  }
}

describe('OloIdentifier Types', () => {
  describe('isIdentifiableEntity', () => {
    it('should return true for an object with an identification property of type OloIdentifier', () => {
      const identifiableEntity: IdentifiableEntity = {
        identification: new MockOloIdentifier('test-id'),
      };
      expect(isIdentifiableEntity(identifiableEntity)).toBe(true);
    });

    it('should return false for an object without an identification property', () => {
      const nonIdentifiableEntity = {};
      expect(isIdentifiableEntity(nonIdentifiableEntity)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isIdentifiableEntity(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isIdentifiableEntity(undefined)).toBe(false);
    });

    it('should return false for a string', () => {
      expect(isIdentifiableEntity('test')).toBe(false);
    });

    it('should return false for a number', () => {
      expect(isIdentifiableEntity(123)).toBe(false);
    });
  });

  describe('isIdentifiableEntityList', () => {
    it('should return true for an array of IdentifiableEntity objects', () => {
      const identifiableEntityList: IdentifiableEntity[] = [
        { identification: new MockOloIdentifier('id1') },
        { identification: new MockOloIdentifier('id2') },
      ];
      expect(isIdentifiableEntityList(identifiableEntityList)).toBe(true);
    });

    it('should return false for an array containing a non-IdentifiableEntity object', () => {
      const mixedList = [
        { identification: new MockOloIdentifier('id1') },
        {},
      ];
      expect(isIdentifiableEntityList(mixedList)).toBe(false);
    });

    it('should return true for an empty array', () => {
      expect(isIdentifiableEntityList([])).toBe(true);
    });

    it('should return false for null', () => {
      expect(isIdentifiableEntityList(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isIdentifiableEntityList(undefined)).toBe(false);
    });

    it('should return false for a single IdentifiableEntity object', () => {
      const identifiableEntity: IdentifiableEntity = {
        identification: new MockOloIdentifier('test-id'),
      };
      expect(isIdentifiableEntityList(identifiableEntity)).toBe(false);
    });
    it('should return false for a string', () => {
      expect(isIdentifiableEntityList('test')).toBe(false);
    });

    it('should return false for a number', () => {
      expect(isIdentifiableEntityList(123)).toBe(false);
    });
  });
});
