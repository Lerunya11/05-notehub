// src/components/SearchBox/SearchBox.tsx
import { useId } from 'react';
import css from './SearchBox.module.css';

export interface SearchBoxProps {
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({ onChange, placeholder }: SearchBoxProps) {
  const id = useId();

  return (
    <input
      id={id}
      name="search"
      className={css.input}
      type="text"
      defaultValue=""
      onChange={(e) => onChange(e.target.value.trimStart())}
      placeholder={placeholder ?? 'Search notes'}
      autoComplete="off"
    />
  );
}
