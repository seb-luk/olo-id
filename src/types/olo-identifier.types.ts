import { GetListTypeGuard, MapObject, OloDataClass } from 'olo-platform';

import { OloUri } from './olo-uri.types.ts';

/**
 * Base interface for all OLO identifier classes (like {@link OloId} and {@link OloIdSet}).
 *
 * Defines the essential contract for an OLO identifier, primarily the ability to
 * compare itself for logical equality with other identifier representations and
 * inheriting base data class functionalities (like `toJSON`, `toString`) from `OloDataClass`.
 *
 * @template IdentifierProperties - Represents the structure of the identifier's properties.
 *   Can be a single array of strings (`string[]`) for identifiers with one fixed syntax (like `OloId`),
 *   or a 2D array (`string[][]`) for identifiers representing multiple possible syntaxes (like `OloIdSet`).
 *   Defaults to `string[]`.
 *
 * @extends OloDataClass - Inherits base methods likely including `toJSON` and `toString`.
 */
export interface OloIdentifier<IdentifierProperties extends string[] | string[][] = string[]> extends OloDataClass {
  /**
   * Checks if the current identifier instance represents the same logical identity
   * as the provided `identifier`.
   *
   * Implementations should handle comparison against different input types:
   * - `string`: Typically parsed based on context or options.
   * - `OloUri`: Compared based on key-value pairs.
   * - `OloIdentifier`: Compared based on the internal state of the other identifier.
   *
   * @param identifier - The identifier representation to compare against.
   * @param options - A flexible map object for passing comparison options, such as syntax hints
   *   (e.g., `{ syntax: ['type', 'id'] }`) when `identifier` is a string.
   *
   * @returns `true` if the identifiers represent the same logical entity, `false` otherwise.
   */
  isSame: (
    identifier: string | OloUri<IdentifierProperties extends string[][] ? IdentifierProperties[number] : IdentifierProperties> | OloIdentifier<IdentifierProperties>,
    options: MapObject<string | number | boolean | undefined | string[]>,
  ) => boolean;
}

/**
 * Represents any entity within the OLO platform that possesses a unique OLO identifier.
 *
 * This interface provides a standard way to access the identifier of an object.
 */
export interface IdentifiableEntity {
  /**
   * The unique identifier (e.g., an instance of {@link OloId} or {@link OloIdSet})
   * associated with this entity.
   */
  identification: OloIdentifier;
}

/**
 * Typeguard for IdentifiableEntity.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a IdentifiableEntity
 */
export const isIdentifiableEntity = (obj: any): obj is IdentifiableEntity =>
  obj != null
  && typeof obj === 'object'
  && obj.identification != null;

/**
 * Typeguard for IdentifiableEntity Array.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a IdentifiableEntity Array
 */
export const isIdentifiableEntityList = GetListTypeGuard(isIdentifiableEntity);
