import { useId } from 'react';
import css from './SearchBox.module.css';

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({
  value,
  onChange,
  placeholder,
}: SearchBoxProps) {
  const id = useId();
  return (
    <input
      id={id}
      name="search"
      className={css.input}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.trimStart())}
      placeholder={placeholder ?? 'Search notes'}
      autoComplete="off"
    />
  );
}
