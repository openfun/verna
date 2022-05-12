import React, {
  createContext,
  FormEvent,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  ObjectFieldTemplateProps,
  ISubmitEvent,
  UiSchema,
  Widget,
  FormProps,
} from '@rjsf/core';
import { defaultObjectFieldTemplate, defaultVernaWidgets } from '../templates';
import VernaJSONSchemaType from '../types/rjsf';
import {
  cleanUiSchema,
  getSelectedDefaultValues,
  getSelectedSchema,
  getSelectedUiSchema,
} from '../utils/schema';

function functionNotSet() {
  throw new Error('function context not set');
}

export interface WidgetsType {
  [name: string]: Widget;
}

export interface ObjectFieldTemplateType {
  [name: string]: React.FunctionComponent<ObjectFieldTemplateProps>;
}

export interface VernaContextProps extends Pick<FormProps<unknown>, 'transformErrors'> {
  objectFieldTemplate: ObjectFieldTemplateType;
  configSchema?: VernaJSONSchemaType;
  formData: unknown;
  fullSchema: VernaJSONSchemaType;
  fullUiSchema: UiSchema;
  handleSubmit: <FormData = unknown>(
    callback: (formData: unknown) => void,
  ) => (event: ISubmitEvent<FormData>, nativeEvent: FormEvent<HTMLFormElement>) => void;
  isEditor: boolean;
  schema: VernaJSONSchemaType;
  selectedFormData: unknown;
  selector: string | undefined;
  setFormData: (newDefaultValues: unknown) => void;
  setFullSchema: (newSchema: VernaJSONSchemaType) => void;
  setFullUiSchema: (newUiSchema: UiSchema) => void;
  setSchema: (newSchema: VernaJSONSchemaType) => void;
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
  transformErrors: undefined,
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

interface VernaProviderProps extends Pick<FormProps<unknown>, 'transformErrors'> {
  configSchema?: VernaJSONSchemaType;
  defaultSchema: VernaJSONSchemaType;
  defaultUiSchema: UiSchema;
  defaultFormValues?: any;
  defaultWidgets: WidgetsType;
  objectFieldTemplate: ObjectFieldTemplateType;
  defaultSelector?: string;
  isEditor: boolean;
}

function VernaProvider({
  configSchema,
  children,
  defaultSchema,
  defaultUiSchema,
  defaultFormValues,
  defaultWidgets,
  objectFieldTemplate,
  defaultSelector,
  isEditor,
  transformErrors,
}: PropsWithChildren<VernaProviderProps>) {
  // Both fullSchema & fullUiSchema are not used by the lib itself but may be
  // used for further implementation
  const [fullSchema, setFullSchema] = useState<VernaJSONSchemaType>(defaultSchema);
  const [fullUiSchema, setFullUiSchema] = useState<UiSchema>(
    cleanUiSchema(defaultSchema, defaultUiSchema),
  );

  const [schema, _setSchema] = useState<VernaJSONSchemaType>(
    getSelectedSchema(defaultSchema, defaultSelector),
  );
  const [uiSchema, _setUiSchema] = useState<UiSchema>(
    getSelectedUiSchema(defaultUiSchema, defaultSelector),
  );
  const [formData, setFormData] = useState(
    getSelectedDefaultValues(defaultFormValues, defaultSelector),
  );
  const [widgets, setWidgets] = useState<WidgetsType>({
    ...defaultWidgets,
    ...defaultVernaWidgets,
  });
  const [selector, setSelector] = useState<string | undefined>(defaultSelector);

  // Schema and uiSchema target a part of fullSchema and fullUiSchema selected by the selector
  function setSchema(newSchema: VernaJSONSchemaType) {
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
      setSchema(fullSchema.properties?.[selector] || {});
      setUiSchema(fullUiSchema[selector]);
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
        transformErrors,
        uiSchema,
        widgets,
      }}
    >
      {children}
    </VernaContext.Provider>
  );
}

VernaProvider.defaultProps = {
  defaultSchema: {},
  defaultUiSchema: {},
  defaultValues: {},
  defaultWidgets: {},
  isEditor: false,
  objectFieldTemplate: {},
};

export default VernaProvider;
export { useVerna };
