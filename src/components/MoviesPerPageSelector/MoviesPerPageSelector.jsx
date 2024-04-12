import React from 'react';
import styles from './MoviesPerPageSelector.module.scss'

const MoviesPerPageSelector = ({ moviesPerPage, handleMoviesPerPageChange }) => {
  return (
    <div className={styles.container}>
      <label>
        Количество фильмов на странице:
        <select value={moviesPerPage} onChange={handleMoviesPerPageChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </label>
    </div>
  );
}

export default MoviesPerPageSelector;
