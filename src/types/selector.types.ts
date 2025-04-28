/**
 * Represents a selection mechanism, typically used to specify which parts or
 * aspects of an entity should be included or processed.
 *
 * It can be either a simple boolean or a nested object structure for fine-grained control.
 *
 * @template Parts - An optional string literal or abstract types representing the valid names
 *   of the parts that can be selected. If provided, it constrains the keys allowed in the
 *   object form of the selector. Defaults to `string`, allowing any string key.
 * @template Setting - The type of the values defining the presence of a part. Defaults to `boolean`.
 *
 * @example
 * // Select everything
 * const selectAll: Selector = true;
 *
 * // Select only specific top-level parts
 * const selectSpecific: Selector<['header', 'body', 'footer']> = {
 *   header: true,
 *   body: false, // Exclude body
 *   footer: true
 * };
 *
 * // Select parts recursively
 * const selectNested: Selector<['content', 'metadata'], 0 | 1> = {
 *   content: 1,
 *   metadata: { // Apply another selector to metadata parts
 *     author: 1,
 *     date: 0 // Exclude date within metadata
 *   }
 * };
 *
 * // Using the default string generic
 * const selectAny: Selector = {
 *   anyPart: true,
 *   anotherPart: {
 *     subPart: false
 *   }
 * };
 */
export type Selector<Parts extends string = string, Setting extends boolean | string | number = boolean> = {
  [key in Parts]?: Setting | Selector | Selector<Parts>;
};
