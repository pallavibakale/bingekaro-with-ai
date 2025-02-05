import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <>
      <img alt={movie.Title} src={movie.Poster} />
      <h2>{movie.Title}</h2>
      <p>{movie.Year}</p>
    </>
  );
};

export default MovieCard;
