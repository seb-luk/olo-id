import { ConcatString, GetListTypeGuard } from 'olo-platform';
import { IdSeparator, OloIdOptions, OloIdentifier, OloUri } from '../types/index.ts';
import { OloId, isOloId } from './olo-id.ts';

import { OloIdSyntax } from './olo-id-syntax.ts';

/**
 * Defines a map where keys are string representations of OloId syntaxes
 * (property names joined by a separator) and values are the corresponding
 * `OloId` instances.
 *
 * This type is primarily used internally by `OloIdSet` to store the different
 * `OloId` interpretations derived from a common data source based on various
 * applicable syntaxes.
 *
 * @template IdentifierProperties - A 2D array representing the collection of possible syntaxes (each inner array is a `string[]`). Defaults to `string[][]`.
 * @template IdentifierValue - The type of the values associated with the identifier properties. Defaults to `string | number`.
 * @template Separator - The string literal type used as the separator when creating the key strings from syntaxes. Defaults to `/` (defined by `IdSeparator`).
 *
 * @example
 * // Assuming Separator is '/'
 * type ExampleMap = OloIdMap<[['type', 'id'], ['category', 'code']]>;
 * // ExampleMap would represent an object like:
 * // {
 * //   'type/id': OloId<['type', 'id']>,
 * //   'category/code': OloId<['category', 'code']>
 * // }
 */
export type OloIdMap<
  IdentifierProperties extends string[][] = string[][],
  IdentifierValue extends string | number = string | number,
  Separator extends string = IdSeparator
> = {
  [key in ConcatString<IdentifierProperties[number], Separator>]: OloId<IdentifierProperties[number], IdentifierValue, Separator>
}

/**
 * OloIdSet is a set of related {@link OloId} instances, often derived from a single OloUri
 * that can be interpreted through multiple registered syntaxes.
 *
 * An OloIdSet holds multiple `OloId` objects internally, each corresponding to a
 * specific syntax applicable to the underlying data. This allows comparing an input
 * identifier against all possible interpretations represented by the set.
 *
 * It can be constructed from:
 * - A single `OloUri` object (generating OloIds for all matching syntaxes).
 * - A string (generating a single OloId based on provided or inferred syntax).
 * - Another `OloIdSet` (copying its structure).
 * - An `OloIdMap` (a pre-defined map of syntax strings to OloId instances).
 *
 * @template IdentifierProperties - A 2D array representing the collection of possible syntaxes (each inner array is a `string[]` like in `OloId`). Defaults to `string[][]`.
 * @template IdentifierValue - The type of the values associated with the identifier properties. Defaults to `string | number`.
 * @template Separator - The string literal type used as the default separator. Defaults to `/` (defined by `IdSeparator`).
 *
 * @implements {OloIdentifier<IdentifierProperties>} - Note: Implements OloIdentifier, but the template `IdentifierProperties` is `string[][]` here, representing multiple syntaxes, unlike the `string[]` expected by the base `OloIdentifier`.
 */
export class OloIdSet<
  IdentifierProperties extends string[][] = string[][],
  IdentifierValue extends string | number = string | number,
  Separator extends string = IdSeparator
> implements OloIdentifier<IdentifierProperties> {
  /**
   * Instance of OloIdSyntax used for managing and retrieving syntaxes.
   *
   * @private
   */
  private oloIdSyntax = new OloIdSyntax<Separator>();

  /**
   * Internal storage mapping syntax strings (e.g., "type/id") to their corresponding OloId instances.
   *
   * @private
   */
  private uri: OloIdMap<IdentifierProperties, IdentifierValue, Separator>;

  /**
   * Creates an instance of OloIdSet.
   *
   * Initializes the set based on the provided input `uri`. The behavior varies depending on the input type:
   * - **string:** Creates a set containing a single `OloId` based on the provided or inferred syntax.
   * - **OloIdMap:** Creates a set by adopting the provided map of syntax strings to `OloId` instances.
   * - **OloUri | OloIdSet:** Determines all applicable syntaxes for the data (from the `OloUri` or the source `OloIdSet`),
   *   then creates an `OloId` instance for each applicable syntax and stores them internally.
   *
   * @constructor
   * @param uri - The source data for the identifier set. Can be a single `OloUri` object, another `OloIdSet`,
   *   a map of syntax strings to `OloId` instances (`OloIdMap`), or a single identifier string.
   * @param options - Optional configuration for OloId creation within the set.
   * @param options.register - If `true`, any newly derived or inferred syntaxes will be registered globally. Defaults to `false`.
   * @param options.syntax - Can be used to hint or enforce specific syntaxes, especially when `uri` is a string or OloUri.
   * @param options.separator - The separator to use for parsing string `uri` or for default string representations.
   *
   * @example
   * // From OloUri (finds matching syntaxes 'type/id' and 'category/code' if registered)
   * const setFromUri = new OloIdSet({ type: 'user', id: '123', category: 'admin', code: 'A1' });
   *
   * // From string (creates a single OloId in the set)
   * const setFromString = new OloIdSet('user/123', { syntax: ['type', 'id'] });
   *
   * // From another OloIdSet (copy)
   * const setCopy = new OloIdSet(setFromUri);
   *
   * // From OloIdMap
   * const id1 = new OloId('user/123', { syntax: ['type', 'id'] });
   * const idMap = { 'type/id': id1 };
   * const setFromMap = new OloIdSet(idMap);
   */
  constructor(
    uri: OloUri<[...IdentifierProperties[number]], IdentifierValue>
      | OloIdSet<IdentifierProperties, IdentifierValue, Separator>
      | OloIdMap<IdentifierProperties, IdentifierValue, Separator>
      | string,
    { register = false, syntax, separator }: OloIdOptions<[...IdentifierProperties[number]], Separator> = {}
  ) {
    if (typeof uri === 'string') {
      const id = new OloId<[...IdentifierProperties[number]], IdentifierValue, Separator>(uri, { register, separator, syntax });
      this.uri = { [id.toSyntaxString()]: id } as OloIdMap<IdentifierProperties, IdentifierValue, Separator>;

    } else if (Object.values(uri).every(isOloId)) {
      this.uri = {} as OloIdMap<IdentifierProperties, IdentifierValue, Separator>;

      Object.keys(uri).map(uriKey => this.oloIdSyntax.getSyntaxes(uriKey, { register})[0]).forEach(
        (syntaxItem) => {
          const syntaxKey = (syntaxItem ?? []).join(separator ?? this.oloIdSyntax.getSeparator()) as ConcatString<IdentifierProperties[number], Separator>;
          this.uri[syntaxKey] = new OloId<[...IdentifierProperties[number]], IdentifierValue, Separator>(
            (uri as OloIdMap<IdentifierProperties, IdentifierValue, Separator>)[syntaxKey],
            { register, separator, syntax },
          );
        }
      );

    } else {
      this.uri = {} as OloIdMap<IdentifierProperties, IdentifierValue, Separator>;
      const workingUri = (isOloIdSet(uri)
        ? this.toJSON(uri.uri as OloIdMap<IdentifierProperties, IdentifierValue, Separator>)
        : uri
      ) as OloUri<[...IdentifierProperties[number]], IdentifierValue>;

      this.oloIdSyntax.getSyntaxes(workingUri, { register }).forEach(
        (syntaxItem) => {
          const id = new OloId<[...IdentifierProperties[number]], IdentifierValue, Separator>(
            workingUri,
            { syntax: syntaxItem, separator },
          );
          this.uri[id.toSyntaxString()] = id;
        }
      );
    }
  }

  /**
   * Checks if the provided identifier matches *any* of the OloId instances within this set.
   *
   * It normalizes the input `identifier` (especially if it's another `OloIdSet`) and then
   * iterates through the internal `OloId`s, returning `true` as soon as one of them reports
   * a match via its own `isSame` method.
   *
   * @param identifier - The identifier to compare against the set. Can be a string, OloUri,
   *   OloIdentifier (like OloId), or another OloIdSet.
   * @param options - Optional configuration, primarily `syntax` hint for parsing string identifiers.
   * @param options.syntax - Specifies the syntax if `identifier` is a string.
   *
   * @returns `true` if the `identifier` matches at least one `OloId` in the set, `false` otherwise.
   *
   * @example
   * const set = new OloIdSet({ type: 'user', id: '123', role: 'admin' }); // Assumes 'type/id' and 'role' syntaxes exist
   *
   * console.log(set.isSame('user/123')); // true (if 'type/id' matches)
   * console.log(set.isSame({ role: 'admin' })); // true (if 'role' matches)
   * console.log(set.isSame('guest')); // false
   */
  isSame(identifier: string | OloUri | OloIdentifier | OloIdSet, options: { syntax?: ConcatString<IdentifierProperties[number], Separator> | string[] } = {}): boolean {
    let id = identifier;
    if(isOloIdSet(identifier)) {
      id = this.toJSON(identifier['uri'] as unknown as OloIdMap<IdentifierProperties, IdentifierValue, Separator>) as OloUri<[...IdentifierProperties[number]], IdentifierValue>;
    }

    return (Object.values(this.uri) as OloId<IdentifierProperties[number], IdentifierValue, Separator>[]).reduce((result, uri) => result || uri.isSame(id, options), false);
  }

  /**
   * Returns a string representation of the OloIdSet by joining the string representations
   * of all contained OloId instances with a space.
   *
   * The order of the joined strings depends on the internal iteration order of the `uri` map.
   *
   * @returns A space-separated string of all OloId string values in the set.
   *
   * @example
   * const set = new OloIdSet({ type: 'user', id: '123', role: 'admin' }); // Assumes 'type/id' and 'role' syntaxes
   * console.log(set.toString()); // Output might be "user/123 admin" or "admin user/123"
   */
  toString() {
    return (Object.values(this.uri) as OloId<IdentifierProperties[number], IdentifierValue, Separator>[])
      .map((id) => id.toString()).join(' ');
  }

  /**
   * Defines the default primitive value conversion for the OloIdSet, delegating to `toString()`.
   * Used when the object is coerced to a primitive type (e.g., in string concatenation).
   *
   * @returns The string representation of the OloIdSet.
   */
  [Symbol.toPrimitive]() { return this.toString(); }

  /**
   * Returns a consolidated OloUri object representing the combined data from all OloId instances
   * within the set (or from an optionally provided OloIdMap).
   *
   * This merges the key-value pairs from each internal `OloId`'s `uri` property. If multiple
   * OloIds define the same property key, the value from the last one processed during the merge
   * will overwrite previous ones.
   *
   * This method is also implicitly used by `JSON.stringify()` on an `OloIdSet` instance if not overridden.
   *
   * @param uri - Optional. An external `OloIdMap` to convert into a consolidated `OloUri`.
   *   If omitted, the internal `this.uri` map of the `OloIdSet` instance is used.
   *
   * @returns A single `OloUri` object containing the merged properties and values.
   *
   * @example
   * const set = new OloIdSet({ type: 'user', id: '123', role: 'admin' }); // Assumes 'type/id' and 'role' syntaxes
   * const json = set.toJSON();
   * console.log(json); // Output: { type: 'user', id: '123', role: 'admin' }
   *
   * console.log(JSON.stringify(set)); // Output: '{"type":"user","id":"123","role":"admin"}'
   */
  toJSON(
    uri?: OloIdMap<IdentifierProperties, IdentifierValue, Separator>
  ): OloUri<[...IdentifierProperties[number]], IdentifierValue> | { uri: OloUri<[...IdentifierProperties[number]], IdentifierValue> } {
    return (Object.values(uri ??  this.uri) as OloId<IdentifierProperties[number], IdentifierValue, Separator>[]).reduce(
      (json, id: OloId<IdentifierProperties[number], IdentifierValue, Separator>) =>
          Object.assign(json, id['uri']), {} as OloUri<[...IdentifierProperties[number]], IdentifierValue>
    );
  }
}

/**
 * Typeguard for OloIdSet.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloId
 */
export const isOloIdSet = (obj: unknown): obj is OloIdSet =>
  obj != null
  && typeof(obj as OloIdSet)['uri'] === 'object'
  && Object.values((obj as OloIdSet)['uri']).every(isOloId);

/**
 * Typeguard for OloIdSet Array.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloIdSet OloId
 */
export const isOloIdSetList = GetListTypeGuard(isOloIdSet)
