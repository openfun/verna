import React, {
  createContext,
  FormEvent,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { JSONSchema7 } from 'json-schema';
import type { ObjectFieldTemplateProps, ISubmitEvent, UiSchema, Widget } from '@rjsf/core';
import {
  genDefaultUiSchema,
  getDefaultValues,
  getSelectedSchema,
  getSelectedUiSchema,
} from './DataProcessingMethods';
import { defaultObjectFieldTemplate, defaultVernaWidgets } from '../templates';

function functionNotSet() {
  throw new Error('function context not set');
}

export interface WidgetsType {
  [name: string]: Widget;
}

export interface ObjectFieldTemplateType {
  [name: string]: React.FunctionComponent<ObjectFieldTemplateProps>;
}

export interface VernaContextProps {
  objectFieldTemplate: ObjectFieldTemplateType;
  configSchema?: JSONSchema7;
  formData: unknown;
  fullSchema: JSONSchema7;
  fullUiSchema: UiSchema;
  handleSubmit: <FormData = unknown>(
    callback: (formData: unknown) => void,
  ) => (event: ISubmitEvent<FormData>, nativeEvent: FormEvent<HTMLFormElement>) => void;
  isEditor: boolean;
  schema: JSONSchema7;
  selectedFormData: unknown;
  selector: string | undefined;
  setFormData: (newDefaultValues: unknown) => void;
  setFullSchema: (newSchema: JSONSchema7) => void;
  setFullUiSchema: (newUiSchema: UiSchema) => void;
  setSchema: (newSchema: JSONSchema7) => void;
  setSelector: (selector: string | undefined) => void;
  setUiSchema: (newUiSchema: UiSchema) => void;
  setWidgets: (newWidgets: WidgetsType) => void;
  uiSchema: UiSchema;
  widgets: WidgetsType;
}

const VernaContext = createContext<VernaContextProps>({
  configSchema: undefined,
  formData: {},
  fullSchema: {},
  fullUiSchema: {},
  handleSubmit: () => () => functionNotSet(),
  isEditor: false,
  objectFieldTemplate: {},
  schema: {},
  selectedFormData: {},
  selector: undefined,
  setFormData: () => functionNotSet(),
  setFullSchema: () => functionNotSet(),
  setFullUiSchema: () => functionNotSet(),
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
  configSchema?: JSONSchema7;
  defaultSchema: JSONSchema7;
  defaultUiSchema: UiSchema;
  defaultFormValues?: any;
  defaultWidgets: WidgetsType;
  objectFieldTemplate: ObjectFieldTemplateType;
  defaultSelector?: string;
  isEditor: boolean;
}

function VernaContextProvider({
  configSchema,
  defaultSchema,
  defaultUiSchema,
  defaultFormValues,
  defaultWidgets,
  objectFieldTemplate,
  defaultSelector,
  isEditor,
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
  const [widgets, setWidgets] = useState<WidgetsType>({
    ...defaultWidgets,
    ...defaultVernaWidgets,
  });
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
    return (event: ISubmitEvent<FormData>, nativeEvent: FormEvent<HTMLFormElement>) => {
      const newFormData = selector ? { ...formData, [selector]: event.formData } : event.formData;
      nativeEvent.stopPropagation();
      nativeEvent.preventDefault();
      setFormData(newFormData);
      callback && callback(newFormData);
    };
  }

  return (
    <VernaContext.Provider
      value={{
        configSchema,
        formData,
        fullSchema,
        fullUiSchema,
        handleSubmit,
        isEditor,
        objectFieldTemplate: { ...defaultObjectFieldTemplate, ...objectFieldTemplate },
        schema,
        selectedFormData,
        selector,
        setFormData,
        setFullSchema,
        setFullUiSchema,
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
  defaultSchema: {},
  defaultUiSchema: {},
  defaultValues: {},
  defaultWidgets: {},
  isEditor: false,
  objectFieldTemplate: {},
};

export { VernaContextProvider, useVerna };
