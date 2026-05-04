import { AppDataSource } from "../../config/database";
import { Movie } from "../../database/entities/Movie";
import { MESSAGES } from "../../messages/messages";
import { AppError } from "../../utils/AppError";
import { CreateMovieDto, GetMoviesFilter, UpdateMovieDto } from "./types";

const movieRepository = AppDataSource.getRepository(Movie);

export const create = async (movieData: CreateMovieDto): Promise<Movie> => {
  const existing = await movieRepository.findOne({
    where: { title: movieData.title.trim() },
  });

  if (existing) {
    throw new AppError(409, "CONFLICT", MESSAGES.MOVIE.ERROR.ALREADY_EXISTS);
  }

  const movie = movieRepository.create({
    ...movieData,
    isActive: true,
  });

  return movieRepository.save(movie);
};

export const getAll = async (filter: GetMoviesFilter) => {
  const { genre, language, rating, search, sortBy, sortOrder, page = 1, limit = 10 } = filter;
  const skip = (page - 1) * limit;

  const queryBuilder = movieRepository
    .createQueryBuilder("movie")
    .where("movie.isActive = :isActive", { isActive: true });

  // Movie Genre
  if (genre) queryBuilder.andWhere("movie.genre = :genre", { genre });

  // Movie Language
  if (language) queryBuilder.andWhere("movie.language = :language", { language });

  // Movie Rating
  if (rating) queryBuilder.andWhere("movie.rating = :rating", { rating });

  // Movie Search
  if (search) {
    queryBuilder.andWhere("movie.title ILIKE :search", { search: `%${search}%` });
  }

  const SORT_FIELDS: Record<string, string> = {
    title: "movie.title",
    releaseDate: "movie.releaseDate",
  };

  const orderBy = SORT_FIELDS[sortBy || "releaseDate"];

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
  if (!movie) throw new AppError(404, "MOVIE_NOT_FOUND", MESSAGES.MOVIE.ERROR.NOT_FOUND);
  return movie;
};

export const update = async (id: string, movieData: UpdateMovieDto): Promise<Movie> => {
  const movie = await getById(id);

  if (!Object.keys(movieData).length) {
    throw new AppError(400, "BAD_REQUEST", MESSAGES.MOVIE.ERROR.NO_FIELDS);
  }

  if (movieData.title && movieData.title !== movie.title) {
    const exists = await movieRepository.findOne({
      where: { title: movieData.title },
    });

    if (exists) {
      throw new AppError(409, "CONFLICT", MESSAGES.MOVIE.ERROR.ALREADY_EXISTS);
    }
  }

  if (movieData.title !== undefined) movie.title = movieData.title.trim();
  if (movieData.description !== undefined) movie.description = movieData.description.trim();
  if (movieData.genre !== undefined) movie.genre = movieData.genre.trim();
  if (movieData.language !== undefined) movie.language = movieData.language.trim();
  if (movieData.durationMinutes !== undefined) movie.durationMinutes = movieData.durationMinutes;
  if (movieData.rating !== undefined) movie.rating = movieData.rating;
  if (movieData.releaseDate !== undefined) movie.releaseDate = new Date(movieData.releaseDate);
  if (movieData.posterUrl !== undefined) movie.posterUrl = movieData.posterUrl;
  if (movieData.isActive !== undefined) movie.isActive = movieData.isActive;

  return movieRepository.save(movie);
};

export const softDelete = async (id: string): Promise<void> => {
  const result = await movieRepository.softDelete(id);

  if (!result.affected) {
    throw new AppError(404, "NOT_FOUND", MESSAGES.MOVIE.ERROR.NOT_FOUND);
  }
};
