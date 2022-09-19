import _ from 'lodash';
import { VernaSchemaType } from ':/types/rjsf';
import { addTranslations, removeTranslations } from ':/utils/schema/actions/translations';

describe('translations actions', () => {
  it('should be able to add translations from the translation object', async () => {
    const schema: VernaSchemaType = {
      translationSchema: {
        us: {},
      },
    };

    const keyToAdd = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    let newSchema = addTranslations(schema, {
      us: keyToAdd,
    });

    expect(_.isEqual(newSchema.translationSchema?.['us'], keyToAdd)).toBe(true);

    newSchema = addTranslations(newSchema, {
      fr: {
        key5: 'value5',
        key6: 'value6',
      },
      us: {
        key4: 'value4',
      },
    });

    // Check that existing keys are preserved and new ones added
    expect(Object.keys(newSchema.translationSchema?.['us'] || {}).includes('key1')).toBe(true);
    expect(Object.keys(newSchema.translationSchema?.['us'] || {}).includes('key2')).toBe(true);
    expect(Object.keys(newSchema.translationSchema?.['us'] || {}).includes('key3')).toBe(true);
    expect(Object.keys(newSchema.translationSchema?.['us'] || {}).includes('key4')).toBe(true);

    // Check that fr keys are added
    expect(Object.keys(newSchema.translationSchema?.['fr'] || {}).includes('key5')).toBe(true);
    expect(Object.keys(newSchema.translationSchema?.['fr'] || {}).includes('key6')).toBe(true);
  });

  it('should be able to remove translations from the translation object', async () => {
    const schema: VernaSchemaType = {
      translationSchema: {
        de: {
          key6: 'value6',
        },
        fr: {
          key1: 'value1 bis',
          key2: 'value2 bis',
          key4: 'value4',
        },
        us: {
          key1: 'value1',
          key2: 'value2',
          key3: 'value3',
        },
      },
    };

    const newSchema = removeTranslations(schema, ['key1', 'key2', 'key3']);

    // Check that keys that must not be removed are still there
    expect(Object.keys(newSchema.translationSchema?.['de'] || {}).includes('key6')).toBe(true);
    expect(Object.keys(newSchema.translationSchema?.['fr'] || {}).includes('key4')).toBe(true);

    // Check that the key1 key2 key3 are removed from every local
    expect(Object.keys(newSchema.translationSchema?.['fr'] || {}).includes('key1')).toBe(false);
    expect(Object.keys(newSchema.translationSchema?.['fr'] || {}).includes('key2')).toBe(false);
    expect(Object.keys(newSchema.translationSchema?.['us'] || {})).toHaveLength(0);
  });
});
