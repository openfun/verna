import * as React from 'react';
import { PropsWithChildren, useState } from 'react';
import { JSONSchema7 } from 'json-schema';
import type { UiSchema, Widget } from '@rjsf/core';

function functionNotSet() {
  throw new Error('function context not set');
}

export interface WidgetType {
  [name: string]: Widget;
}

interface VernaContextProps {
  schema: JSONSchema7;
  setSchema: (newSchema: JSONSchema7) => void;
  uiSchema: UiSchema;
  setUiSchema: (newUiSchema: UiSchema) => void;
  widgets: WidgetType;
  setWidgets: (newWidgets: WidgetType) => void;
  readOnly: boolean;
  setReadOnly: (newMode: boolean) => void;
}

const VernaContext = React.createContext<VernaContextProps>({
  schema: {},
  setSchema: () => functionNotSet(),
  uiSchema: {},
  setUiSchema: () => functionNotSet(),
  widgets: {},
  setWidgets: () => functionNotSet(),
  readOnly: true,
  setReadOnly: () => functionNotSet(),
});

function useVerna() {
  const context = React.useContext(VernaContext);
  if (!context) {
    throw new Error('UseVerna must be used within a VernaContextProvider');
  }
  return context;
}

interface VernaContextProviderProps {
  defaultSchema: JSONSchema7;
  defaultUiSchema: UiSchema;
  defaultWidget: WidgetType;
  defaultReadOnly: boolean;
}

function genDefaultUiSchema(schema: JSONSchema7, uiSchema: UiSchema) {
  if (uiSchema['ui:order']) return uiSchema;
  const defaultUi: UiSchema = {
    ...uiSchema,
    'ui:order': Object.keys(schema.properties || {}),
  };
  Object.entries(schema.properties || {}).forEach(([key, prop]) => {
    const schemaElement = prop as JSONSchema7;
    if (schemaElement.properties) {
      defaultUi[key] = {
        ...uiSchema?.[key],
        'ui:order': Object.keys(schemaElement.properties || {}),
      };
    }
  });
  return defaultUi;
}

function VernaContextProvider({
  defaultSchema,
  defaultUiSchema,
  defaultWidget,
  defaultReadOnly,
  children,
}: PropsWithChildren<VernaContextProviderProps>) {
  const [schema, setSchema] = useState<JSONSchema7>(defaultSchema);
  const [uiSchema, setUiSchema] = useState<UiSchema>(
    genDefaultUiSchema(defaultSchema, defaultUiSchema),
  );
  const [readOnly, setReadOnly] = useState<boolean>(defaultReadOnly);
  const [widgets, setWidgets] = useState<WidgetType>(defaultWidget);

  return (
    <VernaContext.Provider
      value={{
        schema,
        setSchema,
        uiSchema,
        setUiSchema,
        widgets,
        setWidgets,
        readOnly,
        setReadOnly,
      }}
    >
      {children}
    </VernaContext.Provider>
  );
}

VernaContextProvider.defaultProps = {
  defaultSchema: {},
  defaultUiSchema: {},
  defaultWidget: {},
  defaultReadOnly: false,
};

export { VernaContextProvider, useVerna };
