// src/components/Pagination/Pagination.tsx
import ReactPaginate from 'react-paginate';
import type { FC } from 'react';

import css from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  // если всего одна страница — пагинация не нужна
  if (totalPages <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      // сколько всего страниц
      pageCount={totalPages}
      // текущая страница (ReactPaginate нумерует с 0)
      forcePage={page - 1}
      // колбэк, где мы конвертируем номер страницы обратно в 1-based
      onPageChange={selectedItem => onPageChange(selectedItem.selected + 1)}
      // подписи кнопок
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      // классы для стилизации
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      previousClassName={css.prev}
      nextClassName={css.next}
      breakClassName={css.break}
      disabledClassName={css.disabled}
    />
  );
};

export default Pagination;
