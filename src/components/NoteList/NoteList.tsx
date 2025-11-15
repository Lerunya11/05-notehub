// src/components/NoteList/NoteList.tsx
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';

import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  isError: boolean;
}

const NoteList: React.FC<NoteListProps> = ({ notes, isLoading, isError }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (isLoading) {
    return <p className={css.message}>Loading notes...</p>;
  }

  if (isError) {
    return <p className={css.message}>Something went wrong.</p>;
  }

  if (!notes.length) {
    return <p className={css.message}>You have no notes yet.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>

          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <button
              type="button"
              className={css.button}
              onClick={() => mutate(note.id)}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
