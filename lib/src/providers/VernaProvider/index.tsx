import type {
  FieldTemplateProps,
  FormProps,
  ISubmitEvent,
  ObjectFieldTemplateProps,
  Widget,
} from '@rjsf/core';
import React, {
  createContext,
  FormEvent,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { type ResolvedIntlConfig } from 'react-intl';
import EditorFieldTemplate from ':/components/EditorFieldTemplate';
import DropZone, {
  DropZoneOverloadProps,
  DropZoneProps,
} from ':/components/EditorFieldTemplate/DropZone';
import { default as DefaultSection } from ':/components/Fields/Section';
import TranslationProvider from ':/providers/TranslationProvider';
import useSchemaReducer from ':/reducers/useSchemaReducer';
import { defaultVernaWidgets } from ':/templates';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';
import { TranslationType } from ':/types/translations';
import { Maybe } from ':/types/utils';
import ShowCaseWidgetProps from ':/types/Widgets';
import { getSelectedDefaultValues } from ':/utils/schema';

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
  addVernaSection: (idPreviousSection: string) => void;
  addVernaTranslations: (translations: TranslationType) => void;
  addVernaWidget: (idPreviousWidget: string, widgetInfos?: ShowCaseWidgetProps) => void;
  configSchema?: VernaJSONSchemaType;
  formData: unknown;
  handleSubmit: <FormData = unknown>(
    callback: (formData: unknown) => void,
  ) => (event: ISubmitEvent<FormData>, nativeEvent: FormEvent<HTMLFormElement>) => void;
  isEditor: boolean;
  removeVernaTranslations: (translationToDelete: Maybe<string[]>) => void;
  removeVernaProperty: (id: string) => void;
  schema: VernaSchemaType;
  selectedFormData: unknown;
  selector: string | undefined;
  setFormData: (newDefaultValues: unknown) => void;
  setSelector: (selector: string | undefined) => void;
  setWidgets: (newWidgets: WidgetsType) => void;
  updateVernaProperty: (schema: VernaSchemaType) => void;
  updateWidget: (schema: VernaJSONSchemaType, id: string) => void;
  widgets: WidgetsType;
}

const VernaContext = createContext<VernaContextProps>({
  DropZone: DropZone,
  FieldTemplate: EditorFieldTemplate,
  Section: DefaultSection,
  SubmitButton: undefined,
  addVernaSection: () => functionNotSet(),
  addVernaTranslations: () => functionNotSet(),
  addVernaWidget: () => functionNotSet(),
  configSchema: undefined,
  formData: {},
  handleSubmit: () => () => functionNotSet(),
  isEditor: false,
  removeVernaProperty: () => functionNotSet(),
  removeVernaTranslations: () => functionNotSet(),
  schema: {
    formSchema: {},
    translationSchema: {},
    uiSchema: {},
  },
  selectedFormData: {},
  selector: undefined,
  setFormData: () => functionNotSet(),
  setSelector: () => functionNotSet(),
  setWidgets: () => functionNotSet(),
  transformErrors: undefined,
  updateVernaProperty: () => functionNotSet(),
  updateWidget: () => functionNotSet(),
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
  DropZone: React.FunctionComponent<DropZoneOverloadProps>;
  FieldTemplate: React.FunctionComponent<FieldTemplateProps>;
  Section: React.FunctionComponent<ObjectFieldTemplateProps>;
  SubmitButton: React.ReactNode;
  configSchema?: VernaJSONSchemaType;
  defaultSchema: VernaSchemaType;
  defaultFormValues?: any;
  defaultLocale?: string;
  defaultSelector?: string;
  defaultWidgets: WidgetsType;
  intl?: ResolvedIntlConfig;
  isEditor: boolean;
  locale?: string;
}

function VernaProvider({
  children,
  configSchema,
  defaultFormValues,
  defaultLocale,
  defaultSchema,
  defaultSelector,
  defaultWidgets,
  intl,
  isEditor,
  locale,
  SubmitButton,
  DropZone: DropZoneRender,
  FieldTemplate,
  Section,
  transformErrors,
}: PropsWithChildren<VernaProviderProps>) {
  const [selector, setSelector] = useState<string | undefined>(defaultSelector);
  const { schema, ...dispatchers } = useSchemaReducer({
    Section,
    defaultSchema,
    selector,
  });
  const [formData, setFormData] = useState(
    getSelectedDefaultValues(defaultFormValues, defaultSelector),
  );
  const [widgets, setWidgets] = useState<WidgetsType>({
    ...defaultWidgets,
    ...defaultVernaWidgets,
  });

  const selectedFormData = useMemo(() => {
    return selector && formData ? (formData as Record<string, unknown>)[selector] : formData;
  }, [formData, selector]);

  function handleSubmit<FormData = unknown>(callback?: (formData: unknown) => void) {
    return (event: ISubmitEvent<FormData>, nativeEvent: FormEvent<HTMLFormElement>) => {
      const newFormData = selector
        ? { ...(formData as Object), [selector]: event.formData }
        : event.formData;
      nativeEvent.stopPropagation();
      nativeEvent.preventDefault();
      setFormData(newFormData);
      callback && callback(newFormData);
    };
  }

  return (
    <TranslationProvider
      defaultLocale={defaultLocale}
      intl={intl}
      locale={locale}
      schemaTranslations={schema.translationSchema}
    >
      <VernaContext.Provider
        value={{
          DropZone: (props: DropZoneProps) => <DropZone render={DropZoneRender} {...props} />,
          FieldTemplate: FieldTemplate,
          Section: Section,
          SubmitButton: SubmitButton,
          configSchema,
          formData,
          handleSubmit,
          isEditor,
          schema,
          selectedFormData,
          selector,
          setFormData,
          setSelector,
          setWidgets,
          transformErrors,
          widgets,
          ...dispatchers,
        }}
      >
        {children}
      </VernaContext.Provider>
    </TranslationProvider>
  );
}

VernaProvider.defaultProps = {
  DropZone: undefined,
  FieldTemplate: EditorFieldTemplate,
  Section: DefaultSection,
  SubmitButton: undefined,
  defaultSchema: {
    formSchema: {},
    translationSchema: {},
    uiSchema: {},
  },
  defaultValues: {},
  defaultWidgets: {},
  isEditor: false,
  objectFieldTemplate: {},
};

export default VernaProvider;
export { useVerna };
