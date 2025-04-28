import { ID_TYPE_SEPARATOR, IdSeparator } from '../types/index.ts';

import { OloIdSyntax } from './olo-id-syntax.ts';

describe('OloIdSyntax', () => {
  beforeEach(() => {
    OloIdSyntax['syntaxes'].clear();
    OloIdSyntax['separator'] = undefined as unknown as IdSeparator;
  });

  it('should initialize with default separator and undefined syntax', () => {
    const syntax = new OloIdSyntax();
    expect(syntax.getSeparator()).toBe(ID_TYPE_SEPARATOR);
    expect(syntax.getSyntaxes()).toEqual([["UNDEFINED"]]);
  });

  it('should initialize with custom separator', () => {
    const syntax = new OloIdSyntax([], { seperator: '-' });
    expect(syntax.getSeparator()).toBe('-');
    expect(syntax.getSyntaxes()).toEqual([]);
  });

  it('should register syntaxes from constructor', () => {
    const syntax = new OloIdSyntax(['type1/type2', ['type3', 'type4']]);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2'], ['type3', 'type4']]);
  });

  it('should register syntaxes with setSyntaxes', () => {
    const syntax = new OloIdSyntax();
    syntax.setSyntaxes(['type1/type2', ['type3', 'type4']]);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2'], ['type3', 'type4']]);
  });

  it('should return all syntaxes with getSyntaxes without parameters', () => {
    const syntax = new OloIdSyntax(['type1/type2', ['type3', 'type4']]);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2'], ['type3', 'type4']]);
  });

  it('should find matching syntax with getSyntaxes with string', () => {
    const syntax = new OloIdSyntax(['type1/type2', ['type3', 'type4'], 'type1/type3']);
    expect(syntax.getSyntaxes('type1/type2')).toEqual([['type1', 'type2']]);
    expect(syntax.getSyntaxes('type3/type4')).toEqual([['type3', 'type4']]);
    expect(syntax.getSyntaxes('type1/type3')).toEqual([['type1', 'type3']]);
  });

  it('should find matching syntax with getSyntaxes with array', () => {
    const syntax = new OloIdSyntax(['type1/type2', ['type3', 'type4']]);
    expect(syntax.getSyntaxes(['type1', 'type2'])).toEqual([['type1', 'type2']]);
    expect(syntax.getSyntaxes(['type3', 'type4'])).toEqual([['type3', 'type4']]);
  });

  it('should find matching syntax with getSyntaxes with object', () => {
    const syntax = new OloIdSyntax(['type1/type2', ['type3', 'type4']]);
    expect(syntax.getSyntaxes({ type1: 'value1', type2: 'value2' })).toEqual([['type1', 'type2']]);
    expect(syntax.getSyntaxes({ type3: 'value3', type4: 'value4' })).toEqual([['type3', 'type4']]);
  });

  it('should register new syntax if not found and register is true', () => {
    const syntax = new OloIdSyntax(['type1/type2']);
    expect(syntax.getSyntaxes('type3/type4', { register: true })).toEqual([['type3', 'type4']]);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2'], ['type3', 'type4']]);
  });

  it('should not register new syntax if not found and register is false', () => {
    const syntax = new OloIdSyntax(['type1/type2']);
    expect(syntax.getSyntaxes('type3/type4', { register: false })).toEqual([['type3', 'type4']]);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2']]);
  });

  it('should handle empty syntax array', () => {
    const syntax = new OloIdSyntax([]);
    expect(syntax.getSyntaxes()).toEqual([]);
  });

  it('should handle empty string syntax', () => {
    const syntax = new OloIdSyntax(['']);
    expect(syntax.getSyntaxes()).toEqual([]);
  });

  it('should handle duplicate syntaxes', () => {
    const syntax = new OloIdSyntax(['type1/type2', 'type1/type2']);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2']]);
  });

  it('should handle different separators in registered syntaxes', () => {
    const syntax = new OloIdSyntax(['type1-type2'], { seperator: '-' });
    expect(syntax.getSyntaxes('type1-type2')).toEqual([['type1', 'type2']]);
  });

  it('should handle setSyntaxes with undefined', () => {
    const syntax = new OloIdSyntax(['type1/type2']);
    expect(syntax.setSyntaxes(undefined)).toEqual([['type1', 'type2']]);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2']]);
  });

  it('should handle setSyntaxes with empty array', () => {
    const syntax = new OloIdSyntax(['type1/type2']);

    expect(syntax.getSyntaxes([])).toEqual([['type1', 'type2']]);
    expect(syntax.getSyntaxes([],{register:true})).toEqual([['type1', 'type2']]);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2']]);
  });

  it('should handle getSyntaxes with empty object', () => {
    const syntax = new OloIdSyntax(['type1/type2']);

    expect(syntax.getSyntaxes({})).toEqual([['type1', 'type2']]);
    expect(syntax.getSyntaxes({},{register:true})).toEqual([['type1', 'type2']]);
    expect(syntax.getSyntaxes()).toEqual([['type1', 'type2']]);
  });
});
