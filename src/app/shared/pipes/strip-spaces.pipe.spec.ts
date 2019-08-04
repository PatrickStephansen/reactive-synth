import { StripSpacesPipe } from './strip-spaces.pipe';

describe('StripSpacesPipe', () => {
  it('create an instance', () => {
    const pipe = new StripSpacesPipe();
    expect(pipe).toBeTruthy();
  });

  it('should remove spaces from input', () => {
    const pipe = new StripSpacesPipe();
    expect(pipe.transform('a b c')).toBe('abc');
  });

  it('should remove tabs from input', () => {
    const pipe = new StripSpacesPipe();
    expect(pipe.transform('a\tb\tc1!@#')).toBe('abc1!@#');
  });
});
