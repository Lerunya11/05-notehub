// src/components/Pagination/Pagination.tsx
import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;           // всего страниц
  forcePage: number;           // активная страница (0-based)
  onPageChange: (item: { selected: number }) => void; // строго типизировано
}

export default function Pagination({
  pageCount,
  forcePage,
  onPageChange,
}: PaginationProps) {
  if (!Number.isInteger(pageCount) || pageCount < 1) return null;

  return (
    <div className={css.wrapper}>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        forcePage={forcePage}
        onPageChange={onPageChange}
        containerClassName={css.pagination}
        pageClassName={css.page}
        activeClassName={css.active}
        previousClassName={css.ctrl}
        nextClassName={css.ctrl}
        disabledClassName={css.disabled}
      />
    </div>
  );
}
