import { getSectionName } from ':/utils/index';

describe('Utils functions must work well to ensure a proper functioning of the library', () => {
  it('should extract section name from widget id', () => {
    expect(getSectionName('root_section_widget')).toBe('section');
  });

  it('should extract section name from section id', () => {
    expect(getSectionName('root_section', true)).toBe('section');
  });

  it('should return undefined when the id is not valid', () => {
    expect(getSectionName('root_section')).toBeUndefined();
  });

  it('should return undefined if the id is root', () => {
    expect(getSectionName('root')).toBeUndefined();
  });
});
