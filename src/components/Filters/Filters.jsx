import React from 'react';
import * as styles from './Filters.module.scss';


const Filters = ({ handleYearChange, handleCountryChange, handleRatingChange }) => {
  return (
    <div className={styles.filters}>
      <label>
        Год:
        <input type="text" onChange={handleYearChange} />
      </label>
      <label>
        Страна:
        <input type="text" onChange={handleCountryChange} />
      </label>
      <label>
        Возрастной рейтинг:
        <select onChange={handleRatingChange}>
          <option value="">Все</option>
          <option value="0">0+</option>
          <option value="6">6+</option>
          <option value="12">12+</option>
          <option value="16">16+</option>
          <option value="18">18+</option>
        </select>
      </label>
    </div>
  );
};

export default Filters;
