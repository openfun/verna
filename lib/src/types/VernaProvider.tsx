import { ObjectFieldTemplateProps } from '@rjsf/core';
import React from 'react';
import { type IntlShape } from 'react-intl';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';
import { TranslationType } from ':/types/translations';
import { Nullable } from ':/types/utils';
import ShowCaseWidgetProps from ':/types/Widgets';

/**
 * Enum typing the payload actions
 */
export enum VernaActionsEnum {
  ADD_SECTION = 'addSection',
  ADD_TRANSLATION = 'addTranslations',
  ADD_WIDGET = 'addWidget',
  REMOVE_TRANSLATION = 'removeTranslations',
  REMOVE_PROPERTY = 'removeProperty',
  SET_SCHEMA = 'setSchema',
  UPDATE_PROPERTY = 'updateProperty',
  UPDATE_WIDGET = 'updateWidget',
}

interface PayloadType {
  id?: Nullable<string>;
  SectionTemplate?: React.FunctionComponent<ObjectFieldTemplateProps>;
  widgetInfos?: ShowCaseWidgetProps;
  translations?: TranslationType;
  translationsToDelete?: string[];
  schema?: VernaSchemaType;
  JSONSchema?: VernaJSONSchemaType;
}

/**
 * This type is inspired from the redux utilities
 * https://github.com/redux-utilities/flux-standard-action#actions
 *
 * @type This property is the only mandatory one, it describes the type of action
 * required.
 * @payload This optional property is an object that will be used to do the action
 * similarly to the argument given in a setState action.
 * @error This optional property MAY be set to true if the action represents
 * an error, any other state is considered as false.
 * @meta The optional meta property MAY be any type of value. It is intended for
 * any extra information that is not part of the payload.
 */
export interface ReducerAction {
  type: VernaActionsEnum;
  payload: PayloadType;
  error?: boolean;
  meta?: { intl: IntlShape } | any;
}

/**
 * Payload must be shaped like:
 *
 * To manage widget and sections:
 * @id is either the target element or the element above if it's to add one
 *
 * To add a section:
 * @SectionTemplate is the verna section template override or default
 *
 * To add a widget:
 * @widgetInfos infos of the widget given in the drop event
 *
 * To add translations:
 * @translations is an object shaped like a React intl translation object, it will be merged in the
 * existing one
 *
 * To remove translations:
 * @translationsToDelete object containing locales and for each an array of the keys that
 * must be removed
 *
 * If error is true, the payload will contain the error object
 */

/**
 * Meta will always contain:
 * @selector the verna selector (automatically added in the provider)
 */
