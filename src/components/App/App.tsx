import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNotes } from '../../hooks/useNotes';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';

const PER_PAGE = 12;

export default function App() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const onSearchChange = useDebouncedCallback((v: string) => {
    setDebounced(v);
    setPage(1);
  }, 300);

  const { notes, totalPages, isLoading, isError } = useNotes({
    page,
    perPage: PER_PAGE,
    search: debounced || undefined,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            onSearchChange(v);
          }}
          placeholder="Search notes"
        />
        <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
        <button className={css.button} onClick={() => setOpen(true)}>Create note +</button>
      </header>

      {isLoading && <div className={css.helper}>Loading...</div>}
      {isError && <div className={css.helper}>Error. Try again.</div>}
      {!isLoading && !isError && <NoteList notes={notes} />}

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <NoteForm onCancel={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
