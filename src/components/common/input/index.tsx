import DateInput from './DateInput';
import DefaultInput from './DefaultInput';
import type { FieldTypes, InputProps, TextAreaProps } from './input.types';
import PasswordInput from './PasswordInput';
import TextArea from './TextArea';
import TimeInput from './TimeInput';

type FieldProps =
  | (Omit<InputProps, 'type'> & { type?: Exclude<FieldTypes, 'textarea'> })
  | (Omit<TextAreaProps, 'type'> & { type: 'textarea' });

export default function Input({ type = 'text', ...props }: FieldProps) {
  if (type === 'textarea') {
    return <TextArea {...(props as Omit<TextAreaProps, 'type'>)} />;
  }
  const inputProps = props as Omit<InputProps, 'type'>;
  if (type === 'password') return <PasswordInput {...inputProps} />;
  if (type === 'date') return <DateInput {...inputProps} />;
  if (type === 'time') return <TimeInput {...inputProps} />;
  return <DefaultInput {...inputProps} />;
}
