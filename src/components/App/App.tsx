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
  // локальные состояния
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // дебаунс поиска (+ сброс страницы на 1)
  const onSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 300);

  // данные/мутации
  const {
    notes,
    totalPages,
    isFetching,
    isError,
    error,
    createNote,
    deleteNote,
  } = useNotes({ page, perPage, search });

  // модалка
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // создание заметки
  const handleCreate = async (payload: CreateNotePayload) => {
    await createNote(payload);
    closeModal();
  };

  // безопасное значение числа страниц
  const pages = Number.isFinite(totalPages) ? totalPages : 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* SearchBox ожидает value и onChange */}
        <SearchBox value={search} onChange={onSearchChange} />

        {/* ВАЖНО: пагинация показывается ТОЛЬКО когда страниц > 1 */}
        {pages > 1 && (
          <Pagination
            pageCount={pages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Создать заметку +
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
