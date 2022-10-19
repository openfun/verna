import _ from 'lodash';
import { vernaSchemaFactory } from ':/tests/mocks/factories';
import { addWidget } from ':/utils/schema';

describe('widgets actions', () => {
  const defaultSchema = vernaSchemaFactory();

  it('should be able to add a widget in the schema at defined position', async () => {
    const defaultSectionName = 'testSection';
    // Create a widget in first place in the testSection
    let newSchema = addWidget(defaultSchema, defaultSectionName, {
      type: 'string',
      widgetName: 'widgetname',
    });
    const firstAddedWidgetName = Object.keys(newSchema.formSchema?.properties || {}).filter(
      (key) => key !== 'testSection',
    )[0];

    // Create a widget between the testSection and the widget above
    newSchema = addWidget(newSchema, defaultSectionName, {
      type: 'string',
      widgetName: 'widgetname2',
    });

    const secondlyAddedWidgetName = Object.keys(newSchema.formSchema?.properties || {}).filter(
      (key) => key !== 'testSection' && key !== firstAddedWidgetName,
    )[0];

    expect(
      Object.keys(newSchema.formSchema?.properties?.['testSection'].properties || {}),
    ).toHaveLength(3);
    expect(
      _.isEqual(newSchema.uiSchema?.['ui:order'], [
        defaultSectionName,
        secondlyAddedWidgetName,
        firstAddedWidgetName,
      ]),
    );
    expect(newSchema.uiSchema?.[firstAddedWidgetName]?.['ui:widget'] === 'widgetname');
    expect(newSchema.uiSchema?.[secondlyAddedWidgetName]?.['ui:widget'] === 'widgetname2');
  });
});
