import { ID_TYPE_SEPARATOR, ID_TYPE_UNDEFINED, IdSeparator, OloUri } from '../types/index.ts';

/**
 * Defines optional configuration parameters for the `OloIdSyntax` class constructor.
 *
 * This interface allows customization of the syntax handling, primarily by specifying
 * a custom separator character or string.
 *
 * @template Separator - The string literal type representing the separator character(s). Defaults to `/` (defined by `IdSeparator`).
 */
export interface OloIdSyntaxOptions<Separator extends string = IdSeparator> {
  /**
   * Specifies the separator character or string to be used globally for parsing and joining
   * identifier syntax strings within the `OloIdSyntax` instance and related `OloId` instances.
   *
   * If provided, this separator will be used as the default unless overridden locally.
   * If omitted, it defaults to the value of `ID_TYPE_SEPARATOR` (typically '/').
   *
   * @default ID_TYPE_SEPARATOR ('/')
   */
  seperator?: Separator;
}

/**
 * Manages the registration and retrieval of OloId syntaxes globally.
 *
 * A syntax defines the ordered list of property names for a specific type of `OloId`.
 * This class acts as a central registry, allowing `OloId` instances to look up,
 * validate, and potentially register new syntaxes. It also manages the global
 * default separator used for parsing and joining syntax strings.
 *
 * Syntaxes are stored internally as separator-joined strings in a static `Set`
 * to ensure uniqueness and efficient lookup.
 *
 * @template Separator - The string literal type representing the default separator character(s)
 *   used for joining and splitting syntax strings. Defaults to `/` (defined by `IdSeparator`).
 *
 * @example
 * // Initialize with some default syntaxes
 * const syntaxManager = new OloIdSyntax(['type/id', 'category/code']);
 *
 * // Get the default separator
 * console.log(syntaxManager.getSeparator()); // Output: '/'
 *
 * // Retrieve a known syntax
 * console.log(syntaxManager.getSyntaxes('type/id')); // Output: [['type', 'id']]
 *
 * // Retrieve based on object keys (sorted)
 * console.log(syntaxManager.getSyntaxes({ id: '123', type: 'user' })); // Output: [['type', 'id']]
 *
 * // Retrieve or register a new syntax
 * console.log(syntaxManager.getSyntaxes(['section', 'key'], { register: true })); // Output: [['section', 'key']]
 *
 * // Get all registered syntaxes
 * console.log(syntaxManager.getSyntaxes()); // Output: [['type', 'id'], ['category', 'code'], ['section', 'key']]
 */
export class OloIdSyntax<Separator extends string = IdSeparator> {
  /**
   * Stores the globally configured separator character or string used for joining and splitting
   * syntax property names within the static registry.
   *
   * This value is set once by the first `OloIdSyntax` instance created and shared across all subsequent
   * interactions with the static methods or instances relying on the global syntax registry.
   *
   * @static
   * @private
   */
  private static separator: IdSeparator;

  /**
   * Stores the registered OloId syntaxes globally as separator-joined strings.
   *
   * Using a `Set` ensures that each unique syntax string is stored only once.
   * This registry is shared across all instances of `OloIdSyntax` and `OloId`.
   *
   * @static
   * @private
   */
  private static syntaxes: Set<string> = new Set();

  /**
   * Initializes the OloIdSyntax manager.
   *
   * Sets the global separator if it hasn't been set already by a previous instance,
   * and registers the provided initial syntaxes into the static registry.
   *
   * @constructor
   *
   * @param syntaxes - An array of initial syntaxes to register. Each syntax can be a
   *   separator-joined string (e.g., "type/id") or an array of strings (e.g., ['type', 'id']).
   *   Defaults to `['UNDEFINED']` if no syntaxes are provided.
   * @param options - Configuration options for the syntax manager.
   * @param options.seperator - The separator character or string to be used globally.
   *   This is set only once by the first instance created. Defaults to `ID_TYPE_SEPARATOR` (usually '/').
   *
   * @example
   * // Initialize with default separator and 'undefined' syntax
   * const syntaxManager1 = new OloIdSyntax();
   *
   * // Initialize with custom separator and specific syntaxes
   * const syntaxManager2 = new OloIdSyntax(['type-id', ['category', 'code']], { seperator: '-' });
   * // Note: The separator '-' will only be set globally if this is the first instance.
   */
  constructor (syntaxes: (string | string[])[] = [ID_TYPE_UNDEFINED], { seperator = ID_TYPE_SEPARATOR as Separator }: OloIdSyntaxOptions<Separator> = {}) {
    OloIdSyntax.separator = OloIdSyntax.separator ?? seperator as IdSeparator;

    this.registerSyntaxes(syntaxes);
  }

  /**
   * Gets the globally configured separator character or string.
   *
   * This separator is used by default for joining and splitting syntax strings
   * within the `OloIdSyntax` registry and related `OloId` instances.
   *
   * @returns The separator string, typed according to the `Separator` template parameter
   *   (typically defaulting to `/`).
   *
   * @example
   * const syntaxManager = new OloIdSyntax();
   * console.log(syntaxManager.getSeparator()); // Output: '/'
   *
   * const syntaxManagerCustom = new OloIdSyntax([], { seperator: '-' });
   * // Assuming this was the first instance, it sets the global separator
   * console.log(syntaxManagerCustom.getSeparator()); // Output: '-'
   */
  public getSeparator(): Separator { return OloIdSyntax.separator as Separator; }

  /**
   * Converts the Set of registered syntax strings into an array of string arrays (a matrix).
   *
   * Each inner array represents a single syntax, with its elements being the ordered property names.
   * This provides a more structured representation compared to the internal separator-joined strings.
   *
   *
   * @param set - The Set of syntax strings (joined by the global separator) to convert.
   *   Defaults to the static `syntaxes` Set containing all registered syntaxes.
   *
   * @returns An array where each element is an array of property names representing a registered syntax.
   *
   * @example
   * // Assuming OloIdSyntax.syntaxes contains {'type/id', 'category/code'} and separator is '/'
   * const matrix = this.getSyntaxMatrix();
   * // matrix would be: [['type', 'id'], ['category', 'code']]
   *
   * @private
   */
  private getSyntaxMatrix(set = OloIdSyntax.syntaxes) { return Array.from(set).map(syntax => syntax.split(OloIdSyntax.separator)); }

  /**
   * Normalizes various syntax input formats into a sorted array of non-empty strings.
   *
   * This internal helper method takes a syntax definition provided as a separator-joined string,
   * an array of strings, or an OloUri object, and converts it into a canonical representation:
   * an array of property name strings, sorted alphabetically, with any empty strings removed.
   *
   * @param syntax - The input syntax definition. Can be:
   *   - `string`: A string with property names joined by the global separator (e.g., "type/id").
   *   - `string[]`: An array of property name strings (e.g., ['type', 'id']).
   *   - `OloUri`: An object where keys represent the property names.
   *   - `undefined`: Handled gracefully, resulting in an empty array.
   *
   * @returns A normalized array of syntax property names (strings), sorted alphabetically,
   *   or an empty array if the input is invalid or empty after normalization.
   *
   * @example
   * // Assuming global separator is '/'
   * this.normSyntax('type/id');       // Returns ['id', 'type'] (sorted)
   * this.normSyntax(['id', 'type']);   // Returns ['id', 'type']
   * this.normSyntax({ id: '1', type: 'user' }); // Returns ['id', 'type'] (sorted keys)
   * this.normSyntax('a//b');          // Returns ['a', 'b'] (empty string removed)
   * this.normSyntax(undefined);       // Returns []
   * this.normSyntax({});              // Returns []
   *
   * @private
   */
  private normSyntax(syntax?: string | string[] | OloUri): string[] {
    const normSyntax = typeof syntax === 'string'
      ? syntax.split(OloIdSyntax.separator)
      : Array.isArray(syntax)
        ? syntax
        : Object.keys(syntax ?? {}).sort();

    return normSyntax.filter(syntaxItem => !!syntaxItem);
  }

  /**
   * Registers multiple syntaxes into a specified Set after normalization.
   *
   * This internal method iterates through an array of syntax definitions (strings or string arrays),
   * normalizes each one using `normSyntax` (sorting properties and removing empty parts),
   * and adds the valid, normalized, separator-joined string representation to the target Set
   * (usually the static `syntaxes` registry).
   *
   * It also ensures that the default `ID_TYPE_UNDEFINED` syntax is removed from the Set
   * once any valid syntax is registered.
   *
   * @param syntaxes - An array of syntaxes to register. Each element can be a
   *   separator-joined string or an array of property name strings.
   * @param options - Optional configuration.
   * @param options.set - The Set object into which the normalized syntaxes should be added.
   *   Defaults to the static `OloIdSyntax.syntaxes` registry.
   *
   * @returns The updated syntax matrix (array of string arrays) representing the state
   *   of the target Set after the registration process.
   *
   * @private
   */
  private registerSyntaxes(
    syntaxes: (string | string[])[],
    { set = OloIdSyntax.syntaxes }: { set?: Set<string> } = {},
  ): string[][] {
    syntaxes.forEach(
      (syntax) => {
        const inputSyntax = this.normSyntax(syntax);

        if (inputSyntax.length > 0) {
          set.delete(ID_TYPE_UNDEFINED);
          set.add(inputSyntax.join(OloIdSyntax.separator));
        }
      }
    );

    return this.getSyntaxMatrix(set);
  }

  /**
   * Sets or retrieves the registered syntaxes.
   *
   * - If an array of `syntaxes` is provided, this method registers them using `registerSyntaxes`,
   *   effectively updating the global registry with the provided definitions. Note that this adds
   *   to the existing registry rather than completely replacing it unless the registry was empty.
   * - If `syntaxes` is `undefined` or omitted, this method acts like `getSyntaxes()` without arguments,
   *   returning the matrix representation of all currently registered syntaxes.
   *
   * @param syntaxes - Optional. An array of syntax definitions (strings or string arrays) to register.
   *
   * @returns The current syntax matrix (array of string arrays) after the operation. If syntaxes were
   *   provided, it reflects the state after registration. If no syntaxes were provided, it reflects
   *   the current state of the registry.
   *
   * @example
   * const syntaxManager = new OloIdSyntax();
   *
   * // Set new syntaxes (adds to or updates the registry)
   * syntaxManager.setSyntaxes(['type/id', ['category', 'code']]);
   *
   * // Get all currently registered syntaxes
   * const allSyntaxes = syntaxManager.setSyntaxes();
   * console.log(allSyntaxes); // Output: [['type', 'id'], ['category', 'code']] (or including others if pre-existing)
   */
  public setSyntaxes(syntaxes?: (string | string[])[]): string[][] {
    if (syntaxes) {
      return this.registerSyntaxes(syntaxes);
    }
    return this.getSyntaxes(syntaxes);
  }

  /**
   * Retrieves registered syntaxes that match the provided input, optionally registering
   * the input syntax if no match is found.
   *
   * The method normalizes the input `syntax` (string, array, or object keys) into a
   * canonical sorted array of property names. It then searches the static registry
   * for an exact match (same properties, same count).
   *
   * - If an exact match is found, it's returned as a single-element matrix `[[prop1, prop2, ...]]`.
   * - If no exact match is found:
   *    - If `register` is `true`, the normalized input syntax is added to the static registry
   *      and returned as a single-element matrix.
   *    - If `register` is `false`, the normalized input syntax is returned as a single-element
   *      matrix without adding it to the registry.
   * - If the input `syntax` is `undefined` or normalizes to an empty array, the method returns
   *   the matrix representation of *all* currently registered syntaxes.
   *
   * @param syntax - Optional. The syntax definition to search for or potentially register.
   *   Can be a separator-joined string, an array of strings, or an OloUri object (whose keys are used).
   *   If omitted, all registered syntaxes are returned.
   * @param options - Optional configuration.
   * @param options.register - If `true`, the normalized `syntax` will be added to the global registry
   *   if an exact match is not found. Defaults to `false`.
   *
   * @returns An array of arrays, where each inner array represents a syntax (ordered property names).
   *   Typically contains zero or one element unless no `syntax` was provided (returns all).
   *
   * @example
   * const syntaxManager = new OloIdSyntax(['type/id']);
   *
   * // Find existing syntax by string
   * console.log(syntaxManager.getSyntaxes('type/id')); // Output: [['type', 'id']]
   *
   * // Find existing syntax by array
   * console.log(syntaxManager.getSyntaxes(['id', 'type'])); // Output: [['type', 'id']] (Order doesn't matter for lookup if keys match)
   *
   * // Find existing syntax by object keys
   * console.log(syntaxManager.getSyntaxes({ id: 1, type: 'a' })); // Output: [['type', 'id']]
   *
   * // Attempt to find non-existent syntax (register=false)
   * console.log(syntaxManager.getSyntaxes('category/code')); // Output: [['category', 'code']] (but not registered)
   *
   * // Find and register non-existent syntax
   * console.log(syntaxManager.getSyntaxes(['category', 'code'], { register: true })); // Output: [['category', 'code']] (now registered)
   *
   * // Get all registered syntaxes
   * console.log(syntaxManager.getSyntaxes()); // Output: [['type', 'id'], ['category', 'code']]
   */
  public getSyntaxes(syntax?: string | string[] | OloUri, { register = false }: { register?: boolean } = {}): string[][] {
    const inputSyntax = this.normSyntax(syntax);

    if (inputSyntax.length === 0) {
      return this.getSyntaxMatrix();
    }

    const syntaxMatcher = (testSyntax: string[]) => testSyntax.filter(syntaxItem => !inputSyntax.includes(syntaxItem)).length === 0;

    const resultSyntaxes = [
      this.getSyntaxMatrix().find((syntax) => syntaxMatcher(syntax) && syntax.length === inputSyntax.length)
    ]
      .filter(item => !!item);

    if (resultSyntaxes.length === 0) {
      const result = [inputSyntax];
      if (register) {
        this.registerSyntaxes(result);
      }
      return result;
    }

    return resultSyntaxes as string[][];
  }
}
