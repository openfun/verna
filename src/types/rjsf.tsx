import { JSONSchema7 } from 'json-schema';

type VernaJSONSchemaType = Omit<JSONSchema7, 'properties'> & {
  properties?: {
    [key: string]: VernaJSONSchemaType;
  };
};

export default VernaJSONSchemaType;
