document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = 'https://japceibal.github.io/japflix_api/movies-data.json';
  let moviesData = [];

  try {
    const response = await fetch(apiUrl);
    moviesData = await response.json();
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }

  const searchButton = document.getElementById('btnBuscar');
  const searchInput = document.getElementById('inputBuscar');
  const movieList = document.getElementById('lista');

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase().trim();
    movieList.innerHTML = '';

    if (query) {
      const filteredMovies = moviesData.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genres.join(', ').toLowerCase().includes(query) ||
        movie.tagline.toLowerCase().includes(query) ||
        movie.overview.toLowerCase().includes(query)
      );

      filteredMovies.forEach(movie => {
        const movieItem = document.createElement('li');
        movieItem.classList.add('list-group-item', 'bg-dark', 'text-light');
        movieItem.innerHTML = `
          <h5>${movie.title}</h5>
          <p>${movie.tagline}</p>
          <div class="stars">
            ${generateStars(movie.vote_average)}
          </div>
        `;

        movieItem.addEventListener('click', () => showMovieDetails(movie));

        movieList.appendChild(movieItem);
      });
    }
  });

  function generateStars(voteAverage) {
    const fullStars = Math.floor(voteAverage / 2);
    const halfStar = voteAverage % 2 >= 0.5;
    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<span class="fa fa-star checked"></span>';
    }
    if (halfStar) {
      starsHtml += '<span class="fa fa-star-half-o checked"></span>';
    }

    return starsHtml;
  }

  function showMovieDetails(movie) {
      const formattedBudget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(movie.budget);
      const formattedRevenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(movie.revenue);
    
      const movieDetailsContainer = document.createElement('div');
      movieDetailsContainer.classList.add('offcanvas', 'offcanvas-top', 'bg-dark', 'text-light');
      movieDetailsContainer.innerHTML = `
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">${movie.title}</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <p>${movie.overview}</p>
          <p><strong>Géneros:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
          
          <div class="dropdown mt-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMovieDetails" data-bs-toggle="dropdown" aria-expanded="false">
              Más información
            </button>
            <ul class="dropdown-menu bg-dark text-light" aria-labelledby="dropdownMovieDetails">
              <li class="dropdown-item bg-dark text-light"><strong>Año de lanzamiento:</strong> ${movie.release_date.split('-')[0]}</li>
              <li class="dropdown-item bg-dark text-light"><strong>Duración:</strong> ${movie.runtime} min</li>
              <li class="dropdown-item bg-dark text-light"><strong>Presupuesto:</strong> ${formattedBudget}</li>
              <li class="dropdown-item bg-dark text-light"><strong>Ganancias:</strong> ${formattedRevenue}</li>
            </ul>
          </div>
    
          <button class="btn btn-secondary mt-3" data-bs-dismiss="offcanvas">Cerrar</button>
        </div>
      `;
    
      document.body.appendChild(movieDetailsContainer);
      const offcanvas = new bootstrap.Offcanvas(movieDetailsContainer);
      offcanvas.show();
    }
});

