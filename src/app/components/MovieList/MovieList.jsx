"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useDebounce from "@/app/hooks/useDebounce";
import { getMovies } from "../../services/movieService";
import styles from "./styles.module.scss";
import Image from "next/image";
import searchIcon from "@/assets/images/searchIconWhite.svg";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function MovieList() {
  const [state, setState] = useState({
    movies: [],
    total: 0,
    skip: 0,
    query: "",
    loading: false,
    error: null,
  });

  const limit = 10;
  const maxRetries = 3;
  const retryDelay = 1000;
  const debouncedInput = useDebounce(state.query, 1000);
  const cache = useRef({});
  
  useEffect(() => {
    if (state.movies?.length === 0 || state.query === "") {
      fetchData();
    }
  }, [state.skip, state.query, state.movies]);

  useEffect(() => {
    if (debouncedInput) {
      setState((prevState) => ({ ...prevState, loading: true }));
      fetchData();
    }
    if (state.query !== debouncedInput) {
      cache.current = {};
    }
  }, [state.skip, debouncedInput]);

  const fetchMovies = async (data) => {
    try {
      const response = await getMovies(data);
      return response;
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchData = useCallback(async () => {
    const queryKey = `${state.query || "all"}-${state.skip}`;

    if (cache.current[queryKey]) {
      setState((prevState) => ({
        ...prevState,
        movies: cache.current[queryKey],
        loading: false,
      }));
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true, error: null }));

    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const data = await fetchMovies({
          skip: state.skip,
          limit,
          query: state.query,
        });

        if (data) {
          cache.current[queryKey] = data.items || [];
          setState((prevState) => ({
            ...prevState,
            movies: data.items || [],
            total: data.total || 0,
            loading: false,
          }));
          return;
        }
      } catch (err) {
        setState((prevState) => ({ ...prevState, error: err }));
        console.error(`Retry ${attempt + 1} failed:`, err);
      }
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    setState((prevState) => ({ ...prevState, loading: false }));
  }, [state.query, state.skip, limit, maxRetries, retryDelay]);

  const handleNextPage = () => {
    if (state.skip + limit < state.total) {
      setState((prevState) => ({
        ...prevState,
        skip: prevState.skip + limit,
      }));
    }
  };

  const handlePrevPage = () => {
    if (state.skip >= limit) {
      setState((prevState) => ({
        ...prevState,
        skip: prevState.skip - limit,
      }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      query: e.target.value,
      skip: 0,
    }));
  };

  return (
    <div>
      <div className={styles.search_wrapper}>
        <h1>Movie List</h1>
        <form
          onChange={handleSearch}
          onSubmit={handleSearch}
          className={styles.search_form}
        >
          <input
            type="text"
            placeholder="Search movies..."
            defaultValue={state.query}
            className={styles.search_input}
          />

          <button type="submit" className={styles.search_button}>
            <Image src={searchIcon} alt="Search Icon" width={24} height={24} />
          </button>
        </form>
      </div>

      {state.loading ? (
        <LoadingSpinner />
      ) : state.movies ? (
        <div className={styles.movie_grid}>
          {state.movies?.map((movie) => (
            <div key={movie.id} className={styles.movie_card}>
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.no_movies}>No movies to show, try again</p>
      )}

      {!state.loading && state.movies.length === 0 && state.query !== "" && (
        <p className={styles.no_movies}>
          No movies match your search. Please try another search.
        </p>
      )}

      {state.error && (
        <p className={styles.no_movies}>
          There was an error. Please try again later.
        </p>
      )}

      <div className={styles.pagination}>
        <button
          onClick={handlePrevPage}
          disabled={state.skip === 0}
          className={styles.pagination_buttons}
        >
          ⇦
        </button>
        <span className={styles.pagination_text}>
          Page
          <span style={{ color: "orange" }}>
            {Math.ceil(state.skip / limit) + 1}
          </span>
          of {Math.ceil(state.total / limit)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={state.skip + limit >= state.total}
          className={styles.pagination_buttons}
        >
          ⇨
        </button>
      </div>
    </div>
  );
}
