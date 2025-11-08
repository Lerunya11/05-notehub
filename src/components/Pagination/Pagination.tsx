// src/components/Pagination/Pagination.tsx
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

export interface PaginationProps {
  pageCount: number;
  page: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, page, onPageChange }: PaginationProps) {
  if (!Number.isFinite(pageCount) || pageCount <= 1) return null;

  return (
    <ReactPaginate
      className={css.pagination}
      pageLinkClassName={css.pageLink}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      onPageChange={(e) => onPageChange(e.selected + 1)}
      pageCount={pageCount}
      forcePage={Math.max(0, page - 1)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      previousLabel="←"
      nextLabel="→"
    />
  );
}
