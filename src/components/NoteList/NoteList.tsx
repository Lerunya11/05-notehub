// src/components/NoteList/NoteList.tsx
import React from 'react';
import css from './NoteList.module.css';
import { useNotes } from '../../hooks/useNotes';

interface Props {
  page: number;
  search: string;
}

const PER_PAGE = 12;

export default function NoteList({ page, search }: Props) {
  const {
    notes,
    isLoading,
    isFetching,
    isError,
    error,
    deleteNote,      // <- берём мутатор удаления из useNotes
    isDeleting,
  } = useNotes({ page, perPage: PER_PAGE, search });

  if (isLoading) return <div className={css.state}>Loading notes…</div>;
  if (isError)   return <div className={css.state}>Error: {(error as Error)?.message}</div>;
  if (!notes.length) return <div className={css.state}>No notes yet.</div>;

  return (
    <>
      {isFetching && <div className={css.fetching}>Updating…</div>}
      <ul className={css.list}>
        {notes.map(n => (
          <li key={n.id} className={css.listItem}>
            <h2 className={css.title}>{n.title}</h2>
            <p className={css.content}>{n.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{n.tag}</span>
              <button
                className={css.button}
                onClick={() => deleteNote(n.id)}
                disabled={isDeleting}
                aria-label={`Delete note ${n.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
