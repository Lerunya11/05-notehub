// src/components/App/App.tsx
import React, { useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useNotes } from '../../hooks/useNotes';

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);          // 1-based
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { notes, totalPages, isFetching, isError, error } = useNotes({
    page,
    perPage: PER_PAGE,
    search,
  });

  const updateSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={updateSearch} />
        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {/* список */}
      {isError && <div className={css.state}>Error: {(error as Error).message}</div>}
      {!isError && notes.length === 0 && !isFetching && (
        <div className={css.state}>No notes yet.</div>
      )}
      {isFetching && <div className={css.state}>Loading…</div>}
      {notes.length > 0 && <NoteList page={page} search={search} />}

      {/* пагинация */}
      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          forcePage={page - 1} // ReactPaginate — 0-based
          onPageChange={(item: { selected: number }) => setPage(item.selected + 1)}
        />
      )}

      {/* модалка создания */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
