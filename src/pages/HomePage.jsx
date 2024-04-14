import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Movie from '../components/Movie.jsx';
import Pagination from '../components/Pagination/Pagination.jsx';
import MoviesPerPageSelector from '../components/MoviesPerPageSelector/MoviesPerPageSelector.jsx';
import Filters from '../components/Filters/Filters.jsx';
import { useNavigate } from 'react-router-dom';
import '../App.scss';
import { fetchApi } from '../api.js'; // Импорт функции для запросов

const DEFAULT_MOVIES_PER_PAGE = 10; // Количество фильмов на одной странице по умолчанию

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [moviesPerPage, setMoviesPerPage] = useState(DEFAULT_MOVIES_PER_PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ year: '', country: '', rating: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedAuthStatus = localStorage.getItem('isAuthenticated');
    if (savedAuthStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isAuthenticated) {
        getMovies();
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, isAuthenticated, moviesPerPage, filters, searchQuery]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (password === 'avito') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
  };

  const handleMoviesPerPageChange = (event) => {
    setMoviesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    if (/^\d{4}$/.test(year)) {
      const yearNumber = parseInt(year, 10);
      if (yearNumber >= 1874 && yearNumber <= 2050) {
        setFilters({ ...filters, year });
      } else {
        alert('Год должен быть в диапазоне от 1874 до 2050');
      }
    } else if (year === '') {
      setFilters({ ...filters, year });
    } else {
      alert('Год должен состоять из 4 цифр');
    }
  };

  const handleCountryChange = (event) => {
    setFilters({ ...filters, country: event.target.value });
  };

  const handleRatingChange = (event) => {
    setFilters({ ...filters, rating: event.target.value });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = '';
      if (searchQuery) {
        url = `https://api.kinopoisk.dev/v1.4/movie/search?query=${searchQuery}`;
      } else {
        url = `https://api.kinopoisk.dev/v1.4/movie?page=${currentPage}&limit=${moviesPerPage}`;
        if (filters.year) {
          url += `&year=${filters.year}`;
        }
        if (filters.country) {
          url += `&countries.name=${filters.country}`;
        }
        if (filters.rating) {
          url += `&ageRating=${filters.rating}`;
        }
      }
      const respData = await fetchApi(url, 'Ошибка загрузки фильмов');
      setMovies(respData.docs);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки фильмов:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div>
      <Header handleSearch={handleSearch} />
      {isAuthenticated && (
        <div className="container">
          <button onClick={handleLogout}>Выйти</button>
        </div>
      )}
      {isAuthenticated ? (
        <div className="container">
          <Filters
            handleYearChange={handleYearChange}
            handleCountryChange={handleCountryChange}
            handleRatingChange={handleRatingChange}
          />
          {isLoading && <div className="loading">Загрузка...</div>}
          {(error || movies.length == 0) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '25px',
              }}>
              НИЧЕГО НЕ НАЙДЕНО
            </div>
          )}
          {!isLoading && !error && (
            <div>
              <MoviesPerPageSelector
                moviesPerPage={moviesPerPage}
                handleMoviesPerPageChange={handleMoviesPerPageChange}
              />
              <div className="container movies">
                {movies.map((movie) => (
                  <Movie key={movie.id} movie={movie} onMovieClick={handleMovieClick} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPreviousPage={goToPreviousPage}
                goToNextPage={goToNextPage}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="container">
          <form onSubmit={handleFormSubmit}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Введите пароль"
            />
            <button type="submit">Войти</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;
