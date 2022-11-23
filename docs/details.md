---
id: details
title: Explanations of functionalities
sidebar_label: Technical details
---

#
## VernaContextProvider

This provider is used to manage the data of the VernaForm.
It stores the schema of this one, the translations, and the customized components used for the render of the form.

#
### Optionnal parameters

<br/>

___
- #### DropZone `(id, render, isSection) => ReactElement`

The default rendering of the DropZone is css customizable if you want simple design.
If you want a specific behaviour or render you can give this as a property.

<br/>

___
- #### FieldTemplate `(id, schema, children, ...) => ReactElement`

This property is used as a wrapper to render every level component (root, section and widget).
By default, it serves basic functions.

<br/>

___
- #### Section `(id: string, schema: VernaSchemaType, selector: Maybe<string>, ...) => ReactElement`

The Section component is used as a wrapper of the sections.
It's a level below FieldTemplate.

<br/>

___
- #### SubmitButton `() => ReactElement`

This property override the render of the submit button.

<br/>

___
- #### configSchema `VernaJSONSchemaType`

This object is necessary to give possibility to the user to configure the fields he creates.
It will be used to generate another form still using the RJSF norm.
You can still use further options existing already in RJSF to parameter this form.
(like minItems that makes mandatory the creation of two items on WidgetName1)

By default, it gives the user the possibility to customize the title field, so it's not needed to specify it here.

For example, here is a configuration of two widgets, one with additional items and one for a number field:

```json
{
  "properties": {
    "WidgetName1": {
      "properties": {
        "items": {
          "additionalItems": {
            "type": "boolean"
          },
          "items": {
            "type": "string"
          },
          "minItems": 2,
          "type": "array"
        },
        "required": {
          "type": "boolean"
        },
        "type": "object"
      }
    },
    "WidgetName2": {
      "properties": {
        "maximum": {
          "type": "number"
        },
        "minimum": {
          "type": "number"
        },
        "required": {
          "type": "boolean"
        }
      }
    }
  }
}
```

The widget names are corresponding to the name of the widgets you added in the property defaultWidgets.

You can see more detail examples in the demos.  
cf: `examples/playground/App.tsx`

The existing options are:
1. description
2. enum
3. items
4. maxLength
5. maximum
6. minimum
7. required
8. title

<br/>

___
- #### defaultSchema `VernaJSONSchemaType`

You can give the schema to render here.
If you want to start with an empty schema you can ignore this property.

It will include 3 sub-objects:
1. formSchema

The formSchema is a modified version of the JSONSchema7 type from @rjsf/core.
It will create the shape of the form and some parameter properties like required.
And it will store the values like the titles or descriptions of the fields.
In the case of Verna it will only contain translation keys that are replaces on each render.

2. translationSchema

The translationSchema object it an intlShape type.
It will include the locales and the translations of this one.

3. uiSchema

This object is complementary with formSchema.
Its type UiSchema is directly imported from @rjsf/core.
It will give further detail on the schema such as:

1. the widget to be used to render a field
2. the order to display sections or widgets
3. details on the workaround of some features (like "ui:submitButtonOptions")
4. ... more detailed information in the RJSF documentation

<br/>

___
- #### defaultFormValues `any`

This property will be used to give default values on the field.
It can be used to view the values entered the submitted form.

<br/>

___
- #### defaultLocale `string`

Default locale is used for the workaround of the library keeping it as a reference and default language.

<br/>

___
- #### defaultSelector `string`

This property is used to manage specific rendering of parts of the form.
If you need to cut a form you may use it.
It can match the name of a section, so it will display only this section.

> The form validation will still be on the whole form.

It serves an organizational purpose.

<br/>

___
- #### defaultWidgets `{ [name: string]: Widget }`

This property is used to give customized widgets.
Those widgets will be used to render your own fields for the form.

Those widgets will be React components.
They will receive in parameter VernaWidgetProps.
This type includes many required information to parameter your field properly.

The object taken in parameter will be shaped like this:

```typescript
const defaultWidgets = {
  "WidgetName": WidgetComponent,
}
```

WidgetName is free to choose.
It will be necessary for customized way of adding widgets, where you will have to give this name.

<br/>

___
- #### intl `IntlShape`

This object is required if your app already have an Intl provider, you can give its object to the library.
This way it doesn't create a new nested one.

If your app doesn't use multi-language you don't need to bother with this property.

<br/>

___
- #### isEditor `boolean`

This boolean indicate the mode of usage of the library, either the view to fill the form or to edit it.

<br/>

___
- #### locale `string`

The locale is managed outside the library, it will be used to manage the language translating Verna.

#
### Data provided

Those data are accessible through the Verna provider

<br/>

___
- #### DropZone `(id, render, isSection) => ReactElement`

Direct access to the property given in parameter or to the default one.

<br/>

___
- #### FieldTemplate `(id, schema, children, ...) => ReactElement`

Direct access to the property given in parameter or to the default one.

<br/>

___
- #### Section `(id: string, schema: VernaSchemaType, selector: Maybe<string>, ...) => ReactElement`

Direct access to the property given in parameter or to the default one.

<br/>

___
- #### SubmitButton `() => ReactElement`

Direct access to the property given in parameter or to the default one.

<br/>

___
- #### addVernaSection `(idPreviousSection: Nullable<string>) => void`

This function is to be called to create a new section.
If you want to create it at a specific location you can give in parameter the id of the previous widget.
If the id is null it will create the section in first place.

<br/>

___
- #### addVernaTranslations `(translations: TranslationType) => void`

This function is to be called to add translations in the schema.translationSchema object.
It takes an IntlShape object shaped like such:
`{ [locale]: { "key": "translation"} }`

If a translation exists already on a key it will override the old one.

<br/>

___
- #### addVernaWidget `(idPreviousWidget: string, widgetInfos?: ShowCaseWidgetProps, intl?: IntlShape) => void`

This function is to be called to create a new widget.

It needs an id to position the widget.
This id can be a section id, in this case the widget will be created in first place.
And if the id is a widget id, it will create the widget below the one corresponding to the id provided.

The property widgetInfos will be an object needed to parameter the widget we want to create.
It will be composed of a name, a type and a boolean to indicate if the widget is added in a section directly (if the id is a sectionId).

If you want to see an example of usage of this, you can check the way the Verna toolbar is done. cf: `lib/src/components/VernaToolbar/index.tsx`

The intl object must be given manually to avoid a conflict between the providers.

<br/>

___
- #### configSchema `VernaJSONSchemaType`

Direct access to the property given in parameter or to the default one.

<br/>

___
- #### formData `unknown`

This property gives direct access to the formData provided in parameter with [defaultFormValues](#defaultformvalues-any).

> Be careful, the value **is** updated on submit but not on change.

<br/>

___
- #### handleSubmit `<FormData = unknown>(callback: (formData: unknown) => void) => (event: ISubmitEvent<FormData>, nativeEvent: FormEvent<HTMLFormElement>) => void`

This function is executed when the form is valid and submitted.
It will be running **before** the function given in parameter of VernaForm.
It will take a custom onSubmit function in parameter.
You can use it if you want to do a custom submit system.

<br/>

___
- #### isEditor `boolean`

Direct access to the property given in parameter or to the default one.



<br/>

___
- #### removeVernaTranslations `(translationToDelete: Maybe<string[]>) => void`



<br/>

___
- #### removeVernaProperty `(id: string) => void`



<br/>

___
- #### schema `VernaSchemaType`

Direct access to the property given in parameter.
The schema is updated on every call made on those functions (the rerender is done only once every call is done, cf: [useReducer](https://fr.reactjs.org/docs/hooks-reference.html#usereducer)):
- addVernaSection
- addVernaTranslations
- addVernaWidget
- removeVernaTranslations
- removeVernaProperty
- setSchema
- updateVernaProperty
- updateWidget

[more details here](#defaultschema-vernajsonschematype)

<br/>

___
- #### selectedFormData `unknown`

Default values of the form.
If none given the form will be empty.

<br/>

___
- #### selector `string | undefined`

The selector is used to display only a part of the form.
The form may be split in sections, if so, the selector prop may be used to display only one section.
If you fill a section using it, then set the selector to undefined, the values entered will still be known and displayed.

> If you want to use it, you **must** set it to undefined to have the validation of the **whole** form, otherwise it will only be the section.

<br/>

___
- #### setFormData `(newDefaultValues: unknown) => void`

May be used to define the default values on the fly.
For example if you change the schema displayed you may want to change the values displayed in it.

<br/>

___
- #### setSchema `(newSchema: VernaSchemaType) => void`

Set the whole schema object without any merge.
It must be shaped on the same type as [here](#defaultschema-vernajsonschematype).
You can set it to an empty object to simply unset it.

<br/>

___
- #### setSelector `(selector: string | undefined) => void`

Used to set the [selector](#selector-string--undefined).

<br/>

___
- #### setWidgets `(newWidgets: WidgetsType) => void`

Used to set the [widgets](#defaultwidgets--name-string-widget-).

<br/>

___
- #### updateVernaProperty `(schema: VernaSchemaType) => void`

Used to update the schema by **adding** the values given in the parameter.
The schema parameter must have the same structure as the [original schema](#defaultschema-vernajsonschematype).

<br/>

___
- #### updateWidget `(schema: VernaJSONSchemaType, id: string) => void`

This function will **replace** a widget content by the schema given as the parameter schema.
The widget you want to redefine will be the one with the id provided in second parameter.

> You must remember to provide the type of the widget, such as `{ type: "string" }`

<br/>

___
- #### widgets `WidgetsType`

This property provide direct access to the custom widgets given in parameter in `defaultWidgets`

#
## VernaForm

VernaForm is a React component.
It will be here that the form will be rendered.
It **must** be wrapped in the VernaContextProvider.
It will only take in parameter the onSubmit.

> The onSubmit will natively only be triggered if the form is valid and a submit button pressed

#
## VernaToolbar

The VernaToolbar is a tool to automatically convert to drag and drop elements usable in Verna.
The children given to this component will be modified by the component.
Every child must receive two properties:
```
  widgetName: string;
  type: JSONSchema7TypeName;
```
Those properties are used by the library to know what type of widget to build and what widget must be rendered.
