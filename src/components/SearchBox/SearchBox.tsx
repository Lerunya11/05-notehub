// src/components/SearchBox/SearchBox.tsx
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import css from './SearchBox.module.css';

interface Props {
  onChange: (value: string) => void;
}

export default function SearchBox({ onChange }: Props) {
  const debounced = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value.trim()),
    300
  );

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue=""
      onChange={debounced}
      aria-label="Search notes"
    />
  );
}
