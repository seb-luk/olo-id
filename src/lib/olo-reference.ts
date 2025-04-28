import { GetListTypeGuard } from 'olo-platform';
import { OloIdSchema, ReferenceType, isReferenceType } from '../types/index.ts';
import { OloDescriptor, OloDescriptorParameter, isOloDescriptor } from './olo-descriptor.ts';
import { OloIdMap } from './olo-id-set.ts';

export interface OloReferenceParameter<
  IdentifierProperties extends string[][] = string[][],
  IdentifierValue extends string | number = string | number
> extends OloDescriptorParameter<IdentifierProperties, IdentifierValue> {
  type?: ReferenceType;
  label?: string;
}

/**
 * Represents a reference to a remote entity, extending the {@link OloDescriptor} class.
 *
 * An `OloReference` builds upon the `OloDescriptor` by adding information about the
 * nature and context of the reference itself:
 * - `type`: Indicates the location or relationship of the referenced entity (e.g., self, external, internal).
 * - `label`: Provides a human-readable label or description for the reference.
 *
 * References are fundamental for linking entities within the OLO platform.
 *
 * @template IdentifierProperties - A 2D array representing the collection of possible syntaxes (each inner array is a `string[]`). Defaults to `string[][]`.
 * @template IdentifierValue - The type of the values associated with the identifier properties. Defaults to `string | number`.
 *
 * @extends {OloDescriptor<IdentifierProperties, IdentifierValue>}
 */
export class OloReference<
  IdentifierProperties extends string[][] = string[][],
  IdentifierValue extends string | number = string | number
> extends OloDescriptor<IdentifierProperties, IdentifierValue> {
  /**
   * The {@link ReferenceType} describes the location or relationship of the referenced entity
   * relative to the current context (e.g., is it the entity itself, an external resource, etc.).
   *
   * @default ReferenceType.self
   */
  public type: ReferenceType = ReferenceType.self;

  /**
   * A potentially user-facing string that provides a descriptive label for the referenced entity
   * in the context of this reference.
   *
   * @default ''
   */
  public label: string = '';

  /**
   * Creates an instance of OloReference.
   *
   * Initializes the reference by first calling the `OloDescriptor` constructor with the `uri`,
   * `format`, and `parts` information. It then sets the reference-specific `type` and `label`
   * properties based on the provided `reference` object or defaults.
   *
   * @constructor
   * @param reference - The source data for the reference. Can be:
   *   - An object containing `uri` (as `OloUri`), and optional `format`, `parts`, `type`, and `label`.
   *   - Another `OloReference` instance (copy constructor pattern).
   *
   * @example
   * // Create a self-reference with a label
   * const ref1 = new OloReference({
   *   uri: { type: 'page', id: 'home' },
   *   label: 'Homepage Link'
   * });
   *
   * // Create an external reference
   * const ref2 = new OloReference({
   *   uri: { url: 'https://example.com' }, // Assuming 'url' syntax exists
   *   type: ReferenceType.external,
   *   label: 'External Website'
   * });
   *
   * // Copy from another reference
   * const ref3 = new OloReference(ref1);
   */
  constructor (reference: OloReferenceParameter<IdentifierProperties, IdentifierValue> | OloReference) {
    super({
      uri: isOloReference(reference)
        ? reference['uri'] as unknown as OloIdMap<IdentifierProperties, IdentifierValue>
        : reference.uri,
      format: reference.format,
      parts: reference.parts,
    });

    this.type = reference.type ?? this.type;
    this.label = reference.label ?? this.label;
  }

  /**
   * @override
   * Overrides the `toJSON` method of `OloDescriptor` to include reference-specific properties (`type`, `label`)
   * alongside the descriptor properties.
   *
   * This provides a complete JSON representation of the reference, suitable for serialization.
   *
   * @returns An object containing the consolidated `uri` (as `OloUri`), `format`, `parts`, `type`, and `label`.
   *
   * @example
   * const ref = new OloReference({
   *   uri: { type: 'page', id: 'contact' },
   *   format: Format.document,
   *   type: ReferenceType.internal,
   *   label: 'Contact Us'
   * });
   * const json = ref.toJSON();
   * console.log(json);
   * // Output: { uri: { type: 'page', id: 'contact' }, format: 'document', parts: true, type: 'internal', label: 'Contact Us' }
   *
   * console.log(JSON.stringify(ref));
   * // Output: '{"uri":{"type":"page","id":"contact"},"format":"document","parts":true,"type":"internal","label":"Contact Us"}'
   */
  override toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      label: this.label,
    } as OloIdSchema<OloReferenceParameter<IdentifierProperties, IdentifierValue>, IdentifierProperties, IdentifierValue>;
  }
}

/**
 * Typeguard for OloReference.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloReference
 */
export const isOloReference = (obj: unknown): obj is OloReference =>
  obj != null
  && isOloDescriptor(obj)
  && isReferenceType((obj as OloReference).type)
  && typeof (obj as OloReference).label === 'string';

/**
 * Typeguard for OloReference Array.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloReference Array
 */
export const isOloReferenceList = GetListTypeGuard(isOloReference)
