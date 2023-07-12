import { MovieResult } from "./movie-result"
export interface DatabaseResult {
    page: string;
    results: MovieResult[];
    total_pages: number;
    total_results: number;
}
