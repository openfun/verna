import { VernaSchemaType } from '@openfun/verna/dist/types/rjsf';
import { translationsFactory } from './translations';

/**
 * This list of objects contains the schemas of the forms displayed for each poll
 *
 * The formSchema is the structure of the schema with the validation conditions
 * The translationSchema contains the translations of the corresponding schema
 * The UiSchema is linked to the formSchema and add information about the render information, like
 * the type of widget and the order of display
 */
/* eslint-disable max-len*/
const schemaForms: VernaSchemaType[] = [
  {
    formSchema: {
      properties: {
        '335df376-9357-42ca-baa4-6159faba0534': {
          description: 'root_335df376-9357-42ca-baa4-6159faba0534_description',
          properties: {
            '90c8ba81-7624-4be4-93cd-74b05353b5aa': {
              maximum: 150,
              minimum: 3,
              title:
                'root_335df376-9357-42ca-baa4-6159faba0534_90c8ba81-7624-4be4-93cd-74b05353b5aa_title',
              type: 'number',
            },
          },
          title: 'root_335df376-9357-42ca-baa4-6159faba0534_title',
          type: 'object',
        },
      },
      type: 'object',
    },
    translationSchema: translationsFactory({
      'en-US': {
        'root_335df376-9357-42ca-baa4-6159faba0534_90c8ba81-7624-4be4-93cd-74b05353b5aa_title':
          'Age',
        'root_335df376-9357-42ca-baa4-6159faba0534_description': 'Required information.',
        'root_335df376-9357-42ca-baa4-6159faba0534_title': 'Legal information',
      },
      'fr-FR': {
        'root_335df376-9357-42ca-baa4-6159faba0534_90c8ba81-7624-4be4-93cd-74b05353b5aa_title':
          'Age',
        'root_335df376-9357-42ca-baa4-6159faba0534_description':
          'Informations requises pour votre dossier.',
        'root_335df376-9357-42ca-baa4-6159faba0534_title': 'Informations légales.',
      },
    }),
    uiSchema: {
      '335df376-9357-42ca-baa4-6159faba0534': {
        '90c8ba81-7624-4be4-93cd-74b05353b5aa': {
          'ui:widget': 'numberWidget',
        },
        'ui:order': ['90c8ba81-7624-4be4-93cd-74b05353b5aa'],
      },
      'ui:order': ['335df376-9357-42ca-baa4-6159faba0534'],
    },
  },
  {
    formSchema: {
      properties: {
        '325zf376-9157-23ca-baa4-625da7ba0201': {
          description: 'root_325zf376-9157-23ca-baa4-625da7ba0201_description',
          properties: {
            '82d8ba81-a324-g2e4-25cd-14b25353b561': {
              enum: [
                'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_0',
                'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_1',
                'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_2',
              ],
              title:
                'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_title',
              type: 'string',
            },
            '57030122-ce1b-4e19-839d-a359a6e6b843': {
              title:
                'root_325zf376-9157-23ca-baa4-625da7ba0201_57030122-ce1b-4e19-839d-a359a6e6b843_title',
              type: 'string',
            },
          },
          title: 'root_325zf376-9157-23ca-baa4-625da7ba0201_title',
          type: 'object',
        },
      },
      type: 'object',
    },
    translationSchema: translationsFactory({
      'en-US': {
        'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_0':
          'Français',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_1':
          'English',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_2':
          'Dutch',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_title':
          'Native language',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_57030122-ce1b-4e19-839d-a359a6e6b843_title':
          'Secondary language',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_description':
          'Informations on your language aptitudes.',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_title': 'Language',
      },
      'fr-FR': {
        'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_0':
          'Français',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_1':
          'English',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_enum_2':
          'Dutch',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_82d8ba81-a324-g2e4-25cd-14b25353b561_title':
          'Langue natale',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_57030122-ce1b-4e19-839d-a359a6e6b843_title':
          'Langue secondaire',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_description':
          'informations sur vos compétences linguistiques.',
        'root_325zf376-9157-23ca-baa4-625da7ba0201_title': 'Langage',
      },
    }),
    uiSchema: {
      '325zf376-9157-23ca-baa4-625da7ba0201': {
        '82d8ba81-a324-g2e4-25cd-14b25353b561': {
          'ui:widget': 'selectWidget',
        },
        '57030122-ce1b-4e19-839d-a359a6e6b843': {
          'ui:widget': 'textWidget',
        },
        'ui:order': [
          '82d8ba81-a324-g2e4-25cd-14b25353b561',
          '57030122-ce1b-4e19-839d-a359a6e6b843',
        ],
      },
      'ui:order': ['325zf376-9157-23ca-baa4-625da7ba0201'],
    },
  },
];

export { schemaForms };
