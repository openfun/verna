---
id: installation
title: Installing Verna for development
sidebar_label: Installation
---

# Installation
`Verna` is a npm **library**.
You can install it with either
```bash
yarn add verna
```
or
```bash
npm install verna
```
depending on the package manager you are using.

# Implementation

## Once installed you will have two required components

- `VernaContextProvider` that must wrap the component VernaForm [more details](./details.md#VernaContextProvider).
- `VernaForm` that will display the form [more details](./details.md#VernaForm).

### Basic example

You don't need to give most of the parameters to the provider to test it.
Here is a simple example using every tool provided by the library.
It includes the usage of a custom widget and a default schema including already a section.

> Here we pre-create a section but you can create sections however you want.

```typescript jsx
function App() {
  return (
    <VernaContextProvider
      defaultWidgets={{
        CustomWidgetName: CustomWidgetRender,
      }}
      defaultSchema={{
        formSchema: {
          properties: {
            SectionName: {
              properties: {},
              type: 'object',
            }
          },
          type: 'object',
        }
      }}
    >
      <VernaWrapper/>
    </VernaContextProvider>
  )
}
```

Then we can add a button to create new widgets in the default section each time we press it.
In this simple case we give directly the id of the section, but in more complex cases you'll use the one provided in overloading components.

```typescript jsx
import { VernaForm, VernaToolbar } from '@openfun/verna';
import { useIntl } from 'react-intl';

function VernaWrapper() {
  const { addVernaWidget } = useVerna();
  const intl = useIntl();

  return (
    <>
      <button onClick={() =>
        addVernaWidget('root_SectionName', {
          widgetName: 'CustomWidgetName',
          type: 'string',
          isDroppedInSection: true,
        }, intl)
      }>Add my custom widget</button>
      <VernaForm onSubmit={(values) => console.log(values)} />
    </>
  );
}
```

```typescript jsx
function CustomWidgetRender({
      disabled,
      required,
      label,
    }: VernaWidgetProps) {
  return <div>
    <h3>
      {label}
    </h3>
    <input
      disabled={disabled}
      required={required}
    />
  </div>
}
```


### Example using VernaToolbar

With this example you may create fields by dragging and dropping the CustomWidgetShowcase
element in the drop area displayed by Verna

> You may add a VernaToolbar to make a drag and drop feature to add widgets
> But it will need some css or giving a render component for the DropZone property

> You can customize with only css using the classes `drop-zone`, `drop-zone-divider`, `drop-zone-divider-drag-over` and `drop-zone-drag-over`. 

```typescript jsx
import { VernaForm, VernaToolbar } from '@openfun/verna';
import { useIntl } from 'react-intl';

function VernaWrapper() {
  const { addVernaWidget } = useVerna();
  const intl = useIntl();

  return (
    <>
      <VernaToolbar>
        <CustomWidgetShowcase type="string" widgetName="CustomWidgetName"/>
      </VernaToolbar>
      <VernaForm onSubmit={(values) => console.log(values)} />
    </>
  );
}
```

```typescript jsx
function CustomWidgetShowcase(props: ShowCaseWidgetProps) {
  return <div>
    This is my test widget
  </div>
}
```
