import React, { useState, useEffect } from "react";
import "./../css/movieDetail.css"; // Include your CSS file
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

const MovieDetails = ({ movie, onBack, reviews, setReviews }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [droppedStars, setDroppedStars] = useState([]);
  const [reviewDetailsVisible, setReviewDetailsVisible] = useState(false);

  // Fetching movie details when the component mounts
  useEffect(() => {
    if (movie) {
      // Access the review for the current movie using its ID
      const movieReview = reviews[movie.imdbID] || {};
      setRating(movieReview.rating || 0);
      setReviewText(movieReview.reviewText || ""); // Set review text or default
      if (movie.imdbID == reviews[movie.imdbID]) {
        setDroppedStars(Array(movieReview.rating).fill(0)); // Create an array of stars based on the rating if exists
      }
      setReviewDetailsVisible(!!movieReview.rating); // Show review details if a rating exists
    }
  }, [movie, reviews]);

  const handleDrop = (event) => {
    event.preventDefault();
    const starValue = parseInt(event.dataTransfer.getData("text/plain"));
    // Prevent adding the same star twice (if needed)
    const starElement = document.querySelector(
      `.star[data-value="${starValue}"]`
    );
    if (!droppedStars.includes(starValue)) {
      setDroppedStars((prev) => [...prev, starValue]);
      setRating((prevRating) => prevRating + 1); // Increment rating based on dropped stars
      starElement.remove();
    }
  };

  const handleSubmitReview = () => {
    console.log("Submitting review...");

    if (droppedStars.length > 0) {
      const reviewDetails = {
        rating: droppedStars.length,
        reviewText: reviewText || "No written review provided.",
      };
      setReviews((prevReviews) => ({
        ...prevReviews,
        [movie.imdbID]: reviewDetails,
      }));
      setReviewDetailsVisible(true);
    } else {
      alert("Please drag and drop stars to rate before submitting.");
    }
  };

  useCopilotReadable({
    name: "reviewText",
    description: "Text review of each movie",
    value: reviewText,
  });

  useCopilotReadable({
    name: "rating",
    description: "Rating of each movie",
    value: rating,
  });

  useCopilotAction({
    name: "movieReview",
    description: "Write a review for the movie",
    parameters: [
      {
        name: "star",
        type: "number",
        description: "Rating of the movie",
        required: true,
      },
      {
        name: "reviewText",
        type: "string",
        description: "Text review of the movie",
        required: false,
      },
    ],
    handler: ({ star, reviewText }) => {
      const reviewDetails = {
        rating: star,
        reviewText: reviewText || "No written review provided.",
      };
      setReviews((prevReviews) => ({
        ...prevReviews,
        [movie.imdbID]: reviewDetails,
      }));
      setReviewDetailsVisible(true);
    },
  });

  const clearReview = () => {
    setRating(0);
    setReviewText("");
    setDroppedStars([]);
    setReviewDetailsVisible(false);
    setReviews((prevReviews) => {
      const { [movie.imdbID]: _, ...rest } = prevReviews; // Remove review for the specific movie
      return rest; // Return the remaining reviews
    });
  };

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        Back
      </button>

      <div className="movie-info-container">
        <div className="moviesimg">
          <img id="moviePoster" src={movie.Poster} alt={movie.Title} />
        </div>
        <div className="movie-info">
          <h1 id="movie-name">{movie.Title}</h1>
          <div id="imdbRating">IMDB Rating: {movie.imdbRating}</div>
          <div id="runtime">Runtime: {movie.Runtime}</div>
          <div id="releaseYear">Release Year: {movie.Year}</div>
          <div id="director">Director: {movie.Director}</div>
          <div id="actors">Actors: {movie.Actors}</div>
          <div id="genre">Genre: {movie.Genre}</div>
          <div id="language">Language: {movie.Language}</div>
          <div id="moviePlot">Plot: {movie.Plot}</div>
        </div>
      </div>
      <div id="review-section">
        <div className="write_review">
          {!reviewDetailsVisible && (
            <>
              <fieldset className="rating">
                <legend>Drag stars into the box to rate:</legend>
                <div className="star-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className="star"
                      data-value={star}
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", star);
                        e.dataTransfer.setData("starHTML", e.target.outerHTML); // Set star value on drag
                      }}
                    >
                      ★
                    </div>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="dropzone">Drop stars here</label>
              <div
                className="droppable"
                id="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {droppedStars.length > 0
                  ? droppedStars.map((_, index) => "★")
                  : ""}
              </div>

              <textarea
                id="reviewText"
                placeholder="Write your review here"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
              <button
                type="button"
                id="submitReview"
                onClick={handleSubmitReview}
              >
                Submit review
              </button>
            </>
          )}
          {reviewDetailsVisible && (
            <>
              <div id="reviewDetails">
                <p id="reviewRating">You rated this {rating} star(s).</p>
                <p id="reviewTextDetail">Review: {reviewText}</p>
              </div>

              <button type="button" id="clearReview" onClick={clearReview}>
                Clear Review
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
