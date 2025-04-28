/**
 * Represents the core key-value structure of an OLO identifier (OloId).
 *
 * It's an object where keys are the property names defined by the identifier's syntax
 * (e.g., 'type', 'id', 'slug') and values are the corresponding identifier values.
 * This type serves as the canonical object representation for OloIds and related structures.
 *
 * @template IdentifierProperties - An array of string types defining the property names (keys) of the identifier. Defaults to `string[]`.
 * @template IdentifierValue - The type of the values associated with the identifier properties. Defaults to `string | number`.
 *
 * @example
 * // For an OloId with syntax ['type', 'id']
 * type UserUri = OloUri<['type', 'id']>;
 * const user: UserUri = { type: 'user', id: 123 };
 *
 * // For an OloId with syntax ['category', 'slug'] and string values
 * type ProductUri = OloUri<['category', 'slug'], string>;
 * const product: ProductUri = { category: 'books', slug: 'typescript-basics' };
 */
export type OloUri<
  IdentifierProperties extends string[] = string[],
  IdentifierValue extends string | number = string | number
> = Record<IdentifierProperties[number], IdentifierValue>;

export type OloIdSchema<
  Paramters,
  IdentifierProperties extends string[][] = string[][],
  IdentifierValue extends string | number = string | number,
> = Omit<Required<Paramters>, 'uri'> & { uri: OloUri<[...IdentifierProperties[number]], IdentifierValue> }
