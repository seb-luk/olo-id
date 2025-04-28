/**
 * The reference type describes where the referenced entity is located.
 */
export enum ReferenceType {
  /**
   * The reference points to the same entity the reference is located in.
   */
  self = 'SELF',

  /**
   * The reference points to an entiy that is a grade in the current set-entity.
   */
  grade = 'GRADE',

  /**
   * The reference points to an aspect of the current entity.
   */
  aspect = 'ASPECT',

  /**
   * The reference points to an entity that is "higher up" in the structer of the entity object.
   */
  parent = 'PARENT',

  /**
   * The reference points to an entity that includes this entity.
   */
  client = 'CLIENT',

  /**
   * The reference points to an entity that is not part of the current entity but somehow related to it.
   */
  remote = 'REMOTE',

  /**
   * The reference points to an entity managed by a third party.
   */
  external = 'EXTERNAL',
}

/**
 * Typeguard for ReferenceType.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a ReferenceType
 */
export const isReferenceType = (obj: unknown): obj is ReferenceType =>
  obj != null && typeof obj === 'string' && Object.values(ReferenceType).includes(obj as ReferenceType);
