import { VernaForm, useVerna, VernaToolbar, VERNA_SUPPORTED_LOCALES } from '@openfun/verna';
import { VernaSchemaType } from '@openfun/verna/dist/types/rjsf';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Select, Text, Tip } from 'grommet';
import { CircleInformation, StatusGood } from 'grommet-icons';
import _ from 'lodash';
import { useEffect, useState, useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import CheckboxesWidget from '../../widgetToolbarItems/CheckboxesWidget';
import CheckboxWidget from '../../widgetToolbarItems/CheckboxWidget';
import NumberWidget from '../../widgetToolbarItems/NumberWidget';
import SelectWidget from '../../widgetToolbarItems/SelectWidget';
import TextareaWidget from '../../widgetToolbarItems/TextareaWidget';
import TextWidget from '../../widgetToolbarItems/TextWidget';
import Poll from '../Poll/Poll';
import { getSchemas } from ':/api/fakeapi';
import updateStatsFromData from ':/components/FormWrapper/statsUpdaters';
import { useDnd } from ':/providers/DragAndDropProvider';
import { useLocale } from ':/providers/LocaleProvider';
import { useStatsProvider } from ':/providers/StatsProvider';

interface FormWrapperProps {
  setIsEditor: (newValue: boolean) => void;
}

export enum FormStatusEnum {
  neutral,
  completed,
}

const messages = defineMessages({
  dndInfos: {
    defaultMessage: 'You can drag the fields below and drop them in the form to add new questions.',
    description: 'Message displayed for information on how to use the drag and drop of questions',
    id: 'FormWrapper.dndInfos',
  },
  error: {
    defaultMessage: 'Error, please fill the form correctly',
    description: 'Message displayed at the bottom when the form is in error',
    id: 'FormWrapper.error',
  },
  goBack: {
    defaultMessage: 'Go back',
    description: 'Label of the button to go back to previous page',
    id: 'FormWrapper.goBack',
  },
  resetData: {
    defaultMessage: 'Reset form data',
    description: 'Label of the button to reset local storage data',
    id: 'FormWrapper.resetData',
  },
  save: {
    defaultMessage: 'Save',
    description: 'Label of the button to save the form as editor',
    id: 'FormWrapper.save',
  },
  success: {
    defaultMessage: 'Form successfully validated',
    description: 'Message displayed at the bottom when the form is submitted successfully',
    id: 'FormWrapper.success',
  },
  toolbarTitle: {
    defaultMessage: 'Questions',
    description: 'Label of the toolbar containing draggable questions',
    id: 'FormWrapper.toolbarTitle',
  },
});

export default function FormWrapper({ setIsEditor }: FormWrapperProps) {
  const { isEditor, schema, setSchema } = useVerna();
  const { formatMessage } = useIntl();
  const [, setIsDragging] = useDnd();
  const localStats = useStatsProvider();
  const [schemaForm, setSchemaForm] = useState<VernaSchemaType[]>([]);
  const [pollSelected, setPollSelected] = useState<number | null>(null);
  const [locale, setLocale] = useLocale();
  const [formStatus, setFormStatus] = useState<FormStatusEnum>(FormStatusEnum.neutral);
  const shouldShowToolbar = useMemo(
    () => isEditor && pollSelected !== null,
    [isEditor, pollSelected],
  );

  function getGlobalTranslations(newSchemaForm: VernaSchemaType[] = schemaForm) {
    const translations = {};
    newSchemaForm.forEach((schemaFormObject) =>
      _.merge(translations, schemaFormObject.translationSchema),
    );
    return translations;
  }

  useEffect(() => {
    // load schema infos
    const localSchemaForm = localStorage.getItem('vernaExampleData-schema');
    if (!localSchemaForm) {
      const apiSchemaForm = getSchemas();
      setSchemaForm(apiSchemaForm);
    } else {
      setSchemaForm(JSON.parse(localSchemaForm));
    }
  }, []);

  useEffect(() => {
    setSchema({ translationSchema: getGlobalTranslations() });
  }, [schemaForm]);

  useEffect(() => {
    setFormStatus(FormStatusEnum.neutral);
  }, [isEditor]);

  function saveAndGoToMainPage() {
    const newSchemaForm = [...schemaForm];
    newSchemaForm[pollSelected!] = {
      ...schema,
    };
    setSchemaForm(newSchemaForm);
    localStorage.setItem('vernaExampleData-schema', JSON.stringify(newSchemaForm));
    setSchema({
      translationSchema: getGlobalTranslations(newSchemaForm),
    });
    setPollSelected(null);
  }

  function onSubmit(formData: Record<string, Record<string, string | number>>) {
    updateStatsFromData(formData, schema, locale, localStats);
    setFormStatus(FormStatusEnum.completed);
    saveAndGoToMainPage();
  }

  function saveForm(newSchemaForm?: VernaSchemaType[]) {
    const savingForm = newSchemaForm ? newSchemaForm : schemaForm;
    setSchemaForm(savingForm);
    localStorage.setItem('vernaExampleData-schema', JSON.stringify(savingForm));
  }

  return (
    <div className="verna-wrapper">
      <Card
        background="white"
        className={['widget-wrapper', shouldShowToolbar ? 'widget-wrapper-active' : ''].join(' ')}
        round="small"
        style={{ height: '100%', minHeight: '700px', position: 'sticky', top: '20px' }}
      >
        <CardHeader margin="10px">
          <Text title="" weight="bold">
            <FormattedMessage {...messages.toolbarTitle} />
          </Text>
          <Tip content={formatMessage(messages.dndInfos)}>
            <CircleInformation color="black" />
          </Tip>
        </CardHeader>
        <CardBody>
          <div className="form-toolbar">
            <VernaToolbar
              onDragEnd={() => setIsDragging(false)}
              onDragStart={() => setIsDragging(true)}
            >
              <TextWidget type="string" widgetName="textWidget" />
              <TextareaWidget type="string" widgetName="textareaWidget" />
              <NumberWidget type="number" widgetName="numberWidget" />
              <CheckboxWidget type="boolean" widgetName="checkboxWidget" />
              <CheckboxesWidget type="array" widgetName="checkboxesWidget" />
              <SelectWidget type="string" widgetName="selectWidget" />
            </VernaToolbar>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody background="white" pad="10px" width="1000px">
          <div className="form-options">
            <fieldset>
              <Select
                defaultValue="Editor"
                options={['Editor', 'Viewer']}
                value={isEditor ? 'Editor' : 'Viewer'}
                onChange={(e) => {
                  setIsEditor(e.target.value === 'Editor');
                  setSchema({
                    ...schema,
                    uiSchema: {
                      ...schema.uiSchema,
                      'ui:submitButtonOptions': {
                        norender: e.target.value === 'Editor',
                      },
                    },
                  });
                }}
              />
            </fieldset>
            <fieldset className="form_language">
              <Select
                options={[...VERNA_SUPPORTED_LOCALES]}
                value={locale}
                onChange={(e) => {
                  setLocale(e.target.value);
                  setFormStatus(FormStatusEnum.neutral);
                }}
              />
            </fieldset>
          </div>
          <fieldset>
            {pollSelected !== null ? (
              <>
                <Button
                  className="form-goback-button"
                  label={formatMessage(messages.goBack)}
                  onClick={() => {
                    setFormStatus(FormStatusEnum.neutral);
                    saveAndGoToMainPage();
                  }}
                />
                <VernaForm
                  onSubmit={(data: unknown) =>
                    onSubmit(data as Record<string, Record<string, string | number>>)
                  }
                />
              </>
            ) : (
              <Poll
                schemaForm={schemaForm}
                setFormStatus={setFormStatus}
                setPollSelected={setPollSelected}
                setSchemaForm={setSchemaForm}
                stats={localStats.stats}
              />
            )}
            {isEditor && (
              <>
                <Button
                  label={formatMessage(messages.save)}
                  margin={{ top: '15px' }}
                  onClick={() => (pollSelected !== null ? saveAndGoToMainPage() : saveForm())}
                />
                <Button
                  label={formatMessage(messages.resetData)}
                  margin={{ left: '10px', top: '15px' }}
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                />
              </>
            )}
          </fieldset>
        </CardBody>
        {formStatus === FormStatusEnum.completed && (
          <CardFooter background={{ color: 'lightgreen' }} height="50px">
            <Box
              align="center"
              direction="row"
              gap="15px"
              justify="start"
              margin={{ left: '15px' }}
            >
              <StatusGood />
              <Text>
                <FormattedMessage {...messages.success} />
              </Text>
            </Box>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
