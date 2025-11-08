// src/components/App/App.tsx
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import { useNotes } from '../../hooks/useNotes';
import type { CreateNotePayload } from '../../services/noteService';
import css from './App.module.css';

export default function App() {
  // страница
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);

  // видимое значение инпута + реальный поисковый запрос (дебаунс)
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const onSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 300);

  const {
    notes,
    totalPages,
    isFetching,
    isError,
    error,
    createNote,
    deleteNote,
  } = useNotes({ page, perPage, search });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleCreate = async (payload: CreateNotePayload) => {
    await createNote(payload);
    closeModal();
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchInput}
          onChange={(val) => {
            setSearchInput(val);
            onSearchChange(val);
          }}
          placeholder="Search notes"
        />

        {/* Пагинация только если страниц > 1 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}         // ← имя пропа, как в твоём Pagination
            pageCount={totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      <main>
        <NoteList
          notes={notes}
          isFetching={isFetching}
          isError={isError}
          errorMessage={isError ? (error as Error).message : undefined}
          onDelete={deleteNote}
        />
      </main>

      {isOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onSubmit={handleCreate} />
        </Modal>
      )}
    </div>
  );
}
