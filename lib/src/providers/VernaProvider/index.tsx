import React, {
  createContext,
  FormEvent,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type ResolvedIntlConfig } from 'react-intl';
import type {
  ObjectFieldTemplateProps,
  ISubmitEvent,
  UiSchema,
  Widget,
  FormProps,
} from '@rjsf/core';
import type { FieldTemplateProps } from '@rjsf/core';
import { defaultVernaWidgets } from '../../templates';
import VernaJSONSchemaType from '../../types/rjsf';
import {
  cleanUiSchema,
  getSelectedDefaultValues,
  getSelectedSchema,
  getSelectedUiSchema,
} from '../../utils/schema';
import { TranslationType } from '../../types/translations';
import TranslationProvider from '../TranslationProvider';
import { default as DefaultSection } from '../../components/Fields/Section';
import EditorFieldTemplate from '../../components/EditorFieldTemplate';
import {
  default as DefaultDropZone,
  DropZoneProps,
} from '../../components/EditorFieldTemplate/DropZone';

function functionNotSet() {
  throw new Error('function context not set');
}

export interface WidgetsType {
  [name: string]: Widget;
}

export interface VernaContextProps extends Pick<FormProps<unknown>, 'transformErrors'> {
  DropZone: React.FunctionComponent<DropZoneProps>;
  FieldTemplate: React.FunctionComponent<FieldTemplateProps>;
  Section: React.FunctionComponent<ObjectFieldTemplateProps>;
  SubmitButton: React.ReactNode;
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
  setSchemaTranslations: (newSchemaTranslations: TranslationType) => void;
  setSelector: (selector: string | undefined) => void;
  setUiSchema: (newUiSchema: UiSchema) => void;
  setWidgets: (newWidgets: WidgetsType) => void;
  schemaTranslations: TranslationType;
  uiSchema: UiSchema;
  widgets: WidgetsType;
}

const VernaContext = createContext<VernaContextProps>({
  DropZone: DefaultDropZone,
  FieldTemplate: EditorFieldTemplate,
  Section: DefaultSection,
  SubmitButton: undefined,
  configSchema: undefined,
  formData: {},
  fullSchema: {},
  fullUiSchema: {},
  handleSubmit: () => () => functionNotSet(),
  isEditor: false,
  schema: {},
  schemaTranslations: {},
  selectedFormData: {},
  selector: undefined,
  setFormData: () => functionNotSet(),
  setFullSchema: () => functionNotSet(),
  setFullUiSchema: () => functionNotSet(),
  setSchema: () => functionNotSet(),
  setSchemaTranslations: () => functionNotSet(),
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

export interface VernaProviderProps extends Pick<FormProps<unknown>, 'transformErrors'> {
  DropZone: React.FunctionComponent<DropZoneProps>;
  FieldTemplate: React.FunctionComponent<FieldTemplateProps>;
  Section: React.FunctionComponent<ObjectFieldTemplateProps>;
  SubmitButton: React.ReactNode;
  configSchema?: VernaJSONSchemaType;
  defaultFormValues?: any;
  defaultLocale?: string;
  defaultSchema: VernaJSONSchemaType;
  defaultSelector?: string;
  defaultUiSchema: UiSchema;
  defaultWidgets: WidgetsType;
  intl?: ResolvedIntlConfig;
  isEditor: boolean;
  locale?: string;
  translations: TranslationType;
}

function VernaProvider({
  children,
  configSchema,
  defaultFormValues,
  defaultLocale,
  defaultSchema,
  defaultSelector,
  defaultUiSchema,
  defaultWidgets,
  intl,
  isEditor,
  locale,
  SubmitButton,
  DropZone,
  FieldTemplate,
  Section,
  transformErrors,
  translations,
}: PropsWithChildren<VernaProviderProps>) {
  // Both fullSchema & fullUiSchema are not used by the lib itself but may be
  // used for further implementation
  const [fullSchema, setFullSchema] = useState<VernaJSONSchemaType>(defaultSchema);
  const [fullUiSchema, setFullUiSchema] = useState<UiSchema>(
    cleanUiSchema(defaultSchema, defaultUiSchema, Section),
  );

  const [schema, _setSchema] = useState<VernaJSONSchemaType>(
    getSelectedSchema(defaultSchema, defaultSelector),
  );
  const [uiSchema, _setUiSchema] = useState<UiSchema>(
    getSelectedUiSchema(defaultUiSchema, defaultSelector),
  );
  const [schemaTranslations, setSchemaTranslations] = useState<TranslationType>(translations);

  const [formData, setFormData] = useState(
    getSelectedDefaultValues(defaultFormValues, defaultSelector),
  );
  const [widgets, setWidgets] = useState<WidgetsType>({
    ...defaultWidgets,
    ...defaultVernaWidgets,
  });
  const [selector, setSelector] = useState<string | undefined>(defaultSelector);

  const selectedFormData = useMemo(() => {
    return selector && formData ? formData[selector] : formData;
  }, [formData, selector]);

  // Schema and uiSchema target a part of fullSchema and fullUiSchema selected by the selector
  function setSchema(newSchema: VernaJSONSchemaType) {
    _setSchema(newSchema);
    if (!selector) {
      setFullSchema(newSchema);
      return;
    }
    const newFullSchema = { ...fullSchema };
    if (newFullSchema['properties']) {
      newFullSchema.properties[selector] = newSchema;
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

  function handleSubmit<FormData = unknown>(callback?: (formData: unknown) => void) {
    return (event: ISubmitEvent<FormData>, nativeEvent: FormEvent<HTMLFormElement>) => {
      const newFormData = selector ? { ...formData, [selector]: event.formData } : event.formData;
      nativeEvent.stopPropagation();
      nativeEvent.preventDefault();
      setFormData(newFormData);
      callback && callback(newFormData);
    };
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

  return (
    <TranslationProvider
      defaultLocale={defaultLocale}
      intl={intl}
      locale={locale}
      schemaTranslations={schemaTranslations}
    >
      <VernaContext.Provider
        value={{
          DropZone: DropZone,
          FieldTemplate: FieldTemplate,
          Section: Section,
          SubmitButton: SubmitButton,
          configSchema,
          formData,
          fullSchema,
          fullUiSchema,
          handleSubmit,
          isEditor,
          schema,
          schemaTranslations,
          selectedFormData,
          selector,
          setFormData,
          setFullSchema,
          setFullUiSchema,
          setSchema,
          setSchemaTranslations,
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
    </TranslationProvider>
  );
}

VernaProvider.defaultProps = {
  DropZone: DefaultDropZone,
  FieldTemplate: EditorFieldTemplate,
  Section: DefaultSection,
  SubmitButton: undefined,
  defaultSchema: {},
  defaultUiSchema: {},
  defaultValues: {},
  defaultWidgets: {},
  isEditor: false,
  objectFieldTemplate: {},
  translations: {},
};

export default VernaProvider;
export { useVerna };
