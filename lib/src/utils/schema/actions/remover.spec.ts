import { vernaSchemaFactory } from ':/tests/mocks/factories';
import { VernaSchemaType } from ':/types/rjsf';
import { removeProperty } from ':/utils/schema/actions/remover';

describe('remove actions', () => {
  const defaultFlatSchema: VernaSchemaType = {
    formSchema: {
      properties: {
        widget1: {
          type: 'string',
        },
        widget2: {
          title: 'root_widget2_title',
          type: 'string',
        },
        widget3: {
          description: 'root_widget3_description',
          title: 'root_widget3_title',
          type: 'string',
        },
        widget4: {
          title: 'root_widget4_title',
          type: 'string',
        },
      },
    },
    translationSchema: {
      us: {
        root_widget2_title: 'widget2 title',
        root_widget3_description: 'widget3 description',
        root_widget3_title: 'widget3 title',
        root_widget4_title: 'widget4 title',
      },
    },
    uiSchema: {
      'ui:order': ['widget2', 'widget1', 'widget3', 'widget4'],
      widget1: {
        'ui:widget': 'test',
      },
      widget2: {
        'ui:widget': 'test',
      },
      widget3: {
        'ui:widget': 'test',
      },
      widget4: {
        'ui:widget': 'test',
      },
    },
  };

  const defaultSchema = vernaSchemaFactory({
    formSchema: {
      properties: {
        section1: {
          properties: {
            widget1: {
              type: 'string',
            },
            widget2: {
              title: 'root_section1_widget2_title',
              type: 'string',
            },
            widget3: {
              description: 'root_section1_widget3_description',
              title: 'root_section1_widget3_title',
              type: 'string',
            },
            widget4: {
              title: 'root_section1_widget4_title',
              type: 'string',
            },
          },
          title: 'root_section1_title',
          type: 'object',
        },
        section2: {
          properties: {
            widget1: {
              title: 'root_section2_widget1_title',
              type: 'string',
            },
          },
          title: 'root_section2_title',
          type: 'object',
        },
        section3: {
          properties: {},
          type: 'object',
        },
      },
    },
    translationSchema: {
      us: {
        root_section1_title: 'section1 title',
        root_section1_widget2_title: 'widget2 title',
        root_section1_widget3_description: 'widget3 description',
        root_section1_widget3_title: 'widget3 title',
        root_section1_widget4_title: 'widget4 title',
        root_section2_title: 'section2 title',
        root_section2_widget1_title: 'widget1 section2 title',
      },
    },
    uiSchema: {
      section1: {
        'ui:ObjectFieldTemplate': () => false,
        'ui:order': ['widget2', 'widget1', 'widget3', 'widget4'],
        widget1: {
          'ui:widget': 'test',
        },
        widget2: {
          'ui:widget': 'test',
        },
        widget3: {
          'ui:widget': 'test',
        },
        widget4: {
          'ui:widget': 'test',
        },
      },
      section2: {
        'ui:ObjectFieldTemplate': () => false,
        'ui:order': ['widget1'],
        widget1: {
          'ui:widget': 'test',
        },
      },
      section3: {
        'ui:ObjectFieldTemplate': () => false,
      },
      'ui:order': ['section1', 'section2', 'section3'],
    },
  });

  it('should be able to remove completely a specific widget in the schema', async () => {
    // Remove the second widget
    let newSchema = removeProperty(defaultFlatSchema, 'root_widget2');
    // Check there are only 3 widgets
    expect(Object.keys(newSchema.formSchema?.properties || {})).toHaveLength(3);
    // Check that traces of widget2 are cleared from uiSchema
    expect(newSchema.uiSchema?.['ui:order']?.includes('widget2')).toBe(false);
    expect(newSchema.uiSchema?.['widget2']).toBeUndefined();
    // Check that the translations of widget2 are cleared
    expect(newSchema.translationSchema?.['us']['root_widget2_title']).toBeUndefined();

    // Remove the last widget
    newSchema = removeProperty(newSchema, 'root_widget4');
    // Check there are only 2 widgets
    expect(Object.keys(newSchema.formSchema?.properties || {})).toHaveLength(2);
    // Check that traces of widget4 are cleared from uiSchema
    expect(newSchema.uiSchema?.['ui:order']?.includes('widget4')).toBe(false);
    expect(newSchema.uiSchema?.['widget4']).toBeUndefined();
    // Check that the translations of widget4 are cleared
    expect(newSchema.translationSchema?.['us']['root_widget4_title']).toBeUndefined();

    // Remove the first widget
    newSchema = removeProperty(newSchema, 'root_widget1');
    // Check there are only 1 widget
    expect(Object.keys(newSchema.formSchema?.properties || {})).toHaveLength(1);
    // Check that traces of widget1 are cleared from uiSchema
    expect(newSchema.uiSchema?.['ui:order']?.includes('widget1')).toBe(false);
    expect(newSchema.uiSchema?.['widget1']).toBeUndefined();

    // Remove the remaining widget
    newSchema = removeProperty(newSchema, 'root_widget3');
    // Check there are no more widget
    expect(Object.keys(newSchema.formSchema?.properties || {})).toHaveLength(0);
    // Check that traces of widget3 are cleared from uiSchema
    expect(newSchema.uiSchema?.['ui:order']?.includes('widget3')).toBe(false);
    expect(newSchema.uiSchema?.['widget3']).toBeUndefined();
    // Check that the translations of widget3 are cleared
    expect(newSchema.translationSchema?.['us']['root_widget3_title']).toBeUndefined();
    expect(newSchema.translationSchema?.['us']['root_widget3_description']).toBeUndefined();
  });

  it('should be able to remove completely a specific widget in a section', async () => {
    // Remove the second widget
    let newSchema = removeProperty(defaultSchema, 'root_section1_widget2');
    // Check there are only 3 widgets in section1
    expect(
      Object.keys(newSchema.formSchema?.properties?.['section1']?.properties || {}),
    ).toHaveLength(3);
    // Check that traces of widget2 are cleared from uiSchema
    expect(newSchema.uiSchema?.['section1']?.['ui:order']?.includes('widget2')).toBe(false);
    expect(newSchema.uiSchema?.['section1']?.['widget2']).toBeUndefined();
    // Check that the translations of widget2 are cleared
    expect(newSchema.translationSchema?.['us']['root_section1_widget2_title']).toBeUndefined();

    // Remove the last widget
    newSchema = removeProperty(newSchema, 'root_section1_widget4');
    // Check there are only 2 widgets in section1
    expect(
      Object.keys(newSchema.formSchema?.properties?.['section1']?.properties || {}),
    ).toHaveLength(2);
    // Check that traces of widget4 are cleared from uiSchema
    expect(newSchema.uiSchema?.['section1']?.['ui:order']?.includes('widget4')).toBe(false);
    expect(newSchema.uiSchema?.['section1']?.['widget4']).toBeUndefined();
    // Check that the translations of widget4 are cleared
    expect(newSchema.translationSchema?.['us']['root_section1_widget4_title']).toBeUndefined();

    // Remove the first widget
    newSchema = removeProperty(newSchema, 'root_section1_widget1');
    // Check there are only 1 widget in section1
    expect(
      Object.keys(newSchema.formSchema?.properties?.['section1']?.properties || {}),
    ).toHaveLength(1);
    // Check that traces of widget1 are cleared from uiSchema
    expect(newSchema.uiSchema?.['ui:order']?.includes('widget1')).toBe(false);
    expect(newSchema.uiSchema?.['widget1']).toBeUndefined();

    // Remove the remaining widget
    newSchema = removeProperty(newSchema, 'root_section1_widget3');
    // Check there are no more widget in section1
    expect(
      Object.keys(newSchema.formSchema?.properties?.['section1']?.properties || {}),
    ).toHaveLength(0);
    // Check that traces of widget3 are cleared from uiSchema
    expect(newSchema.uiSchema?.['section1']?.['ui:order']?.includes('widget3')).toBe(false);
    expect(newSchema.uiSchema?.['section1']?.['widget3']).toBeUndefined();
    // Check that the translations of widget3 are cleared
    expect(newSchema.translationSchema?.['us']['root_section1_widget3_title']).toBeUndefined();
    expect(
      newSchema.translationSchema?.['us']['root_section1_widget3_description'],
    ).toBeUndefined();
  });

  it('should be able to remove completely a specific section in the schema', async () => {
    // Remove the section2
    let newSchema = removeProperty(defaultSchema, 'root_section2');
    // Check that the section itself is deleted from the schema
    expect(newSchema.formSchema?.properties?.['section2']).toBeUndefined();
    // Check that the section2 informations are removed from the uiSchema
    expect(newSchema.uiSchema?.['ui:order']?.includes('section2')).toBe(false);
    expect(newSchema.uiSchema?.['section2']).toBeUndefined();
    // Check that the translation of the section and its properties are removed
    const translationKeys = Object.keys(newSchema.translationSchema?.['us'] || {});
    expect(translationKeys.includes('root_section2_title')).toBe(false);
    expect(translationKeys.includes('root_section2_widget1_title')).toBe(false);

    // Remove the section3
    newSchema = removeProperty(newSchema, 'root_section3');
    // Check that the section itself is deleted from the schema
    expect(newSchema.formSchema?.properties?.['section3']).toBeUndefined();
    // Check that the section3 informations are removed from the uiSchema
    expect(newSchema.uiSchema?.['ui:order']?.includes('section3')).toBe(false);
    expect(newSchema.uiSchema?.['section3']).toBeUndefined();

    // Remove the section1
    newSchema = removeProperty(newSchema, 'root_section1');
    // Check that the section itself is deleted from the schema
    expect(newSchema.formSchema?.properties?.['section1']).toBeUndefined();
    // Check that the section1 informations are removed from the uiSchema
    expect(newSchema.uiSchema?.['ui:order']).toHaveLength(0);
    expect(newSchema.uiSchema?.['section1']).toBeUndefined();
    // Check that the translation of the section and its properties are removed
    expect(Object.keys(newSchema.translationSchema?.['us'] || {})).toHaveLength(0);
  });
});
