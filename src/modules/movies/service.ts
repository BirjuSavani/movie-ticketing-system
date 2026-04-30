import { AppDataSource } from "../../config/database";
import { Movie } from "../../database/entities/Movie";
import { AppError } from "../../utils/AppError";
import { GetMoviesFilter } from "./types";

const movieRepository = AppDataSource.getRepository(Movie);

export const create = async (data: Partial<Movie>): Promise<Movie> => {
  const movie = movieRepository.create(data);
  return await movieRepository.save(movie as Movie);
};

export const getAll = async (filter: GetMoviesFilter) => {
  const { genre, language, rating, search, sortBy, sortOrder, page = 1, limit = 10 } = filter;
  const skip = (page - 1) * limit;

  const queryBuilder = movieRepository
    .createQueryBuilder("movie")
    .where("movie.isActive = :isActive", { isActive: true });

  if (genre) queryBuilder.andWhere("movie.genre = :genre", { genre });
  if (language) queryBuilder.andWhere("movie.language = :language", { language });
  if (rating) queryBuilder.andWhere("movie.rating = :rating", { rating });

  if (search) {
    queryBuilder.andWhere("movie.title ILIKE :search", { search: `%${search}%` });
  }

  const orderBy = sortBy === "title" ? "movie.title" : "movie.releaseDate";
  const orderDirection = sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  queryBuilder.orderBy(orderBy, orderDirection);
  queryBuilder.skip(skip).take(limit);

  const [movies, total] = await queryBuilder.getManyAndCount();

  return {
    movies,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getById = async (id: string): Promise<Movie> => {
  const movie = await movieRepository.findOne({ where: { id } });
  if (!movie) throw new AppError(404, "MOVIE_NOT_FOUND", "Movie not found.");
  return movie;
};

export const update = async (id: string, data: any): Promise<Movie> => {
  const movie = await getById(id);
  Object.assign(movie, data);
  return await movieRepository.save(movie);
};

export const softDelete = async (id: string): Promise<void> => {
  const movie = await getById(id);
  await movieRepository.softRemove(movie);
};
