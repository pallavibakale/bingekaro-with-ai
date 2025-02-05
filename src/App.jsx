// Index.js
import React, { useState, useEffect } from "react";
import "./css/global.css";
import Header from "./components/header";
import MovieCard from "./components/movieCard";
import MovieDetails from "./components/movieDetails"; // Import the MovieDetail component
import "@copilotkit/react-ui/styles.css";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

const Index = () => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null); // State to hold the selected movie
  const api = "http://www.omdbapi.com/?apikey=fd9ff0fe";

  const fetchMovies = (searchInput) => {
    const query = searchInput.trim() === "" ? "all" : searchInput;

    setLoading(true);
    setError("");

    fetch(`${api}&s=${query}&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Search && data.Search.length > 0) {
          setMovies(data.Search);
        } else {
          setMovies([]);
          setError("No movies found!");
        }
      })
      .catch(() => {
        setError("Error fetching movies. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMovieClick = (movie) => {
    fetch(`${api}&i=${movie.imdbID}&plot=full`)
      .then((response) => response.json())
      .then((movie) => {
        setSelectedMovie(movie);
      })
      .catch(() => {
        setError("Error fetching movies. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBack = () => {
    setSelectedMovie(null); // Clear the selected movie to go back to the list
  };

  const movieSet =
    movies.length !== 0
      ? movies.map((movie) => (
          <div
            className="movie-card"
            onClick={() => handleMovieClick(movie)}
            key={movie.imdbID}
          >
            <MovieCard movie={movie} />
          </div>
        ))
      : error;

  useEffect(() => {
    fetchMovies(""); // Fetch movies on component mount with empty search
  }, [page]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1)); // Decrement the page number, ensuring it doesn't go below 1
  };

  useCopilotReadable({
    name: "Movies",
    description: "List of movies",
    value: movies,
  });

  // useCopilotAction({
  //   name: "Search movie",
  //   description: "Search for any movie",
  //   parameters: [
  //     {
  //       name: "title",
  //       type: "string",
  //       description: "name of the movie to be searched",
  //       required: true,
  //     },
  //   ],
  //   handler: ({ title }) => {
  //     fetchMovies(title);
  //     return "Movie was found!";
  //   },
  // });
  return (
    <>
      <Header onSearch={fetchMovies} />
      <main>
        {selectedMovie ? (
          <MovieDetails
            reviews={reviews}
            setReviews={setReviews}
            movie={selectedMovie}
            onBack={handleBack}
          /> // Show MovieDetail if a movie is selected
        ) : (
          <>
            <div id="MoviesGrid">{loading ? <p>Loading...</p> : movieSet}</div>
            {error && <p>{error}</p>}
            <div className="pagination">
              <button onClick={handlePreviousPage} disabled={page === 1}>
                Previous
              </button>
              <span className="page">Page {page}</span>
              <button onClick={handleNextPage}>Next</button>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Index;
