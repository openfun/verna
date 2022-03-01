import { JSONSchema7 } from 'json-schema';
import type { UiSchema } from '@rjsf/core';

export default interface JSONGlobalSchema {
  schema: JSONSchema7;
  uiSchema: UiSchema;
}
