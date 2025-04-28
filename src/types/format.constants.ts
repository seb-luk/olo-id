/**
 * Defines the standard digital representation formats for entities.
 *
 * The format indicates the primary nature of the entity's content and how it might be
 * processed, displayed, or interacted with.
 */
export enum Format {
  /**
   * Term entities are complex phenomena that can only be described by a combination of other formats.
   *
   * @example Renaissance, Impressionism
   */
  term = 'TERM',

  /**
   * Audio entities consist of a sound pattern or noise.
   *
   * @example Beethovens 5. Symphony
   */
  audio = 'AUDIO',

  /**
   * Document entities are digital reproductions of unique documents.
   *
   * @example Declaration of Indipendence
   */
  document = 'DOCUMENT',

  /**
   * Graphic entities are vector graphics.
   *
   * @example Apple Logo
   */
  graphic = 'GRAPHIC',

  /**
   * Image entities can be represented as digital image.
   *
   * @example Mona Lisa
   */
  image = 'IMAGE',

  /**
   * Link or refer to other entities or external content.
   * It might not have substantial content of its own beyond the reference information.
   * @example A bookmark, A related article link
   */
  link = 'LINK',

  /**
   * Text entities are actual texts.
   * @example MacBeth
   */
  text = 'TEXT',

  /**
   * Video entities are a moving image with or without sound. They are not a real word performances like a play.
   * @example The Matrix
   */
  video = 'VIDEO',

  /**
   * User entities represent real people for example users of the oloteo platform.
   * @example Jelena Dokic
   */
  person = 'PERSON',
}

/**
 * Typeguard for Format.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is a Format
 */
export const isFormat = (obj: unknown): obj is Format =>
  obj != null && typeof obj === 'string' && Object.values(Format).includes(obj as Format);

/**
 * A list of all formats that can be used for validation.
 */
export const Formats = Object.values(Format);
