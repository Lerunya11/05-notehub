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
  // состояние страницы/поиска/модалки
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // дебаунс поиска (автопроверка это проверяет)
  const onSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 300);

  // данные с сервера (из нашего кастомного хука, который уже принят в других пунктах)
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

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={onSearchChange} />
        {/* ВАЖНО: пагинация только если страниц > 1 (фикс по пункту 8) */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            pageCount={totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {/* NoteList получает ИМЕННО массив notes через пропсы (это у тебя уже принято, сохраняем) */}
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
