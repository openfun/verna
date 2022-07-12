import { VernaForm, useVerna, VernaToolbar } from '@openfun/verna';
import { JSONSchema7 } from 'json-schema';
import TextWidget from './widgetToolbarItems/TextWidget';
import PasswordWidget from './widgetToolbarItems/PasswordWidget';
import TextareaWidget from './widgetToolbarItems/TextareaWidget';
import NumberWidget from './widgetToolbarItems/NumberWidget';
import CheckboxWidget from './widgetToolbarItems/CheckboxWidget';
import SelectWidget from './widgetToolbarItems/SelectWidget';
import CheckboxesWidget from './widgetToolbarItems/CheckboxesWidget';
import { Button, Card, CardBody, CardHeader, Select, Text } from 'grommet';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import SectionResume from './components/SectionResume';

interface FormWrapperProps {
  setIsEditor: (newValue: boolean) => void;
  setLocale: (locale: string) => void;
}

export default function FormWrapper({ setIsEditor, setLocale }: FormWrapperProps) {
  const { schema, uiSchema, setSelector, isEditor, selector, schemaTranslations } = useVerna();
  const [displayAllSections, setDisplayAllSections] = useState<boolean>();
  const { locale } = useIntl();

  return (
    <div className="verna-wrapper">
      {isEditor && (
        <Card background="white" round="small" width="300px">
          <CardHeader margin="10px">
            <Text title="">Champs prédéfinis</Text>
          </CardHeader>
          <CardBody>
            <div className="form_toolbar">
              <VernaToolbar>
                <TextWidget type="string" widgetName="textWidget" />
                <PasswordWidget type="string" widgetName="passwordWidget" />
                <TextareaWidget type="string" widgetName="textareaWidget" />
                <NumberWidget type="number" widgetName="numberWidget" />
                <CheckboxWidget type="boolean" widgetName="checkboxWidget" />
                <CheckboxesWidget type="array" widgetName="checkboxesWidget" />
                <SelectWidget type="string" widgetName="selectWidget" />
              </VernaToolbar>
            </div>
          </CardBody>
        </Card>
      )}
      <Card>
        <CardBody background="white" pad="10px" width="1000px">
          <div className="form_options">
            <fieldset>
              <Select
                defaultValue="Editor"
                onChange={(e) => setIsEditor(e.target.value === 'Editor')}
                options={['Editor', 'Viewer']}
                value={isEditor ? 'Editor' : 'Viewer'}
              />
            </fieldset>
            <fieldset className="form_language">
              <Select
                defaultValue="en"
                onChange={(e) => setLocale(e.target.value)}
                options={['fr', 'en']}
                value={locale}
              />
            </fieldset>
          </div>
          <fieldset>
            {/* Need to add edit section name */}
            {/* Need to add section button */}
            {selector || displayAllSections ? (
              <>
                <Button
                  className="form_goback_button"
                  label="Go back"
                  onClick={() => {
                    setSelector(undefined);
                    setDisplayAllSections(false);
                  }}
                />
                <VernaForm onSubmit={(formData) => console.log(formData)} />
              </>
            ) : (
              <div className="form_sections_list">
                {Object.keys(schema.properties as JSONSchema7)?.map((sectionName) => (
                  <SectionResume section={sectionName} />
                ))}
                <Button label="View all sections" onClick={() => setDisplayAllSections(true)} />
              </div>
            )}
          </fieldset>
        </CardBody>
      </Card>
      <Button
        primary
        label="save form"
        onClick={() =>
          console.log('FormData:', {
            schema: schema,
            translations: schemaTranslations,
            uiSchema: uiSchema,
          })
        }
      />
    </div>
  );
}
