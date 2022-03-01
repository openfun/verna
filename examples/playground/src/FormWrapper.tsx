import VernaForm, { useVerna } from '@openfun/verna';

export default function FormWrapper() {
  const { schema, uiSchema } = useVerna();

  return (
    <>
      <VernaForm onSubmit={() => console.log('Submit')} />
      <button onClick={() => console.log('Schema:', { schema: schema, uiSchema: uiSchema })}>
        save form
      </button>
    </>
  );
}
