import { ObjectFieldTemplateProps } from '@rjsf/core';
import React, { useCallback, useReducer } from 'react';
import { type IntlShape } from 'react-intl';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';
import { TranslationType } from ':/types/translations';
import { Maybe, Nullable } from ':/types/utils';
import { ReducerAction, VernaActionsEnum } from ':/types/VernaProvider';
import ShowCaseWidgetProps from ':/types/Widgets';
import { cleanUiSchema, reduceSchema } from ':/utils/schema';

function schemaReducer(state: VernaSchemaType, action: ReducerAction): VernaSchemaType {
  if (action.error) {
    throw new Error('An error happened while applying a modification on the schema.');
  }
  const selector: Maybe<string> = action.meta?.selector;

  if (selector) {
    const reducedSchema: Maybe<VernaSchemaType> = reduceSchema(
      {
        formSchema: state.formSchema?.properties?.[selector],
        translationSchema: state.translationSchema,
        uiSchema: state.uiSchema?.[selector],
      },
      action,
    );
    if (!reducedSchema) throw new Error('Error, something went wrong while modifying the schema');

    return {
      formSchema: {
        ...state.formSchema,
        properties: {
          ...state.formSchema?.properties,
          [selector]: reducedSchema.formSchema || {},
        },
      },
      translationSchema: reducedSchema.translationSchema,
      uiSchema: { ...state.uiSchema, [selector]: reducedSchema.uiSchema },
    };
  }
  return reduceSchema(state, action) || state;
}

interface FormSchemaProps {
  Section: React.FunctionComponent<ObjectFieldTemplateProps>;
  defaultSchema: VernaSchemaType;
  selector: Maybe<string>;
}

interface SchemaReducerValueProperties {
  addVernaSection: (idPreviousSection: Nullable<string>) => void;
  addVernaTranslations: (translations: TranslationType) => void;
  addVernaWidget: (
    idPreviousWidget: string,
    widgetInfos?: ShowCaseWidgetProps,
    intl?: IntlShape,
  ) => void;
  removeVernaProperty: (id: string) => void;
  removeVernaTranslations: (translationToDelete: Maybe<string[]>) => void;
  schema: VernaSchemaType;
  updateVernaProperty: (schema: VernaSchemaType) => void;
  updateWidget: (schema: VernaJSONSchemaType, id: string) => void;
}

export default function useSchemaReducer({
  Section,
  defaultSchema,
  selector,
}: FormSchemaProps): SchemaReducerValueProperties {
  function formatSchema(defaultSchema: VernaSchemaType) {
    return {
      ...defaultSchema,
      uiSchema: cleanUiSchema(
        defaultSchema.formSchema || {},
        defaultSchema.uiSchema || {},
        Section,
      ),
    };
  }

  const [schema, _schemaDispatch] = useReducer(schemaReducer, defaultSchema, formatSchema);

  /**
   * Overload of the schema dispatch to add the selector automatically
   * @param action given to the dispatch
   */
  function schemaDispatch(action: ReducerAction) {
    _schemaDispatch({ ...action, meta: { ...action.meta, selector } });
  }

  const addVernaSection = useCallback(
    (idPreviousSection: Nullable<string>) => {
      schemaDispatch({
        payload: {
          SectionTemplate: Section,
          id: idPreviousSection,
        },
        type: VernaActionsEnum.ADD_SECTION,
      });
    },
    [schema, selector],
  );

  const addVernaWidget = useCallback(
    (idPreviousWidget: string, widgetInfos?: ShowCaseWidgetProps, intl?: IntlShape) => {
      schemaDispatch({
        meta: {
          intl: intl,
        },
        payload: {
          id: idPreviousWidget,
          widgetInfos: widgetInfos,
        },
        type: VernaActionsEnum.ADD_WIDGET,
      });
    },
    [schema, selector],
  );

  const addVernaTranslations = useCallback(
    (translations: TranslationType) => {
      schemaDispatch({
        payload: {
          translations: translations,
        },
        type: VernaActionsEnum.ADD_TRANSLATION,
      });
    },
    [schema, selector],
  );

  const removeVernaProperty = useCallback(
    (id: string) => {
      schemaDispatch({
        payload: {
          id: id,
        },
        type: VernaActionsEnum.REMOVE_PROPERTY,
      });
    },
    [schema, selector],
  );

  const updateVernaProperty = useCallback(
    (schema: VernaSchemaType) => {
      schemaDispatch({
        payload: {
          schema: schema,
        },
        type: VernaActionsEnum.UPDATE_PROPERTY,
      });
    },
    [schema, selector],
  );

  const updateWidget = useCallback(
    (schema: VernaJSONSchemaType, id: string) => {
      schemaDispatch({
        payload: {
          JSONSchema: schema,
          id: id,
        },
        type: VernaActionsEnum.UPDATE_WIDGET,
      });
    },
    [schema, selector],
  );

  const removeVernaTranslations = useCallback(
    (translationToDelete: Maybe<string[]>) => {
      schemaDispatch({
        payload: {
          translationsToDelete: translationToDelete,
        },
        type: VernaActionsEnum.REMOVE_TRANSLATION,
      });
    },
    [schema, selector],
  );

  return {
    addVernaSection,
    addVernaTranslations,
    addVernaWidget,
    removeVernaProperty,
    removeVernaTranslations,
    schema,
    updateVernaProperty,
    updateWidget,
  };
}
