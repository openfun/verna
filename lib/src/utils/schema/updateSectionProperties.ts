import { VernaContextProps } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { VernaSchemaType } from ':/types/rjsf';
import { Maybe } from ':/types/utils';

export interface SectionParameters {
  title?: string;
  description?: string;
}

export function updateSectionProperties(
  formData: SectionParameters,
  verna: VernaContextProps,
  id: string,
  locale: string,
) {
  let schemaUpdate: Maybe<VernaSchemaType>;

  if (id === 'root') {
    if (verna.selector) {
      schemaUpdate = {
        formSchema: {
          description: [id, verna.selector, 'description'].join(RJSF_ID_SEPARATOR),
          title: [id, verna.selector, 'title'].join(RJSF_ID_SEPARATOR),
        },
        translationSchema: {
          [locale]: {
            [[id, verna.selector, 'description'].join(RJSF_ID_SEPARATOR)]:
              formData['description'] || '',
            [[id, verna.selector, 'title'].join(RJSF_ID_SEPARATOR)]: formData['title'] || '',
          },
        },
      };
    } else {
      schemaUpdate = {
        formSchema: {
          description: [id, 'description'].join(RJSF_ID_SEPARATOR),
          title: [id, 'title'].join(RJSF_ID_SEPARATOR),
        },
        translationSchema: {
          [locale]: {
            [[id, 'description'].join(RJSF_ID_SEPARATOR)]: formData['description'] || '',
            [[id, 'title'].join(RJSF_ID_SEPARATOR)]: formData['title'] || '',
          },
        },
      };
    }
  } else {
    const sectionName = id.split(RJSF_ID_SEPARATOR)[1];

    schemaUpdate = {
      formSchema: {
        properties: {
          [sectionName]: {
            description: [id, sectionName, 'description'].join(RJSF_ID_SEPARATOR),
            title: [id, sectionName, 'title'].join(RJSF_ID_SEPARATOR),
          },
        },
      },
      translationSchema: {
        [locale]: {
          [[id, sectionName, 'description'].join(RJSF_ID_SEPARATOR)]: formData['description'] || '',
          [[id, sectionName, 'title'].join(RJSF_ID_SEPARATOR)]: formData['title'] || '',
        },
      },
    };
  }

  verna.updateVernaProperty(schemaUpdate);
}
