/**
 * Tests for search utils: highlight and debounce
 */
import {
  highlightSearchTerm,
  getHighlightedFragments,
  debounce,
} from '@/lib/search-utils';

describe('highlightSearchTerm', () => {
  it('returns empty string for empty text', () => {
    expect(highlightSearchTerm('', 'foo')).toBe('');
  });

  it('returns text unchanged when query is empty', () => {
    const text = 'Las cinco del día';
    expect(highlightSearchTerm(text, '')).toBe(text);
    expect(highlightSearchTerm(text, '   ')).toBe(text);
  });

  it('wraps single match in mark tag', () => {
    const result = highlightSearchTerm('Las cinco del día', 'cinco');
    expect(result).toContain('<mark');
    expect(result).toContain('cinco');
    expect(result).toContain('</mark>');
  });

  it('is case insensitive', () => {
    const result = highlightSearchTerm('CINCO del día', 'cinco');
    expect(result).toContain('<mark');
    expect(result).toContain('CINCO');
  });

  it('escapes regex special characters in query', () => {
    const result = highlightSearchTerm('a (b) c', '(');
    expect(result).toContain('<mark');
    expect(result).toContain('(');
  });
});

describe('getHighlightedFragments', () => {
  it('returns single text fragment when query is empty', () => {
    expect(getHighlightedFragments('Hello world', '')).toEqual([
      { type: 'text', value: 'Hello world' },
    ]);
  });

  it('splits text and match', () => {
    const result = getHighlightedFragments('Las cinco del día', 'cinco');
    expect(result).toEqual([
      { type: 'text', value: 'Las ' },
      { type: 'match', value: 'cinco' },
      { type: 'text', value: ' del día' },
    ]);
  });

  it('is case insensitive', () => {
    const result = getHighlightedFragments('CINCO', 'cinco');
    expect(result).toEqual([{ type: 'match', value: 'CINCO' }]);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls fn only after wait ms', () => {
    const fn = jest.fn();
    const d = debounce(fn, 100);
    d('a');
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('resets timer on repeated calls', () => {
    const fn = jest.fn();
    const d = debounce(fn, 100);
    d('a');
    jest.advanceTimersByTime(50);
    d('b');
    jest.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });
});
