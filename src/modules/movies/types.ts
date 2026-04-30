export interface GetMoviesFilter {
  genre?: string;
  language?: string;
  rating?: string;
  search?: string;
  sortBy?: 'releaseDate' | 'title';
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
  page?: number;
  limit?: number;
}
