import { vernaSchemaFactory } from ':/tests/mocks/factories';
import { updateSchema, updateWidget } from ':/utils/schema';

describe('update schema actions', () => {
  const defaultSchema = vernaSchemaFactory();

  it('should be able to update values of the schema', async () => {
    const newSchema = updateSchema(defaultSchema, {
      formSchema: {
        properties: {
          testSection: {
            properties: {
              field1: {
                description: 'root_testSection_field1_description',
              },
            },
            type: 'object',
          },
        },
      },
      translationSchema: {
        us: {
          root_testSection_description: 'description',
        },
      },
    });

    expect(
      newSchema.formSchema?.properties?.['testSection']?.properties?.['field1']?.description,
    ).toEqual('root_testSection_field1_description');
    expect(
      newSchema.formSchema?.properties?.['testSection']?.properties?.['field1']?.title,
    ).toEqual('root_testSection_field1_title');
  });

  it('should be able to update values of the widget', async () => {
    let newSchema = updateWidget(
      defaultSchema,
      {
        description: 'desc',
        enum: ['option1', 'option2', 'option3'],
        title: 'title',
      },
      'root_testSection_field1',
    );
    expect(
      newSchema.formSchema?.properties?.['testSection']?.properties?.['field1']?.description,
    ).toEqual('desc');
    expect(
      newSchema.formSchema?.properties?.['testSection']?.properties?.['field1']?.title,
    ).toEqual('title');
    expect(newSchema.formSchema?.properties?.['testSection']?.properties?.['field1']?.enum).toEqual(
      ['option1', 'option2', 'option3'],
    );

    newSchema = updateWidget(
      newSchema,
      {
        description: 'desc',
        enum: ['option1 bis', 'option3 bis'],
        title: 'title bis',
      },
      'root_testSection_field1',
    );
    expect(
      newSchema.formSchema?.properties?.['testSection']?.properties?.['field1']?.description,
    ).toEqual('desc');
    expect(
      newSchema.formSchema?.properties?.['testSection']?.properties?.['field1']?.title,
    ).toEqual('title bis');
    expect(newSchema.formSchema?.properties?.['testSection']?.properties?.['field1']?.enum).toEqual(
      ['option1 bis', 'option3 bis'],
    );
  });
});
