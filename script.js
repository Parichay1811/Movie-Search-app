const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieContainer = document.getElementById('movieContainer');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumber = document.getElementById('pageNumber');
const popupOverlay = document.getElementById('popupOverlay');
const moviePopup = document.getElementById('moviePopup');
const popupContent = document.getElementById('popupContent');
const closePopup = document.getElementById('closePopup');

let currentPage = 1;
let searchQuery = '';

const fetchMovies = async (query, page) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=816fcab1&s=${encodeURIComponent(query)}&page=${page}`);
  return response.json();
};

const renderMovies = async () => {
  movieContainer.innerHTML = 'Loading...';
  const data = await fetchMovies(searchQuery, currentPage);
  movieContainer.innerHTML = '';

  if (data.Response === 'True') {
    data.Search.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title}">
        <div class="movie-details">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
        </div>
      `;
      movieContainer.appendChild(movieCard);

      movieCard.addEventListener('click', () => showMovieDetails(movie.imdbID));
    });
    pagination.style.display = 'flex';
  } else {
    movieContainer.innerHTML = '<p>No movies found!</p>';
    pagination.style.display = 'none';
  }
};

const showMovieDetails = async (id) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=816fcab1&i=${id}`);
  const movie = await response.json();

  popupContent.innerHTML = `
    <h2>${movie.Title}</h2>
    <img src="${movie.Poster}" alt="${movie.Title}" style="max-width: 200px;">
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
  `;

  popupOverlay.style.display = 'block';
  moviePopup.style.display = 'block';
};

const closeMoviePopup = () => {
  popupOverlay.style.display = 'none';
  moviePopup.style.display = 'none';
};

searchBtn.addEventListener('click', () => {
  searchQuery = searchInput.value.trim();
  currentPage = 1;
  pageNumber.innerText = currentPage;
  renderMovies();
});

nextBtn.addEventListener('click', () => {
  currentPage++;
  pageNumber.innerText = currentPage;
  renderMovies();
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    pageNumber.innerText = currentPage;
    renderMovies();
  }
});

closePopup.addEventListener('click', closeMoviePopup);
popupOverlay.addEventListener('click', closeMoviePopup);
