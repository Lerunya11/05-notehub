
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

export interface NoteListProps {
  notes: Note[];
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onDelete: (id: string) => void | Promise<void>;
}

export default function NoteList({
  notes,
  isFetching,
  isError,
  errorMessage,
  onDelete,
}: NoteListProps) {
  if (isFetching) {
    return <p className={css.state}>Loading...</p>;
  }

  if (isError) {
    return <p className={css.state}>Error: {errorMessage ?? 'Something went wrong'}</p>;
  }

  if (!notes || notes.length === 0) {
    return <p className={css.state}>No notes yet.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.card}>
          <h3 className={css.title}>{n.title}</h3>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button
              className={css.delete}
              onClick={() => onDelete(n.id)}
              aria-label={`Delete ${n.title}`}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
