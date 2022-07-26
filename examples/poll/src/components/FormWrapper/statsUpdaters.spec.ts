import { VernaSchemaType } from '@openfun/verna/dist/types/rjsf';
import updateStatsFromData from ':/components/FormWrapper/statsUpdaters';

describe('Save stats correctly on submit', () => {
  it('should be able to update statistics from a simple string input answers', () => {
    const localStats = {
      pollsAnswered: {},
      reFetchLocalData: jest.fn(() => {}),
      setPollsAnswered: jest.fn(() => {}),
      setStats: jest.fn(() => {}),
      stats: {},
    };
    const schema = {
      formSchema: {},
      translationSchema: {},
      uiSchema: {
        poll: {
          ['ui:order']: ['question'],
        },
        ['ui:order']: ['poll'],
      },
    };

    // Create stats on question from an empty statistic object
    updateStatsFromData({ poll: { question: 'answer1' } }, schema, 'US-en', localStats);
    let callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { answer1: 1 } },
    });

    // Check that the poll is flagged as answered by the user
    let callPollAnswerArguments = localStats.setPollsAnswered.mock.calls;
    expect(callPollAnswerArguments[callPollAnswerArguments.length - 1]).toHaveLength(1);
    expect(
      (callPollAnswerArguments[callPollAnswerArguments.length - 1] as string[])[0],
    ).toStrictEqual({
      poll: true,
    });

    // Add one to a statistic already existing
    localStats.stats = { poll: { question: { answer1: 1 } } };
    updateStatsFromData({ poll: { question: 'answer1' } }, schema, 'US-en', localStats);
    callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { answer1: 2 } },
    });

    // Create a new statistic when some others already exist
    localStats.stats = { poll: { question: { answer2: 3, answer3: 4 } } };
    updateStatsFromData({ poll: { question: 'answer1' } }, schema, 'US-en', localStats);
    callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { answer1: 1, answer2: 3, answer3: 4 } },
    });
  });

  it('should be able to update statistics from answers of an enum type input', () => {
    const localStats = {
      pollsAnswered: {},
      reFetchLocalData: jest.fn(() => {}),
      setPollsAnswered: jest.fn(() => {}),
      setStats: jest.fn(() => {}),
      stats: {},
    };

    const schema: VernaSchemaType = {
      formSchema: {
        properties: {
          poll: {
            properties: {
              question: {
                enum: ['enum1_key', 'enum2_key'],
                type: 'string',
              },
            },
          },
        },
      },
      translationSchema: {
        'US-en': {
          enum1_key: 'enum1',
          enum2_key: 'enum2',
        },
      },
      uiSchema: {
        poll: {
          ['ui:order']: ['question'],
        },
        ['ui:order']: ['poll'],
      },
    };
    // Create stats on question from an empty statistic object
    updateStatsFromData({ poll: { question: 'enum1' } }, schema, 'US-en', localStats);
    let callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { enum1_key: 1 } },
    });

    // Add one to a statistic already existing
    localStats.stats = { poll: { question: { enum1_key: 1 } } };
    updateStatsFromData({ poll: { question: 'enum1' } }, schema, 'US-en', localStats);
    callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { enum1_key: 2 } },
    });

    // Create a new statistic when some others already exist
    localStats.stats = { poll: { question: { enum1_key: 3 } } };
    updateStatsFromData({ poll: { question: 'enum2' } }, schema, 'US-en', localStats);
    callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { enum1_key: 3, enum2_key: 1 } },
    });
  });

  it('should be able to update statistics from answers of an input with items', () => {
    const localStats = {
      pollsAnswered: {},
      reFetchLocalData: jest.fn(() => {}),
      setPollsAnswered: jest.fn(() => {}),
      setStats: jest.fn(() => {}),
      stats: {},
    };

    const schema: VernaSchemaType = {
      formSchema: {
        properties: {
          poll: {
            properties: {
              question: {
                items: {
                  enum: ['item1_key', 'item2_key'],
                  type: 'string',
                },
                type: 'array',
                uniqueItems: true,
              },
            },
          },
        },
      },
      translationSchema: {
        'US-en': {
          item1_key: 'item1',
          item2_key: 'item2',
        },
      },
      uiSchema: {
        poll: {
          ['ui:order']: ['question'],
        },
        ['ui:order']: ['poll'],
      },
    };
    // Create stats on question from an empty statistic object
    updateStatsFromData({ poll: { question: ['item1'] } }, schema, 'US-en', localStats);
    let callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { item1_key: 1 } },
    });

    // Add one to a statistic already existing
    localStats.stats = { poll: { question: { item1_key: 1 } } };
    updateStatsFromData({ poll: { question: ['item1'] } }, schema, 'US-en', localStats);
    callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { item1_key: 2 } },
    });

    // Create a new statistic when some others already exist
    localStats.stats = { poll: { question: { item1_key: 3 } } };
    updateStatsFromData({ poll: { question: ['item2'] } }, schema, 'US-en', localStats);
    callStatsArguments = localStats.setStats.mock.calls;
    expect(callStatsArguments[callStatsArguments.length - 1]).toHaveLength(1);
    expect((callStatsArguments[callStatsArguments.length - 1] as string[])[0]).toStrictEqual({
      poll: { question: { item1_key: 3, item2_key: 1 } },
    });
  });
});
