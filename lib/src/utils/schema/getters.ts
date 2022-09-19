/**
 * Get the default values used by the library, if there is a selector specified it will
 * return only the part needed
 * */
import { Maybe } from ':/types/utils';

export function getSelectedDefaultValues(
  defaultValues: Record<string, unknown>,
  defaultSelector: Maybe<string>,
) {
  if (defaultSelector && defaultValues) return defaultValues[defaultSelector];
  return defaultValues;
}
