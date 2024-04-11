import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Делаем запрос к API, передавая id фильма в URL

        const response = await fetch(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
          headers: {
            'X-API-KEY': 'WF76VQQ-HQB4P5G-JFJH8DF-CRKDP1M'
          }
        });

        // Проверяем, был ли получен успешный ответ
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных о фильме');
        }

        // Если ответ успешный, парсим данные и сохраняем в состояние
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Ошибка загрузки данных о фильме:', error);
      }
    };

    fetchMovie(); // Вызываем функцию для загрузки данных о фильме при изменении id
  }, [id]);

  return (
    <div style={{ color: 'white' }}>
      {/* Отображаем информацию о фильме */}
      {movie && (
        <div>
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          {/* Здесь можно отображать остальные данные о фильме */}
        </div>
      )}
    </div>
  );
};

export default DetailPage;
