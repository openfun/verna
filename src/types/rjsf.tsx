import { JSONSchema7 } from 'json-schema';

type VernaJSONSchemaType = Omit<JSONSchema7, 'properties' | 'items'> & {
  properties?: {
    [key: string]: VernaJSONSchemaType;
  };
  items?: VernaJSONSchemaType | VernaJSONSchemaType[];
};

export default VernaJSONSchemaType;
