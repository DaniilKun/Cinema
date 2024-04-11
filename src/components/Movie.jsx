import React from 'react';

const Movie = ({ movie, onMovieClick }) => {
  const getClassByRate = (vote) => {
    if (vote >= 7) {
      return "green";
    } else if (vote > 5) {
      return "orange";
    } else {
      return "red";
    }
  };

  const handleClick = () => {
    onMovieClick(movie.id);
  };

  return (
    <div className="movie" onClick={handleClick}>
      <div className="movie__cover-inner">
        <img
          src={movie.poster.previewUrl}
          className="movie__cover"
          alt={movie.nameRu}
        />
        <div className="movie__cover--darkened"></div>
      </div>
      <div className="movie__info">
        <div className="movie__title">{movie.name}</div>
        <div className="movie__category">
          {movie.genres.map(genre => genre.name).join(', ')}
        </div>
        {movie.rating.imdb ? (
          <div className={`movie__average movie__average--${getClassByRate(movie.rating.imdb)}`}>
            {movie.rating.imdb}
          </div>
        ) : ''}
      </div>
    </div>
  );
}

export default Movie;
