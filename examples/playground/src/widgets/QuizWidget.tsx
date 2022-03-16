import { ChangeEvent, useState } from 'react';
import type { WidgetProps } from '@rjsf/core';

export default function QuizWidget(props: Partial<WidgetProps>) {
  const choices = ['a', 'b', 'c', 'd'] as const;
  const [answers, setAnswers] = useState<Partial<typeof choices[number]>[]>([]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const answer = event.target.value as typeof choices[number];
    const checked = event.target.checked;
    const newAnswers = checked ? [...answers, answer] : answers.filter((e) => e !== answer);
    setAnswers(newAnswers);
    props.onChange && props.onChange(newAnswers);
  }

  return (
    <>
      <h3>Quiz {props.label}</h3>
      {choices.map((choice) => (
        <label key={choice}>
          <input type="checkbox" value={choice} onChange={handleChange} />
          Answer {choice}
        </label>
      ))}
    </>
  );
}
