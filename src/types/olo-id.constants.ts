/**
 * Placeholder string used internally, primarily within {@link OloIdSyntax},
 * to represent a default or undefined identifier syntax structure before
 * any specific syntaxes are registered or determined.
 */
export const ID_TYPE_UNDEFINED = 'UNDEFINED';


/**
 * Placeholder string used within {@link OloId} instances to represent a property value
 * that is missing, null, or explicitly undefined in the source data (string or object).
 * This ensures that the structure of the OloId remains consistent according to its syntax,
 * even when some values are absent.
 */
export const ID_PROP_UNDEFINED = 'UNDEFINED';

/**
 * Type alias representing the literal string 'UNDEFINED', used as a placeholder
 * for undefined property values within an {@link OloId}.
 * @see {@link ID_PROP_UNDEFINED}
 */
export type IdPropUndefined = typeof ID_PROP_UNDEFINED;


/**
 * The default separator character used for joining and splitting identifier values
 * in string representations of {@link OloId} and for joining/splitting property names
 * in string representations of syntaxes within {@link OloIdSyntax}.
 *
 * @default '/'
 */
export const ID_TYPE_SEPARATOR = '/' as const;

/**
 * Type alias representing the literal string '/', the default separator character
 * for OloIds and syntaxes.
 * @see {@link ID_TYPE_SEPARATOR}
 */
export type IdSeparator = typeof ID_TYPE_SEPARATOR;
