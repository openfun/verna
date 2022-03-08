import VernaForm, { useVerna } from '@openfun/verna';
import { JSONSchema7 } from 'json-schema';

export default function FormWrapper() {
  const { schema, uiSchema, setSelector } = useVerna();

  return (
    <>
      <VernaForm onSubmit={(formData) => console.log(formData)} />
      <button onClick={() => console.log('Schema:', { schema: schema, uiSchema: uiSchema })}>
        save form
      </button>
      {Object.keys(schema.properties as JSONSchema7)?.map((key) => (
        <button onClick={() => setSelector(key)} key={key}>
          {key}
        </button>
      ))}
      <button onClick={() => setSelector(undefined)}>default</button>
    </>
  );
}
