import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import LoadingSpinner from "./components/LoadingSpinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [debouncedSearchedTerm, setDebouncedSearchedTerm] = useState("");

  // useDebounce hooks is used to prevent too many API requests by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchedTerm(searchTerm), 500, [searchTerm]);

  // A function to fetch movies
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Browsers does not allow URLs to contain certain characters directly,  If the characters are not encoded the browser may break the URL, fail our request or the server may misinterpret it.
      // encodeURIComponent(): Function in simple terms, converts some query characters to the url format the browser allws i.e: (space) to 20%, "" to '' and other Non-ASCII characters and emoji
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // The fetch function does not throw an error if the promise is rejected, It only throws an error if our request has been failed to sent, thats why we manually throw an error
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      setMovieList(data.results || []);
      console.log(data);
    } catch (err) {
      console.error(`Error fetching movies: ${err}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchedTerm);
  }, [debouncedSearchedTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />

          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hussle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="text-white mt-10">All Movies</h2>

          {isLoading ? (
            <LoadingSpinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
