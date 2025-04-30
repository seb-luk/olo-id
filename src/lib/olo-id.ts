import { ConcatString, GetListTypeGuard } from 'olo-platform';
import { ID_PROP_UNDEFINED, IdSeparator, OloIdOptions, OloIdentifier, OloUri } from '../types/index.ts';

import { OloIdSyntax } from './olo-id-syntax.ts';

/**
 * Represents a structured identifier (OloId) within the OLO platform.
 *
 * An OloId encapsulates a set of key-value pairs (`OloUri`) that uniquely identify
 * an entity or concept. It enforces a specific structure (`syntax`) defining the
 * property names and their order.
 *
 * OloIds can be created from:
 * - A string representation (values joined by a separator).
 * - An `OloUri` object (key-value pairs).
 * - Another `OloId` instance (copying its data).
 *
 * It provides methods for comparison, string conversion (both values and syntax),
 * and standard JSON serialization. It interacts with a central `OloIdSyntax`
 * service to manage and potentially register identifier structures globally.
 *
 * @template IdentifierProperties - An array of string types defining the ordered property names of the identifier (e.g., `['type', 'id']`). Defaults to `string[]`.
 * @template IdentifierValue - The type of the values associated with the identifier properties. Defaults to `string | number`.
 * @template Separator - The string literal type used as the default separator for string representations. Defaults to `/` (defined by `IdSeparator`).
 *
 * @implements {OloIdentifier<IdentifierProperties>}
 *
 * @example
 * // Create from string
 * const id1 = new OloId('product/ABC', { syntax: ['category', 'sku'] });
 *
 * // Create from object
 * const id2 = new OloId({ category: 'product', sku: 'ABC' });
 *
 * // Compare
 * console.log(id1.isSame(id2)); // Output: true
 *
 * // Get string representation
 * console.log(id1.toString()); // Output: "product/ABC"
 *
 * // Get JSON representation
 * console.log(JSON.stringify(id1)); // Output: '{"category":"product","sku":"ABC"}'
 */
export class OloId<
  IdentifierProperties extends string[] = string[],
  IdentifierValue extends string | number = string | number,
  Separator extends string = IdSeparator
> implements OloIdentifier<IdentifierProperties> {
  private oloIdSyntax = new OloIdSyntax<Separator>();
  private separator: Separator;

  private syntax: IdentifierProperties;

  private uri: Record<IdentifierProperties[number], IdentifierValue> = {} as Record<IdentifierProperties[number], IdentifierValue>;

  /**
   * Creates an instance of OloId.
   *
   * The constructor can initialize an OloId from various sources:
   * - An `OloUri` object (key-value pairs).
   * - Another `OloId` instance (copy constructor pattern).
   * - A string representation, which will be parsed based on the provided or determined syntax and separator.
   *
   * It determines the identifier's structure (syntax) and separator, and populates the internal `uri` representation.
   *
   * @constructor
   *
   * @param uri - The source data for the identifier. Can be an object mapping property names to values,
   *   another OloId instance, or a string containing values separated by the specified or default separator.
   * @param options - Optional configuration for the OloId instance.
   * @param options.syntax - Defines the structure (property names and order) of the identifier.
   *   - If `uri` is a string, this is crucial for parsing. It can be a separator-joined string (e.g., "type/id") or an array (e.g., ['type', 'id']).
   *   - If `uri` is an object or OloId, `syntax` can be provided to enforce a specific known syntax.
   *   - If omitted, the constructor attempts to infer or find a matching registered syntax based on the `uri` object's keys or falls back to defaults.
   * @param options.register - If `true`, and a syntax is derived from the input `uri` object or string that isn't already registered globally,
   *   it will be registered for potential reuse. Defaults to `false`.
   * @param options.separator - The character(s) used to separate values if `uri` is a string, and the default separator for `toString()`/`toSyntaxString()`.
   *   Defaults to the globally configured separator (usually '/').
   *
   * @example
   * // From string with explicit syntax
   * const idFromString = new OloId('user/123', { syntax: ['type', 'id'] });
   * console.log(idFromString.toJSON()); // Output: { type: 'user', id: '123' }
   *
   * // From OloUri object (syntax inferred from keys)
   * const idFromObject = new OloId({ type: 'product', code: 'XYZ' });
   * console.log(idFromObject.toString()); // Output: "product/XYZ" (assuming default separator '/')
   * console.log(idFromObject.toSyntaxString()); // Output: "type/code"
   *
   * // From another OloId (copy)
   * const idCopy = new OloId(idFromObject);
   * console.log(idCopy.isSame(idFromObject)); // Output: true
   *
   * // With custom separator
   * const idCustomSep = new OloId('admin-A5', { syntax: ['role', 'level'], separator: '-' });
   * console.log(idCustomSep.toJSON()); // Output: { role: 'admin', level: 'A5' }
   * console.log(idCustomSep.toString()); // Output: "admin-A5"
   *
   * // Handling missing values (maps to ID_PROP_UNDEFINED)
   * const idMissing = new OloId('config/', { syntax: ['section', 'key'] });
   * console.log(idMissing.toJSON()); // Output: { section: 'config', key: 'UNDEFINED' }
   * const idMissingObj = new OloId({ section: 'config' }, { syntax: ['section', 'key'] });
   * console.log(idMissingObj.toJSON()); // Output: { section: 'config', key: 'UNDEFINED' }
   */
  constructor (
    uri: OloUri<IdentifierProperties, IdentifierValue>
      | OloId<IdentifierProperties, IdentifierValue, Separator>
      | string,
    {
      syntax,
      register = false,
      separator,
    }: OloIdOptions<IdentifierProperties, Separator> = {}
  ) {
    this.separator = separator ?? this.oloIdSyntax.getSeparator();

    const workingUri = (isOloId(uri) ? uri.toJSON() : typeof uri === 'string' ? undefined : uri) as OloUri<IdentifierProperties, IdentifierValue> | undefined;

    this.syntax = this.oloIdSyntax.getSyntaxes(
      syntax ?? workingUri,
      { register },
    )[0] as IdentifierProperties;

    this.syntax.forEach((identifierProperty: IdentifierProperties[number], index) => {
      if (workingUri) {
        this.uri[identifierProperty] = workingUri[identifierProperty] || ID_PROP_UNDEFINED as IdentifierValue;
      } else {
        const uriList = (uri as string).split(this.separator) as IdentifierValue[];
        this.uri[identifierProperty] = uriList[index] || ID_PROP_UNDEFINED as IdentifierValue;
      }
    });
  }

  /**
   * Checks if the current OloId instance represents the same logical identifier
   * as the provided identifier.
   * This method allows comparison against different representations of an identifier:
   * a string, an OloUri object, or another OloIdentifier instance (like OloId).
   *
   * @param identifier - The identifier to compare against the current instance.
   *   - If a `string`, it's parsed based on the provided or instance's `syntax` and `separator`.
   *   - If an `OloUri`, it's compared directly based on key-value pairs.
   *   - If an `OloIdentifier`, its internal `uri` representation is used for comparison.
   * @param options - Optional configuration for the comparison.
   * @param options.syntax - Specifies the order and names of properties if `identifier` is a string.
   *   Can be a separator-joined string (e.g., "type1/type2") or an array of strings (e.g., ["type1", "type2"]).
   *   Defaults to the syntax of the current OloId instance (`this.syntax`) if `identifier` is a string and this option is omitted.
   *
   * @returns `true` if the provided `identifier` represents the same logical ID as the current instance, `false` otherwise.
   *
   * @example
   * const id1 = new OloId('valA/valB', { syntax: ['prop1', 'prop2'] });
   * const id2 = new OloId({ prop1: 'valA', prop2: 'valB' });
   * const id3 = new OloId('valA/valC', { syntax: ['prop1', 'prop2'] });
   *
   * console.log(id1.isSame(id2)); // Output: true
   * console.log(id1.isSame('valA/valB', { syntax: ['prop1', 'prop2'] })); // Output: true
   * console.log(id1.isSame({ prop1: 'valA', prop2: 'valB' })); // Output: true
   * console.log(id1.isSame(id3)); // Output: false
   * console.log(id1.isSame('valA/valC')); // Output: false (using id1's syntax by default)
   */
  public isSame(
    identifier: string | OloUri<IdentifierProperties> | OloIdentifier<IdentifierProperties>,
    { syntax }: { syntax?: ConcatString<IdentifierProperties, Separator> | string[] } = {}
  ): boolean {
    let compId: OloUri<IdentifierProperties>;
    if (isOloId(identifier)) {
      compId = identifier['uri'] as OloUri<IdentifierProperties>;
    } else {
    const idParamIsString = typeof identifier === 'string';

    const syntaxList = (Array.isArray(syntax) ? syntax : syntax?.split(this.separator)) ?? this.syntax;

    compId = idParamIsString
      ? syntaxList.reduce((acc, key: IdentifierProperties[number], index) => {
          acc[key] = syntaxList.length === 1 ? identifier : identifier.split(this.separator)[index] ?? '';
          return acc;
        }, {} as OloUri<IdentifierProperties>)
      : identifier as OloUri<IdentifierProperties>;
    }

    return (Object.keys(this.uri) as IdentifierProperties)
      .reduce((result: boolean, key: IdentifierProperties[number]) => {
        if (!result) {
          return result;
        }

        return compId[key] === this.uri[key];
      },
      true
    );
  }

  /**
   * Returns a string representation of the identifier's syntax (the property names)
   * joined by a specified separator.
   *
   * @param separator - The separator string to use between syntax property names.
   *   Defaults to the separator defined for this OloId instance (`this.separator`).
   *
   * @returns A string representing the joined syntax property names,
   *   typed as a concatenated string based on the identifier properties and separator.
   *
   * @example
   * const id = new OloId('valA/valB', { syntax: ['prop1', 'prop2'], separator: '/' });
   *
   * console.log(id.toSyntaxString());    // Output: "prop1/prop2"
   * console.log(id.toSyntaxString('-')); // Output: "prop1-prop2"
   */
  public toSyntaxString(separator: string = this.separator) {
    return this.syntax.join(separator) as ConcatString<IdentifierProperties, Separator>;
  }


  /**
   * Returns a string representation of the OloId by joining its values
   * in the order defined by its syntax, using a specified separator.
   * This is the primary string representation of the identifier's value part.
   *
   * @param separator - The separator string to use between the identifier's values.
   *   Defaults to the separator defined for this OloId instance (`this.separator`).
   *
   * @returns A string representing the joined values of the OloId.
   *
   * @example
   * const id = new OloId('valA/valB', { syntax: ['prop1', 'prop2'], separator: '/' });
   *
   * console.log(id.toString());    // Output: "valA/valB"
   * console.log(id.toString('-')); // Output: "valA-valB"
   *
   * const idWithUndefined = new OloId({ prop1: 'valA', prop2: undefined }, { syntax: ['prop1', 'prop2'] });
   * console.log(idWithUndefined.toString()); // Output: "valA/undefined" (assuming default separator '/')
   */
  public toString(separator: string = this.separator) {
    return this.syntax.map((key: IdentifierProperties[number]) => this.uri[key]).join(separator);
  }

  [Symbol.toPrimitive]() { return this.toString(); }

  /**
   * Returns the OloId's internal representation as an OloUri object (key-value pairs).
   * This method is automatically invoked when the OloId instance is serialized
   * using `JSON.stringify()`, ensuring a clean JSON representation of the identifier.
   *
   * @returns An `OloUri` object containing the identifier's property names as keys
   *   and their corresponding values.
   *
   * @example
   * const id = new OloId({ type: 'user', id: 123 }, { syntax: ['type', 'id'] });
   * const jsonRepresentation = id.toJSON();
   * console.log(jsonRepresentation); // Output: { type: 'user', id: 123 }
   *
   * const jsonString = JSON.stringify(id);
   * console.log(jsonString); // Output: '{"type":"user","id":123}'
   */
  public toJSON(): OloUri<IdentifierProperties, IdentifierValue> {
    return this.uri;
  };
}

/**
 * Typeguard for OloId.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloId
 */
export const isOloId = <IdentifierProperties extends string[] = string[], IdentifierValue extends string | number = string | number, Separator extends string = IdSeparator>(obj: unknown): obj is OloId<IdentifierProperties, IdentifierValue, Separator> =>
  obj != null
  && typeof obj === 'object'
  && typeof (obj as OloId)['uri'] === 'object'
  && Array.isArray((obj as OloId)['syntax'])
  && typeof (obj as OloId)['separator'] === 'string';

/**
 * Typeguard for OloId Array.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloId list
 */
export const isOloIdList = GetListTypeGuard(isOloId)
