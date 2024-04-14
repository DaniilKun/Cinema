import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as styles from './DetailPage.module.scss';
import Person from '../components/Person/Person.jsx';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchApi } from '../api.js';

const DetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedSeasonPage, setSelectedSeasonPage] = useState(1);
  const [posters, setPosters] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
  const [seasonsCurrentPage, setSeasonsCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, seasonsData, postersData, reviewsData] = await Promise.all([
          fetchApi(`https://api.kinopoisk.dev/v1.4/movie/${id}`, 'Ошибка загрузки данных о фильме'),
          fetchApi(`https://api.kinopoisk.dev/v1.4/season?page=${seasonsCurrentPage}&limit=10&movieId=${id}`, 'Ошибка загрузки данных о сезонах'),
          fetchApi(`https://api.kinopoisk.dev/v1.4/image?page=1&limit=10&movieId=${id}`, 'Ошибка загрузки данных о постерах'),
          fetchApi(`https://api.kinopoisk.dev/v1.4/review?page=${reviewsCurrentPage}&limit=10&movieId=${id}`, 'Ошибка загрузки данных о отзывах'),
        ]);
        const uniquePersons = Array.from(new Set(movieData.persons.map((person) => person.id))).map((id) => {
          return movieData.persons.find((person) => person.id === id);
        });
        setMovie({ ...movieData, persons: uniquePersons });
        setSeasons(seasonsData.docs);
        setPosters(postersData.docs);
        setReviews(reviewsData.docs);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, [id, seasonsCurrentPage, reviewsCurrentPage]);

  const paginateActors = (actors, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return actors.slice(startIndex, endIndex);
  };

  const paginateEpisodes = (episodes, pageSize) => {
    const startIndex = (selectedSeasonPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return episodes.slice(startIndex, endIndex);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousSeasonPage = () => {
    setSelectedSeasonPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextSeasonPage = () => {
    setSelectedSeasonPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(seasons.find((season) => season.number === selectedSeason).episodes.length / 10),
      ),
    );
  };

  const goToPreviousReviewsPage = () => {
    setReviewsCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextReviewsPage = () => {
    setReviewsCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousSeasonsPage = () => {
    setSeasonsCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextSeasonsPage = () => {
    setSeasonsCurrentPage((prevPage) => prevPage + 1);
  };

  const settings = {
    speed: 500,
    slidesToShow: 3, // Отображаем 3 слайда одновременно
    slidesToScroll: 1,
    centerMode: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  
  if(!movie) {
    return <>undefined</>
  }

  return (
    <div>
      <div className={styles.container}>
    <Link to={`/`}>
        <button>Назад к выдаче</button>
      </Link>
        <div className={styles.avatar}>
          <img src={movie.poster.previewUrl} alt={movie.nameRu} />
          <div className={styles.rating}>{movie.rating.imdb && movie.rating.imdb}</div>
        </div>

        <h1>{movie.name}</h1>
        <div className={styles.postersContainer}>
          Описание: <p>{movie.description}</p>
        </div>
        <div>
          Актеры:
          {movie.persons && movie.persons.length > 0 ? (
            <div className={styles.cards}>
              {paginateActors(movie.persons, 10).map((person) => (
                <Person key={person.id} name={person.name} img={person.photo} />
              ))}
            </div>
          ) : (
            <p>Нет информации об актёрах</p>
          )}
        </div>

        <div className={styles.pagination}>
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Предыдущая страница
          </button>
          <span>{currentPage}</span>
          <button onClick={goToNextPage} disabled={currentPage === Math.ceil(movie.persons.length / 10)}>
            Следующая страница
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <h2>Сезоны и серии</h2>
        <div className={styles.seasons}>
          Сезоны:
          {seasons && seasons.length > 0 ? (
            seasons
              .sort((a, b) => a.number - b.number)
              .map((season) => (
                <button
                  key={season.number}
                  className={season.number === selectedSeason ? styles.selected : styles.season}
                  onClick={() => {
                    setSelectedSeason(season.number);
                    setSelectedSeasonPage(1);
                  }}>
                  {season.number}
                </button>
              ))
          ) : (
            <p>Нет информации о сезонах</p>
          )}
          {seasons.length > 10 && (
            <div className={styles.pagination}>
              <button onClick={goToPreviousSeasonsPage} disabled={seasonsCurrentPage === 1}>
                Предыдущая страница
              </button>
              <span>{seasonsCurrentPage}</span>
              <button onClick={goToNextSeasonsPage} disabled={seasons.length < 10}>
                Следующая страница
              </button>
            </div>
          )}
        </div>
        {seasons &&
          seasons
            .filter((season) => season.number === selectedSeason)
            .map((season) => (
              <div key={season.id}>
                <ul>
                  {paginateEpisodes(season.episodes, 10).map((episode) => (
                    <li key={episode.id}>
                      {episode.number}. {episode.name}
                    </li>
                  ))}
                </ul>
                {season.episodes.length > 10 && (
                  <div className={styles.pagination}>
                    <button onClick={goToPreviousSeasonPage} disabled={selectedSeasonPage === 1}>
                      Предыдущая страница
                    </button>
                    <span>{selectedSeasonPage}</span>
                    <button
                      onClick={goToNextSeasonPage}
                      disabled={selectedSeasonPage === Math.ceil(season.episodes.length / 10)}>
                      Следующая страница
                    </button>
                  </div>
                )}
              </div>
            ))}
      </div>

      {posters.length > 0 && (
        <div >
          <div className={styles.postersContainer}>
          <h2>Постеры</h2>
          <Slider {...settings}>
            {posters.map((poster) => (
              <img key={poster.id} src={poster.previewUrl} alt={`Poster ${poster.id}`} />
            ))}
          </Slider>
        </div>
        </div>
        
      )}

      <div className={styles.container}>
        <h2>Отзывы</h2>
        {reviews && reviews.length > 0 ? (
          <div className={styles.reviewBlock}>
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className={styles.reviewItem}>
                  <p>Автор: {review.author}</p>
                  <p>Текст: {review.title}</p>
                  <p>Рейтинг: {review.userRating}</p>
                </li>
              ))}
            </ul>

            <div className={styles.pagination}>
              <button onClick={goToPreviousReviewsPage} disabled={reviewsCurrentPage === 1}>
                Предыдущая страница
              </button>
              <span>{reviewsCurrentPage}</span>
              <button onClick={goToNextReviewsPage}>Следующая страница</button>
            </div>
          </div>
        ) : (
          <p>Нет отзывов</p>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
