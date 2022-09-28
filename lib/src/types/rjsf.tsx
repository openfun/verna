import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import { TranslationType } from ':/types/translations';

export type RJSFPropertiesType = {
  [key: string]: VernaJSONSchemaType;
};

type VernaJSONSchemaType = Omit<JSONSchema7, 'properties' | 'items' | 'enum'> & {
  properties?: RJSFPropertiesType;
  items?: VernaJSONSchemaType | VernaJSONSchemaType[];
  enum?: string[];
};

export type VernaSchemaType = {
  formSchema?: VernaJSONSchemaType;
  uiSchema?: UiSchema;
  translationSchema?: TranslationType;
};

export default VernaJSONSchemaType;
