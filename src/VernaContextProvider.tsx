import { createContext, useContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { JSONSchema7 } from 'json-schema';
import type { UiSchema, Widget } from '@rjsf/core';
import type { ISubmitEvent } from '@rjsf/core';

function functionNotSet() {
  throw new Error('function context not set');
}

export interface WidgetsType {
  [name: string]: Widget;
}

interface VernaContextProps {
  fullSchema: JSONSchema7;
  setFullSchema: (newSchema: JSONSchema7) => void;
  fullUiSchema: UiSchema;
  setFullUiSchema: (newUiSchema: UiSchema) => void;
  schema: JSONSchema7;
  setSchema: (newSchema: JSONSchema7) => void;
  handleSubmit: <FormData = unknown>(
    callback: (formData: unknown) => void,
  ) => (event: ISubmitEvent<FormData>) => void;
  selectedFormData: unknown;
  uiSchema: UiSchema;
  setUiSchema: (newUiSchema: UiSchema) => void;
  formData: unknown;
  setFormData: (newDefaultValues: unknown) => void;
  widgets: WidgetsType;
  setWidgets: (newWidgets: WidgetsType) => void;
  readOnly: boolean;
  setReadOnly: (newMode: boolean) => void;
  selector: string | undefined;
  setSelector: (selector: string | undefined) => void;
}

const VernaContext = createContext<VernaContextProps>({
  formData: {},
  fullSchema: {},
  fullUiSchema: {},
  handleSubmit: () => () => functionNotSet(),
  readOnly: true,
  schema: {},
  selectedFormData: {},
  selector: undefined,
  setFormData: () => functionNotSet(),
  setFullSchema: () => functionNotSet(),
  setFullUiSchema: () => functionNotSet(),
  setReadOnly: () => functionNotSet(),
  setSchema: () => functionNotSet(),
  setSelector: () => functionNotSet(),
  setUiSchema: () => functionNotSet(),
  setWidgets: () => functionNotSet(),
  uiSchema: {},
  widgets: {},
});

function useVerna() {
  const context = useContext(VernaContext);
  if (!context) {
    throw new Error('UseVerna must be used within a VernaContextProvider');
  }
  return context;
}

interface VernaContextProviderProps {
  defaultSchema: JSONSchema7;
  defaultUiSchema: UiSchema;
  defaultFormValues?: any;
  defaultWidgets: WidgetsType;
  defaultReadOnly: boolean;
  defaultSelector?: string;
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

function getSelectedSchema(
  defaultSchema: JSONSchema7,
  defaultSelector: string | undefined,
): JSONSchema7 {
  if (defaultSelector && defaultSchema?.properties?.[defaultSelector]) {
    return defaultSchema.properties[defaultSelector] as JSONSchema7;
  }
  return defaultSchema;
}

function getSelectedUiSchema(
  defaultUiSchema: UiSchema,
  defaultSelector: string | undefined,
): UiSchema {
  if (defaultSelector && defaultUiSchema?.[defaultSelector]) {
    return defaultUiSchema[defaultSelector];
  }
  return defaultUiSchema;
}

function getDefaultValues(defaultValues: any, defaultSelector: string | undefined) {
  if (defaultSelector && defaultValues) return defaultValues[defaultSelector];
  return defaultValues;
}

function VernaContextProvider({
  defaultSchema,
  defaultUiSchema,
  defaultFormValues,
  defaultWidgets,
  defaultReadOnly,
  defaultSelector,
  children,
}: PropsWithChildren<VernaContextProviderProps>) {
  // The full schemas are not used by the lib itself but may be used for further implementation
  const [fullSchema, setFullSchema] = useState<JSONSchema7>(defaultSchema);
  const [fullUiSchema, setFullUiSchema] = useState<UiSchema>(
    genDefaultUiSchema(defaultSchema, defaultUiSchema),
  );
  const [schema, _setSchema] = useState<JSONSchema7>(
    getSelectedSchema(defaultSchema, defaultSelector),
  );
  const [uiSchema, _setUiSchema] = useState<UiSchema>(
    getSelectedUiSchema(defaultUiSchema, defaultSelector),
  );
  const [formData, setFormData] = useState(getDefaultValues(defaultFormValues, defaultSelector));
  const [readOnly, setReadOnly] = useState<boolean>(defaultReadOnly);
  const [widgets, setWidgets] = useState<WidgetsType>(defaultWidgets);
  const [selector, setSelector] = useState<string | undefined>(defaultSelector);

  // Schema and uiSchema target a part of fullSchema and fullUiSchema selected by the selector
  function setSchema(newSchema: JSONSchema7) {
    if (!selector) {
      setFullSchema(newSchema);
      return;
    }
    const newFullSchema = { ...fullSchema };
    if (newFullSchema['properties']) {
      newFullSchema.properties[selector] = newSchema;
      _setSchema(newSchema);
    }
    setFullSchema(newFullSchema);
  }

  function setUiSchema(newUiSchema: UiSchema) {
    if (!selector) {
      setFullUiSchema(newUiSchema);
      _setUiSchema(newUiSchema);
      return;
    }
    const newFullUiSchema = { ...fullUiSchema };
    newFullUiSchema[selector] = newUiSchema;
    _setUiSchema(newUiSchema);
    setFullUiSchema(newFullUiSchema);
  }

  useEffect(() => {
    if (selector) {
      if (fullSchema['properties']) setSchema(fullSchema['properties'][selector] as JSONSchema7);
      if (fullUiSchema) setUiSchema(fullUiSchema[selector]);
    } else {
      _setSchema(fullSchema);
      _setUiSchema(fullUiSchema);
    }
  }, [selector]);

  const selectedFormData = useMemo(() => {
    return selector && formData ? formData[selector] : formData;
  }, [formData, selector]);

  function handleSubmit<FormData = unknown>(callback?: (formData: unknown) => void) {
    return (event: ISubmitEvent<FormData>) => {
      const newFormData = { ...formData };
      if (selector) newFormData[selector] = event.formData;
      setFormData(newFormData);
      callback && callback(newFormData);
    };
  }

  return (
    <VernaContext.Provider
      value={{
        formData,
        fullSchema,
        fullUiSchema,
        handleSubmit,
        readOnly,
        schema,
        selectedFormData,
        selector,
        setFormData,
        setFullSchema,
        setFullUiSchema,
        setReadOnly,
        setSchema,
        setSelector,
        setUiSchema,
        setWidgets,
        uiSchema,
        widgets,
      }}
    >
      {children}
    </VernaContext.Provider>
  );
}

VernaContextProvider.defaultProps = {
  defaultReadOnly: false,
  defaultSchema: {},
  defaultUiSchema: {},
  defaultValues: {},
  defaultWidgets: {},
};

export { VernaContextProvider, useVerna };
