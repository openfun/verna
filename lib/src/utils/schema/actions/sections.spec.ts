import { vernaSchemaFactory } from ':/tests/mocks/factories';
import Section from ':/tests/mocks/Section';
import { addSection } from ':/utils/schema';

describe('section actions', () => {
  const defaultSchema = vernaSchemaFactory();

  it('should be able to add a section in the schema at defined position', async () => {
    const defaultSectionName = 'testSection';

    // Add a section after the initial one
    let newSchema = addSection(defaultSchema, `root_${defaultSectionName}`, Section);

    // Get the name of the new section
    let newSectionKey = newSchema.uiSchema?.['ui:order']?.find((id) => id !== defaultSectionName);
    expect(newSectionKey).toBeDefined();

    // Check that every needed data of the new section are present in the newSchema
    expect(Object.keys(newSchema.formSchema?.properties || {}).includes(newSectionKey!)).toBe(true);
    expect(Object.keys(newSchema.uiSchema || {}).includes(newSectionKey!)).toBe(true);

    // Check that the sections are ordered well
    expect(newSchema.uiSchema?.['ui:order']?.findIndex((key) => key === newSectionKey)).toEqual(1);
    expect(
      Object.keys(newSchema.uiSchema?.[newSectionKey!] || {}).includes('ui:ObjectFieldTemplate'),
    ).toBe(true);

    // Add a section in the first place
    newSchema = addSection(newSchema, null, Section);

    // Get the name of the new section
    newSectionKey = newSchema.uiSchema?.['ui:order']?.find(
      (id) => id !== defaultSectionName && id !== newSectionKey,
    );
    expect(newSectionKey).toBeDefined();

    // Check that every needed data of the new section are present in the newSchema
    expect(Object.keys(newSchema.formSchema?.properties || {}).includes(newSectionKey!)).toBe(true);
    expect(Object.keys(newSchema.uiSchema || {}).includes(newSectionKey!)).toBe(true);

    // Check that the sections are ordered well
    expect(newSchema.uiSchema?.['ui:order']?.findIndex((key) => key === newSectionKey)).toEqual(0);
    expect(
      Object.keys(newSchema.uiSchema?.[newSectionKey!] || {}).includes('ui:ObjectFieldTemplate'),
    ).toBe(true);
  });
});
