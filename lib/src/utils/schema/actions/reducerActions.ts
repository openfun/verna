import { VernaSchemaType } from ':/types/rjsf';
import { ReducerAction, VernaActionsEnum } from ':/types/VernaProvider';
import {
  addSection,
  addTranslations,
  addWidget,
  updateSchema,
  removeProperty,
  removeTranslations,
  updateWidget,
} from ':/utils/schema';

/**
 * Switch actions given to the dispatch of the schema
 *
 * @param schema initial schema
 * @param action object defined in src/types/VernaProvider.tsx
 */
export function reduceSchema(schema: VernaSchemaType, action: ReducerAction) {
  switch (action.type) {
    case VernaActionsEnum.ADD_SECTION:
      return addSection(schema, action.payload.id!, action.payload.SectionTemplate);
    case VernaActionsEnum.ADD_WIDGET:
      return addWidget(schema, action.payload.id!, action.payload.widgetInfos!);
    case VernaActionsEnum.UPDATE_PROPERTY:
      return updateSchema(schema, action.payload.schema!);
    case VernaActionsEnum.UPDATE_WIDGET:
      return updateWidget(schema, action.payload.JSONSchema!, action.payload.id!);
    case VernaActionsEnum.REMOVE_PROPERTY:
      return removeProperty(schema, action.payload.id!);
    case VernaActionsEnum.ADD_TRANSLATION:
      return addTranslations(schema, action.payload.translations);
    case VernaActionsEnum.REMOVE_TRANSLATION:
      return removeTranslations(schema, action.payload.translationsToDelete!);
    default:
      return schema;
  }
}
