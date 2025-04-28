import { GetListTypeGuard } from 'olo-platform';
import { Format, OloIdSchema, OloUri, Selector, isFormat } from '../types/index.ts';

import { isOloIdSet, OloIdMap, OloIdSet } from './olo-id-set.ts';

export interface OloDescriptorParameter<
  IdentifierProperties extends string[][] = string[][],
  IdentifierValue extends string | number = string | number,
  Parts extends string = string,
  PartsSetting extends boolean | string | number = boolean
> {
  uri: OloUri<[...IdentifierProperties[number]], IdentifierValue> | OloIdMap<IdentifierProperties, IdentifierValue>;
  format?: Format;
  parts?: Selector<Parts, PartsSetting>;
}



/**
 * Represents a descriptor for an file-like entity, extending the functionality of {@link OloIdSet}.
 *
 * An `OloDescriptor` combines the multi-syntax identification capabilities of `OloIdSet`
 * with additional metadata describing how the identified entity should be interpreted or processed:
 * - `format`: Specifies the digital representation format (e.g., term, document, media).
 * - `parts`: A selector indicating which parts or aspects of the entity are relevant.
 *
 * Descriptors are used to provide context when referencing or requesting entities.
 *
 * @template IdentifierProperties - A 2D array representing the collection of possible syntaxes (each inner array is a `string[]`). Defaults to `string[][]`.
 * @template IdentifierValue - The type of the values associated with the identifier properties. Defaults to `string | number`.
 * @template Parts - An optional string literal or abstract types representing the valid names
 *   of the parts that can be selected. If provided, it constrains the keys allowed in the
 *   object form of the selector. Defaults to `string`, allowing any string key.
 * @template PartsSetting - The type of the values defining the presence of a part. Defaults to `boolean`.
 *
 * @extends {OloIdSet<IdentifierProperties, IdentifierValue>}
 */
export class OloDescriptor<
  IdentifierProperties extends string[][] = string[][],
  IdentifierValue extends string | number = string | number,
  Parts extends string = string,
  PartsSetting extends boolean | string | number = boolean
> extends OloIdSet<IdentifierProperties, IdentifierValue, '/'> {
  /**
   * The {@link Format} of an entity describes how the entity is best represented or processed
   * in a digital context (e.g., as a simple term, a structured document, or media).
   *
   * @default Format.term
   */
  public format: Format = Format.term;

  /**
   * A {@link Selector} indicating which parts or aspects of the described entity are relevant
   * or should be included/excluded during processing.
   * - `object`: Specify inclusion/exclusion rules for specific parts. Empty objects are meant to include all parts.
   *
   * @default {}
   */
  public parts: Selector<Parts, PartsSetting> = {};

  /**
   * Creates an instance of OloDescriptor.
   *
   * Initializes the descriptor by first calling the `OloIdSet` constructor with the `uri`
   * (which can be an `OloUri`, `OloIdMap`, or derived from another `OloDescriptor`).
   * It then sets the `format` and `parts` properties based on the provided descriptor object
   * or defaults.
   *
   * @constructor
   *
   * @param descriptor - The source data for the descriptor. Can be:
   *   - An object containing `uri` (as `OloUri` or `OloIdMap`), and optional `format` and `parts`.
   *   - Another `OloDescriptor` instance (copy constructor pattern).
   *
   * @example
   * // From OloUri with format
   * const desc1 = new OloDescriptor({
   *   uri: { type: 'document', id: 'doc123' },
   *   format: Format.document
   * });
   *
   * // From another OloDescriptor
   * const desc2 = new OloDescriptor(desc1);
   *
   * // With specific parts selector
   * const desc3 = new OloDescriptor({
   *   uri: { component: 'header' },
   *   parts: { children: true }
   * });
   */
  constructor (descriptor:
    OloDescriptorParameter<IdentifierProperties, IdentifierValue, Parts, PartsSetting>
    | OloDescriptor<IdentifierProperties, IdentifierValue, Parts, PartsSetting>) {
    super(isOloDescriptor(descriptor)
      ? descriptor['uri'] as unknown as OloIdMap<IdentifierProperties, IdentifierValue>
      : (descriptor as OloDescriptorParameter<IdentifierProperties, IdentifierValue>).uri,
    );

    this.format = descriptor.format ?? this.format;
    this.parts = descriptor.parts ?? this.parts;
  }

  /**
   * @override
   * Overrides the `toJSON` method of `OloIdSet` to include descriptor-specific properties (`format`, `parts`)
   * alongside the consolidated `uri`.
   *
   * This provides a complete JSON representation of the descriptor, suitable for serialization.
   *
   * @param uri - Optional. An external `OloIdMap` to use instead of the internal `this.uri`.
   *   Passed to the `super.toJSON` call.
   *
   * @returns An object containing the consolidated `uri` (as `OloUri`), `format`, and `parts`.
   *   Note: The return type is cast to `OloUri` for convenience, though it's technically a descriptor object.
   *
   * @example
   * const desc = new OloDescriptor({
   *   uri: { type: 'document', id: 'doc123' },
   *   format: Format.document,
   *   parts: false
   * });
   * const json = desc.toJSON();
   * console.log(json);
   * // Output: { uri: { type: 'document', id: 'doc123' }, format: 'document', parts: false }
   *
   * console.log(JSON.stringify(desc));
   * // Output: '{"uri":{"type":"document","id":"doc123"},"format":"document","parts":false}'
   */
  override toJSON(
    uri?: OloIdMap<IdentifierProperties, IdentifierValue, '/'>
  ): OloIdSchema<OloDescriptorParameter<IdentifierProperties, IdentifierValue, Parts, PartsSetting>, IdentifierProperties, IdentifierValue> {
    return {
      uri: super.toJSON(uri) as OloUri<[...IdentifierProperties[number]], IdentifierValue>,
      format: this.format,
      parts: this.parts,
    };
  }
}

/**
 * Typeguard for OloDescriptor.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloDescriptor
 */
export const isOloDescriptor = <
  IdentifierProperties extends string[][] = string[][],
  IdentifierValue extends string | number = string | number,
  Parts extends string = string,
  PartsSetting extends boolean | string | number = boolean
>(obj: unknown): obj is OloDescriptor<IdentifierProperties, IdentifierValue, Parts, PartsSetting> =>
  obj != null
  && isOloIdSet(obj)
  && isFormat((obj as OloDescriptor).format)
  && (typeof (obj as OloDescriptor).parts === 'boolean' || typeof (obj as OloDescriptor).parts === 'object');

/**
 * Typeguard for OloDescriptor Array.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloDescriptor Array
 */
export const isOloDescriptorList = GetListTypeGuard(isOloDescriptor);

