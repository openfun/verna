import { VernaForm, useVerna, VernaToolbar } from '@openfun/verna';
import { JSONSchema7 } from 'json-schema';
import TextWidget from './widgetToolbarItems/TextWidget';
import PasswordWidget from './widgetToolbarItems/PasswordWidget';
import TextareaWidget from './widgetToolbarItems/TextareaWidget';
import NumberWidget from './widgetToolbarItems/NumberWidget';
import CheckboxWidget from './widgetToolbarItems/CheckboxWidget';
import SelectWidget from './widgetToolbarItems/SelectWidget';
import CheckboxesWidget from './widgetToolbarItems/CheckboxesWidget';
import { Box, Button, Card, CardBody, CardHeader, Select, Text } from 'grommet';
import { FlagFill } from 'grommet-icons';
import { useState } from 'react';

interface FormWrapperProps {
  toggleEditorMode: () => void;
  setLocale: (locale: string) => void;
}

export default function FormWrapper({ toggleEditorMode, setLocale }: FormWrapperProps) {
  const { schema, uiSchema, setSelector, isEditor, selector, schemaTranslations, locale } =
    useVerna();
  const [displayAllSections, setDisplayAllSections] = useState();

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
          <fieldset className="form_language">
            <legend>Language</legend>
            <Select
              icon={<FlagFill />}
              onChange={(e) => setLocale(e.target.value)}
              options={['fr', 'en']}
              value={locale}
            />
          </fieldset>
          <fieldset>
            {/* Need to add edit section name */}
            {/* Need to add add section button */}
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
                {Object.keys(schema.properties as JSONSchema7)?.map((key) => (
                  <Button key={key} primary label={key} onClick={() => setSelector(key)} />
                ))}
                <Button label="View all sections" onClick={() => setDisplayAllSections(true)} />
              </div>
            )}
          </fieldset>
        </CardBody>
      </Card>
      {/* Ajouter la selection de la langue */}
      {/* Ne pas render cette partie*/}
      <div className="buttons-wrapper">
        <Card background="white" round="small" width="300px">
          <CardBody>
            <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <legend>Editor options</legend>
              <Button primary label="Switch editor mode" onClick={toggleEditorMode} />
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
            </fieldset>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
