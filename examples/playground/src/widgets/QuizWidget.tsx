import type { VernaWidgetProps } from '@openfun/verna/dist/types/Widgets';
import { ChangeEvent, useState } from 'react';

export default function QuizWidget(props: VernaWidgetProps) {
  const choices = ['a', 'b', 'c', 'd'] as const;
  const [answers, setAnswers] = useState<Partial<typeof choices[number]>[]>([]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const answer = event.target.value as typeof choices[number];
    const checked = event.target.checked;
    const newAnswers = checked ? [...answers, answer] : answers.filter((e) => e !== answer);
    setAnswers(newAnswers);
    props.onChange(newAnswers);
  }

  return (
    <>
      <h3>Quiz {props.label}</h3>
      {choices.map((choice) => (
        <label key={choice}>
          <input id={props.id} onChange={handleChange} type="checkbox" value={choice} />
          Answer {choice}
        </label>
      ))}
    </>
  );
}
