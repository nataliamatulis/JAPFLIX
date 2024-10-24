async function cargarDatos() {
  try {
    const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    moviesData = await response.json();
    mostrarTodasLasPeliculas();
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
}

function mostrarTodasLasPeliculas() {
  mostrarResultados(moviesData);
}

function buscarPeliculas() {
  const busqueda = document.getElementById('inputBuscar').value.toLowerCase().trim();
  
  if (!busqueda) {
    alert("Por favor ingresa un término de búsqueda.");
    return;
  }

  const resultados = moviesData.filter(pelicula =>
    pelicula.title.toLowerCase().includes(busqueda) ||
    (pelicula.genres && pelicula.genres.some(genero => genero.toLowerCase().includes(busqueda))) ||
    (pelicula.tagline && pelicula.tagline.toLowerCase().includes(busqueda)) ||
    (pelicula.overview && pelicula.overview.toLowerCase().includes(busqueda))
  );

  mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  if (resultados.length === 0) {
    lista.innerHTML = '<li class="list-group-item text-white">No se encontraron resultados.</li>';
    return;
  }

  resultados.forEach(pelicula => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item text-white';

    const estrellas = '★'.repeat(Math.round(pelicula.vote_average / 2)) + '☆'.repeat(5 - Math.round(pelicula.vote_average / 2));

    listItem.innerHTML = `
      <h5>${pelicula.title}</h5>
      <p>${pelicula.tagline}</p>
      <p>${estrellas} (${pelicula.vote_average})</p>
    `;
    
    listItem.addEventListener('click', () => mostrarDetalles(pelicula));

    lista.appendChild(listItem);
  });
}

function mostrarDetalles(pelicula) {
  document.getElementById('tituloPelicula').innerText = pelicula.title;
  document.getElementById('overviewPelicula').innerText = pelicula.overview;

  const generosPelicula = document.getElementById('generosPelicula');
  generosPelicula.innerHTML = '';

  pelicula.genres.forEach(genero => {
    const li = document.createElement('li');
    li.innerText = genero;
    generosPelicula.appendChild(li);
  });

  document.getElementById('anioLanzamiento').innerText = new Date(pelicula.release_date).getFullYear();
  document.getElementById('duracion').innerText = pelicula.runtime || 'N/A';
  document.getElementById('presupuesto').innerText = pelicula.budget ? pelicula.budget.toLocaleString() : 'N/A';
  document.getElementById('ganancias').innerText = pelicula.revenue ? pelicula.revenue.toLocaleString() : 'N/A';

  document.getElementById('detallesPelicula').style.display = 'block';

  const btnInfoAdicional = document.getElementById('btnInfoAdicional');
  const infoAdicional = document.getElementById('infoAdicional');

  btnInfoAdicional.onclick = () => {
    const esVisible = infoAdicional.style.display === 'block';
    infoAdicional.style.display = esVisible ? 'none' : 'block';
  };
}

window.onload = cargarDatos;
document.getElementById('btnBuscar').addEventListener('click', buscarPeliculas);


