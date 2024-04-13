import axios from 'axios'

export const MovieService = {
  async getById(id) {
    const responce = await axios.get(
      `https://api.kinopoisk.dev/v1.4/movie/${id}`
    )
    return responce.data[0]
  }
}