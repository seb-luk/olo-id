import { ConcatString } from 'olo-platform';
import { IdSeparator } from './olo-id.constants.ts';

/**
 * Defines optional configuration parameters for creating instances of {@link OloId}
 * and related classes like {@link OloIdSet}.
 *
 * This interface allows specifying the identifier's structure (syntax), whether
 * a new syntax should be registered globally, and the separator character to use.
 *
 * @template IdentifierProperties - An array of string types defining the ordered property names of the identifier (e.g., `['type', 'id']`). Defaults to `string[]`.
 * @template Separator - The string literal type used as the separator character(s). Defaults to `/` (defined by `IdSeparator`).
 */
export interface OloIdOptions<IdentifierProperties extends string[] = string[], Separator extends string = IdSeparator> {
  /**
   * Defines the structure (property names and their order) of the identifier.
   * This is crucial when creating an `OloId` from a string, as it dictates how the string is parsed.
   * It can also be used to enforce a specific known syntax when creating from an object.
   *
   * Can be provided as:
   * - A single string with property names joined by the `Separator` (e.g., `"type/id"`).
   * - An array of strings representing the ordered property names (e.g., `['type', 'id']`).
   *
   * If omitted when creating from an object, the system may attempt to infer the syntax from the object keys.
   * If omitted when creating from a string, it might rely on a default or previously established syntax, potentially leading to errors.
   *
   * @optional
   */
  syntax?: ConcatString<IdentifierProperties, Separator> | IdentifierProperties;

  /**
   * If `true`, and the determined or provided `syntax` is not already registered globally
   * via {@link OloIdSyntax}, it will be added to the global registry.
   *
   * @default false
   *
   * @optional
   */
  register?: boolean;

  /**
   * Specifies the separator character or string used for:
   * 1. Parsing the input `uri` if it's provided as a string.
   * 2. Setting the default separator for the `toString()` and `toSyntaxString()` methods of the created `OloId` instance.
   *
   * If omitted, it defaults to the globally configured separator managed by {@link OloIdSyntax} (usually '/').
   *
   * @optional
   */
  separator?: Separator;
}
