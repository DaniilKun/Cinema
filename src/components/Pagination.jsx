import React from 'react';
import styles from './Pagination.module.scss'

const Pagination = ({ currentPage, totalPages, goToPreviousPage, goToNextPage }) => {
  return (
    <div className={styles.container}>
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
      >
        Предыдущая страница
      </button>
      <span>{currentPage} </span>
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        Следующая страница
      </button>
    </div>
  );
}

export default Pagination;
