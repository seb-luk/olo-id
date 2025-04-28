import { MediaImageRatio } from '../../config/index.ts';

export const FocusMapKeyList = [...Object.values(MediaImageRatio), 'DEFAULT'] as const;

/**
 * Focus keys derived from all supported image ratios and a fallback key.
 */
export type FocusMapKey = typeof FocusMapKeyList[number];

/**
 * Manages focus points for different image aspect ratios.
 *
 * A focus point is represented as a tuple `[x, y]`, where `x` and `y` are
 * numbers between 0 and 1 representing the horizontal and vertical coordinates
 * of the point of interest within an image, respectively (0,0 is top-left, 1,1 is bottom-right).
 *
 * This class allows defining specific focus points for standard ratios
 * (like 1:1, 16:9) and provides a default focus point (`DEFAULT`) as a fallback.
 * It offers methods to retrieve the appropriate focus point for a given ratio
 * and to get a string representation suitable for URL parameters or other uses.
 *
 * @example
 * // Initialize with only a default focus point
 * const map1 = new FocusMap([0.2, 0.8]);
 *
 * // Initialize with specific ratios
 * const map2 = new FocusMap({
 *   DEFAULT: [0.5, 0.5],
 *   [MediaImageRatio.sixteenXnine]: [0.7, 0.3]
 * });
 *
 * // Get focus point for 16:9 (returns [0.7, 0.3])
 * const focus16x9 = map2.get(MediaImageRatio.sixteenXnine);
 *
 * // Get focus point for 1:1 (falls back to DEFAULT, returns [0.5, 0.5])
 * const focus1x1 = map2.get(MediaImageRatio.oneXone);
 *
 * // Get string representation for 16:9 (returns "0d7x0d3")
 * const focusString = map2.toString(MediaImageRatio.sixteenXnine);
 */
export class FocusMap {
  /**
   * The default focus point `[x, y]`, used when no specific focus point is defined
   * for a requested ratio.
   *
   * @default [0.5, 0.5] (center)
   */
  public DEFAULT: [number, number] = [0.5, 0.5];

  /**
   * Optional focus point `[x, y]` specifically for the 1:1 aspect ratio.
   * Uses the value from {@link MediaImageRatio.oneXone} as the key.
   * @public
   */
  public [MediaImageRatio.oneXone]?: [number, number];

  /**
   * Optional focus point `[x, y]` specifically for the 2:1 aspect ratio.
   * Uses the value from {@link MediaImageRatio.twoXone} as the key.
   * @public
   */
  public [MediaImageRatio.twoXone]?: [number, number];

  /**
   * Optional focus point `[x, y]` specifically for the 4:7 aspect ratio.
   * Uses the value from {@link MediaImageRatio.fourXseven} as the key.
   * @public
   */
  public [MediaImageRatio.fourXseven]?: [number, number];

  /**
   * Optional focus point `[x, y]` specifically for the 16:9 aspect ratio.
   * Uses the value from {@link MediaImageRatio.sixteenXnine} as the key.
   * @public
   */
  public [MediaImageRatio.sixteenXnine]?: [number, number];

  /**
   * Creates an instance of FocusMap.
   *
   * @constructor
   *
   * @param focusMap - Initialization data. Can be:
   *   - An object mapping ratio keys (like `MediaImageRatio.oneXone` or `'DEFAULT'`) to `[x, y]` tuples.
   *   - A single `[x, y]` tuple, which will be used as the `DEFAULT` focus point.
   *   - Another `FocusMap` instance (copy constructor pattern).
   *   - An empty object or omitted, resulting in default values (`DEFAULT` = `[0.5, 0.5]`).
   */
  constructor(
    focusMap:
      | {
          DEFAULT?: [number, number];
          [MediaImageRatio.oneXone]?: [number, number];
          [MediaImageRatio.twoXone]?: [number, number];
          [MediaImageRatio.fourXseven]?: [number, number];
          [MediaImageRatio.sixteenXnine]?: [number, number];
        }
      | [number, number] | FocusMap = {},
  ) {
    if (Array.isArray(focusMap)) {
      this.DEFAULT = focusMap;
    } else {
      if (focusMap.DEFAULT) {
        this.DEFAULT = focusMap.DEFAULT;
      }

      if (focusMap[MediaImageRatio.oneXone]) {
        this[MediaImageRatio.oneXone] = focusMap[MediaImageRatio.oneXone];
      }
      if (focusMap[MediaImageRatio.twoXone]) {
        this[MediaImageRatio.twoXone] = focusMap[MediaImageRatio.twoXone];
      }
      if (focusMap[MediaImageRatio.fourXseven]) {
        this[MediaImageRatio.fourXseven] = focusMap[MediaImageRatio.fourXseven];
      }
      if (focusMap[MediaImageRatio.sixteenXnine]) {
        this[MediaImageRatio.sixteenXnine] = focusMap[MediaImageRatio.sixteenXnine];
      }
    }
  }

  /**
   * Gets the focus point `[x, y]` for a specified ratio.
   *
   * If a specific focus point is defined for the given `ratio`, it's returned.
   * Otherwise, the `DEFAULT` focus point is returned.
   * If the special ratio `'original'` is requested, it returns the center point `[0.5, 0.5]`.
   *
   * @param ratio - The desired ratio key (from {@link FocusMapKey}) or the special string `'original'`.
   *   Defaults to `'DEFAULT'`.
   *
   * @returns The `[x, y]` tuple representing the focus point.
   */
  public get(ratio: FocusMapKey | 'original' = 'DEFAULT'): [number, number] {
    return ratio === 'original' ? [0.5, 0.5] : this[ratio] ?? this.DEFAULT;
  };

  /**
   * Gets the string representation of the focus point for a specified ratio.
   *
   * The format is "XdYxYdY", where X and Y are the coordinates and 'd' replaces the decimal point.
   * Example: `[0.7, 0.3]` becomes `"0d7x0d3"`.
   *
   * If a specific focus point is defined for the given `ratio`, its string representation is returned.
   * Otherwise, the string representation of the `DEFAULT` focus point is returned.
   * If the special ratio `'original'` is requested, it returns `"0d5x0d5"`.
   *
   * @param ratio - The desired ratio key (from {@link FocusMapKey}) or the special string `'original'`.
   *   Defaults to `'DEFAULT'`.
   *
   * @returns The string representation of the focus point.
   */
  public toString(ratio: FocusMapKey | 'original' = 'DEFAULT'): string {
    return ratio === 'original'
      ? '0d5x0d5'
      : (this[ratio] ?? this.DEFAULT).map((point) => point.toString().replace('.', 'd')).join('x');
  };
}
