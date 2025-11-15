import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';

import { useNotes } from '../../hooks/useNotes';

import css from './App.module.css';

const PER_PAGE = 12;

const App = () => {
  // страница
  const [page, setPage] = useState(1);

  // "сырое" значение инпута поиска
  const [searchInput, setSearchInput] = useState('');

  // реальное значение для запроса (установится с задержкой)
  const [search, setSearch] = useState('');

  // дебаунс: ждём 300мс после ввода и только потом обновляем search
  const debouncedUpdateSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1); // при новом поиске всегда на первую страницу
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedUpdateSearch(value);
  };

  // модалка
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // получаем данные заметок через хук useNotes (TanStack Query)
  const { data, isLoading, isError } = useNotes({
    page,
    perPage: PER_PAGE,
    search: search || undefined,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  const shouldShowPagination = totalPages > 1;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* слева — поиск */}
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {/* по центру — пагинация (только если страниц больше 1) */}
        {shouldShowPagination && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* справа — кнопка создания заметки */}
        <button
          type="button"
          className={css.button}
          onClick={handleOpenModal}
        >
          Create note +
        </button>
      </header>

      <main className={css.main}>
        {notes.length > 0 && (
          <NoteList
            notes={notes}
            isLoading={isLoading}
            isError={!!isError}
          />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default App;
