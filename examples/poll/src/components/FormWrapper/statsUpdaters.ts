import { VernaContextProps } from '@openfun/verna/dist/providers/VernaProvider';
import { Maybe } from '@openfun/verna/dist/types/utils';
import { defineMessages } from 'react-intl';
import { StatsContextProps, StatsType } from ':/providers/StatsProvider';

const messages = defineMessages({
  emptyAnswer: {
    defaultMessage: 'Empty answer',
    description: 'Text used when an answer of something to select is nothing',
    id: 'FormWrapper.emptyAnswer',
  },
  false: {
    defaultMessage: 'False',
    description: 'Label used for false value',
    id: 'FormWrapper.false',
  },
  true: {
    defaultMessage: 'True',
    description: 'Label used for true value',
    id: 'FormWrapper.true',
  },
});

function getReverseTranslationObject(
  schema: VernaContextProps['schema'],
  locale: string,
): Record<string, string> {
  return Object.entries(schema?.translationSchema?.[locale] || {}).reduce(
    (res: Record<string, string>, entry) => {
      res[entry[1] as string] = entry[0];
      return res;
    },
    {},
  );
}

function saveDataItems(
  formData: Record<string, Record<string, string | number | string[]>>,
  poll: string,
  question: string,
  newStats: StatsType,
  translations: Record<string, string>,
) {
  Array(formData[poll][question]).forEach((value: string | number | string[]) => {
    if (value && Array.isArray(value) && value.length > 0) {
      const answerName = value.map((v) => translations?.[v]).join(',');
      if (!newStats[poll][question][answerName]) newStats[poll][question][answerName] = 0;
      newStats[poll][question][answerName] += 1;
    } else {
      if (!newStats[poll][question][messages.emptyAnswer.id])
        newStats[poll][question][messages.emptyAnswer.id] = 0;
      newStats[poll][question][messages.emptyAnswer.id] += 1;
    }
  });
}

function getDataFromEnum(
  formData: Record<string, Record<string, string | number | string[]>>,
  poll: string,
  question: string,
  translations: Record<string, string>,
) {
  if (Array.isArray(formData?.[poll]?.[question])) {
    throw new Error("Error, data defined as an array where it's not supposed to be one.");
  }
  return translations?.[formData?.[poll]?.[question] as string | number];
}

export default function updateStatsFromData(
  formData: Record<string, Record<string, string | number | string[]>>,
  schema: VernaContextProps['schema'],
  locale: string,
  localStats: StatsContextProps,
) {
  const newStats = { ...localStats.stats };
  const newPollsAnswered = { ...localStats.pollsAnswered };

  (schema.uiSchema?.['ui:order'] || []).forEach((poll: string) => {
    newPollsAnswered[poll] = true;
    (schema.uiSchema?.[poll]['ui:order'] || []).forEach((question: string) => {
      let questionData: Maybe<string> = undefined;

      if (!schema?.translationSchema) schema.translationSchema = { [locale]: {} };
      if (!schema?.translationSchema?.[locale]) schema.translationSchema[locale] = {};
      if (!newStats[poll]) newStats[poll] = {};
      if (!newStats[poll][question]) newStats[poll][question] = {};

      // If the question is based on items
      if (schema?.formSchema?.properties?.[poll]?.properties?.[question]?.items) {
        const reversedTranslations = getReverseTranslationObject(schema, locale);
        saveDataItems(formData, poll, question, newStats, reversedTranslations);
      } else if (
        schema?.formSchema?.properties?.[poll]?.properties?.[question]?.type === 'boolean'
      ) {
        // If the answer is a boolean
        questionData = formData?.[poll]?.[question] ? messages.true.id : messages.false.id;
      } else if (schema?.formSchema?.properties?.[poll]?.properties?.[question]?.enum) {
        const listTranslationKeys = getReverseTranslationObject(schema, locale);
        questionData = getDataFromEnum(formData, poll, question, listTranslationKeys);
        // If the question is neither based on an enum nor items
      } else {
        questionData = formData?.[poll]?.[question]
          ? formData?.[poll]?.[question].toString()
          : messages.emptyAnswer.id;
      }
      if (questionData) {
        if (!Object.keys(newStats[poll][question]).includes(questionData)) {
          newStats[poll][question][questionData] = 0;
        }
        newStats[poll][question][questionData] += 1;
      }
    });
  });
  localStats.setPollsAnswered(newPollsAnswered);
  localStats.setStats(newStats);
}
