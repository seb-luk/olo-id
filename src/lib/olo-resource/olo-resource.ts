import { GetListTypeGuard } from 'olo-platform';
import { OloIdSchema } from '../../types/index.ts';
import { OloReference, OloReferenceParameter, isOloReference } from '../olo-reference.ts';

import { FocusMap } from './focus-map.ts';

export interface OloResourceParamter<IdentifierProperties extends string[][] = string[][]> extends OloReferenceParameter<IdentifierProperties> {
  filetype?: string;
  ratio?: [number, number];
  focus?: FocusMap | [number, number];
  size?: number;
  width?: number;
  height?: number;
  framerate?: number;
  duration?: number;
  kompression?: string;
  cropable?: boolean;
}

/**
 * Represents a resource, typically a digital asset like an image or video, extending the {@link OloReference} class.
 *
 * An `OloResource` builds upon the `OloReference` by adding metadata specific to file-based assets,
 * such as file type, dimensions, duration, focus points, and technical details. This information
 * is crucial for handling and displaying embedded content correctly.
 *
 * @template IdentifierProperties - A 2D array representing the collection of possible syntaxes (each inner array is a `string[]`). Defaults to `string[][]`.
 *
 * @extends {OloReference<IdentifierProperties>}
 *
 * @example
 * // Create an image resource
 * const imageResource = new OloResource({
 *   uri: { type: 'image', id: 'img001' },
 *   format: Format.media,
 *   label: 'Company Logo',
 *   filetype: 'image/png',
 *   width: 500,
 *   height: 200,
 *   focus: [0.5, 0.2] // Focus on the top center
 * });
 *
 * // Create a video resource
 * const videoResource = new OloResource({
 *   uri: { type: 'video', slug: 'intro' },
 *   format: Format.media,
 *   label: 'Introduction Video',
 *   filetype: 'video/mp4',
 *   duration: 120, // 2 minutes
 *   ratio: [16, 9]
 * });
 */
export class OloResource<IdentifierProperties extends string[][] = string[][]> extends OloReference<IdentifierProperties> {
  /**
   * The MIME type (e.g., 'image/jpeg', 'video/mp4') of the resource asset.
   *
   * @optional
   */
  public filetype?: string;

  /**
   * The aspect ratio of the resource, represented as a tuple `[width, height]`.
   * Useful for images and videos to maintain proportions.
   *
   * @example [16, 9]
   * @optional
   */
  public ratio?: [number, number];

  /**
   * An instance of {@link FocusMap} defining the important focal points of the resource,
   * especially relevant for images and videos when cropping or resizing.
   * Can be initialized from a {@link FocusMap} object or a simple `[x, y]` tuple for the default focus.
   *
   * @optional
   */
  public focus?: FocusMap;

  /**
   * The file size of the asset in bytes.
   *
   *np @optional
   */
  public size?: number;

  /**
   * The absolute width of the resource in pixels. Applicable primarily to images and videos.
   *
   * @optional
   */
  public width?: number;

  /**
   * The absolute height of the resource in pixels. Applicable primarily to images and videos.
   *
   * @optional
   */
  public height?: number;

  /**
   * The frame rate of the resource in frames per second (FPS). Applicable primarily to videos.
   *
   * @optional
   */
  public framerate?: number;

  /**
   * The duration of the resource in seconds. Applicable primarily to videos and audio.
   *
   * @optional
   */
  public duration?: number;

  /**
   * Information about the compression used in the original asset (e.g., 'lossy', 'lossless', specific codec).
   *
   * @optional
   */
  public kompression?: string;

  /**
   * Indicates whether the resource (typically an image) can be safely cropped.
   * If `false`, cropping should be avoided to preserve essential information (e.g., maps, diagrams).
   *
   * @example `false` for images of maps that should not be cropped.
   * @optional
   */
  public cropable: boolean = true;

  /**
   * Creates an instance of OloResource.
   *
   * Initializes the resource by first calling the `OloReference` constructor with the core reference properties
   * (`uri`, `format`, `parts`, `type`, `label`). It then assigns the additional resource-specific properties
   * based on the provided `resource` object.
   *
   * @constructor
   * @param resource - The source data for the resource. Can be:
   *   - An object containing `uri` (as `OloUri`) and any optional properties from `OloReference` and `OloResource`.
   *   - Another `OloResource` instance (copy constructor pattern).
   */
  constructor(resource: OloResourceParamter<IdentifierProperties> | OloResource) {
    super(resource);

    if (resource.filetype) {
      this.filetype = resource.filetype;
    }
    if (resource.ratio) {
      this.ratio = resource.ratio;
    }
    if (resource.focus) {
      this.focus = new FocusMap(resource.focus);
    }
    if (resource.size) {
      this.size = resource.size;
    }
    if (resource.width) {
      this.width = resource.width;
    }
    if (resource.height) {
      this.height = resource.height;
    }
    if (resource.framerate) {
      this.framerate = resource.framerate;
    }
    if (resource.duration) {
      this.duration = resource.duration;
    }
    if (resource.kompression) {
      this.kompression = resource.kompression;
    }
    if (resource.cropable) {
      this.cropable = resource.cropable;
    }
  }

  /**
   * Overrides the `toJSON` method of `OloReference` to include resource-specific properties.
   *
   * This provides a complete JSON representation of the resource, including all inherited
   * properties from `OloReference`, `OloDescriptor`, and `OloIdSet`, plus the resource metadata.
   * Suitable for serialization.
   *
   * @override
   * @returns An object containing all properties of the OloResource.
   *
   * @example
   * const resource = new OloResource({
   *   uri: { type: 'image', id: 'img001' },
   *   format: Format.media,
   *   filetype: 'image/jpeg',
   *   width: 800,
   *   height: 600
   * });
   * const json = resource.toJSON();
   * console.log(json);
   * // Output: {
   * //   uri: { type: 'image', id: 'img001' },
   * //   format: 'media',
   * //   parts: true,
   * //   type: 'SELF',
   * //   label: '',
   * //   filetype: 'image/jpeg',
   * //   width: 800,
   * //   height: 600,
   * //   cropable: true,
   * // }
   */
  override toJSON() {
    const json: OloResourceParamter<IdentifierProperties> = {
      ...super.toJSON(),
      cropable: this.cropable,
    }

    if (this.filetype) {
      json.filetype = this.filetype;
    }
    if (this.ratio) {
      json.ratio = this.ratio;
    }
    if (this.focus) {
      json.focus = this.focus;
    }
    if (this.size) {
      json.size = this.size;
    }
    if (this.width) {
      json.width = this.width;
    }
    if (this.height) {
      json.height = this.height;
    }
    if (this.framerate) {
      json.framerate = this.framerate;
    }
    if (this.duration) {
      json.duration = this.duration;
    }
    if (this.kompression) {
      json.kompression = this.kompression;
    }

    return json as OloIdSchema<OloResourceParamter<IdentifierProperties>, IdentifierProperties>;
  }
}

/**
 * Typeguard for OloResource.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloResource
 */
export const isOloResource = (obj: unknown): obj is OloResource =>
  obj != null && isOloReference(obj)
  && ((obj as OloResource).filetype === undefined || typeof (obj as OloResource).filetype === 'string')
  && ((obj as OloResource).ratio === undefined || (Array.isArray((obj as OloResource).ratio) && (obj as OloResource).ratio?.length === 2))
  && ((obj as OloResource).focus === undefined || typeof (obj as OloResource).focus === 'object')
  && ((obj as OloResource).size === undefined || typeof (obj as OloResource).size === 'number')
  && ((obj as OloResource).width === undefined || typeof (obj as OloResource).width === 'number')
  && ((obj as OloResource).height === undefined || typeof (obj as OloResource).height === 'number')
  && ((obj as OloResource).framerate === undefined || typeof (obj as OloResource).framerate === 'number')
  && ((obj as OloResource).duration === undefined || typeof (obj as OloResource).duration === 'number')
  && ((obj as OloResource).kompression === undefined || typeof (obj as OloResource).kompression === 'string')
  && ((obj as OloResource).cropable === undefined || typeof (obj as OloResource).cropable === 'boolean');

/**
 * Typeguard for OloResource Array.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a OloResource Array
 */
export const isOloResourceList = GetListTypeGuard(isOloResource);
