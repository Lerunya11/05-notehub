import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import { NOTES_KEY } from '../../hooks/useNotes';
import css from './NoteList.module.css';

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  if (!notes.length) return null;

  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [NOTES_KEY] }),
  });

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button className={css.button} onClick={() => del.mutate(n.id)} disabled={del.isPending}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
