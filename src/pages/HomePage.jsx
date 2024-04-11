import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Movie from '../components/Movie';
import Pagination from '../components/Pagination';
import MoviesPerPageSelector from '../components/MoviesPerPageSelector';
import Filters from '../components/Filters';
import { useNavigate } from 'react-router-dom';


const DEFAULT_MOVIES_PER_PAGE = 10; // Количество фильмов на одной странице по умолчанию
const API_KEY = 'WF76VQQ-HQB4P5G-JFJH8DF-CRKDP1M';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [moviesPerPage, setMoviesPerPage] = useState(DEFAULT_MOVIES_PER_PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Состояние для отображения статуса загрузки
  const [filters, setFilters] = useState({ year: '', country: '', rating: '' });
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для хранения поискового запроса
  const [error, setError] = useState(null); // Состояние для хранения ошибки при загрузке данных

  const navigate = useNavigate();

  const API_URL_POPULAR = `https://api.kinopoisk.dev/v1.4/movie?page=${currentPage}&limit=${moviesPerPage}`;

  useEffect(() => {
    const savedAuthStatus = localStorage.getItem('isAuthenticated');
    if (savedAuthStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isAuthenticated) {
        getMovies(API_URL_POPULAR);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, isAuthenticated, moviesPerPage, filters, searchQuery]); // Обновляем эффект при изменении поискового запроса

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
    setSearchQuery(query); // Обновляем состояние поискового запроса
  };

  const getMovies = async () => {
    setIsLoading(true);
    setError(null); // Сбрасываем предыдущую ошибку перед новым запросом
    try {
      let url = '';
      if (searchQuery) {
        // Если есть поисковый запрос, обращаемся к эндпоинту поиска
        url = `https://api.kinopoisk.dev/v1.4/movie/search?query=${searchQuery}`;
      } else {
        // Иначе обращаемся к эндпоинту для популярных фильмов
        url = API_URL_POPULAR;
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
      const resp = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY,
        },
      });
      if (!resp.ok) {
        throw new Error('Ошибка загрузки фильмов');
      }
      const respData = await resp.json();
      setMovies(respData.docs);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки фильмов:', error);
      setError(error.message); // Сохраняем ошибку в состоянии
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
      {/* Передаем функцию handleSearch в компонент Header */}
      {isAuthenticated && (
        <div className="container">
          <button onClick={handleLogout}>Выйти</button>
        </div>
      )}
      {isAuthenticated ? (
        <div>
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
          {/* Отображаем сообщение об ошибке */}
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
