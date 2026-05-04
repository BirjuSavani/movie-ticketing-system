import { MOVIE_RATINGS } from "../../config/constants";

export interface GetMoviesFilter {
  genre?: string;
  language?: string;
  rating?: (typeof MOVIE_RATINGS)[keyof typeof MOVIE_RATINGS];
  search?: string;
  sortBy?: "releaseDate" | "title";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export interface CreateMovieDto {
  title: string;
  description: string;
  genre: string;
  language: string;
  durationMinutes: number;
  rating: (typeof MOVIE_RATINGS)[keyof typeof MOVIE_RATINGS];
  releaseDate: string; // ISO string (Joi.date().iso())
  posterUrl?: string;
  isActive?: boolean;
}

export type UpdateMovieDto = Partial<CreateMovieDto>;
