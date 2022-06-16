import { JSONSchema7 } from 'json-schema';

export type RJSFPropertiesType = {
  [key: string]: VernaJSONSchemaType;
};

type VernaJSONSchemaType = Omit<JSONSchema7, 'properties' | 'items' | 'enum'> & {
  properties?: RJSFPropertiesType;
  items?: VernaJSONSchemaType | VernaJSONSchemaType[];
  enum?: string[];
};

export default VernaJSONSchemaType;
