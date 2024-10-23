let moviesData = []; // Variable para almacenar los datos de las películas

// Función para cargar datos de películas
async function cargarDatos() {
  try {
    const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    moviesData = await response.json();
    console.log(moviesData); // Puedes ver los datos en la consola
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
}

// Función para mostrar las películas que coinciden con la búsqueda
function mostrarResultados(resultados) {
  const lista = document.getElementById('lista');
  lista.innerHTML = ''; // Limpiar lista antes de mostrar nuevos resultados

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
    
    // Agregar evento de clic para mostrar detalles de la película
    listItem.addEventListener('click', () => mostrarDetalles(pelicula));

    lista.appendChild(listItem);
  });
}

// Función para mostrar los detalles de una película
function mostrarDetalles(pelicula) {
  document.getElementById('tituloPelicula').innerText = pelicula.title;
  document.getElementById('overviewPelicula').innerText = pelicula.overview;
  
  const generosPelicula = document.getElementById('generosPelicula');
  generosPelicula.innerHTML = ''; // Limpiar lista de géneros

  pelicula.genres.forEach(genero => {
    const li = document.createElement('li');
    li.innerText = genero;
    generosPelicula.appendChild(li);
  });

  // Información adicional
  document.getElementById('anioLanzamiento').innerText = new Date(pelicula.release_date).getFullYear();
  document.getElementById('duracion').innerText = pelicula.runtime || 'N/A';
  document.getElementById('presupuesto').innerText = pelicula.budget ? pelicula.budget.toLocaleString() : 'N/A';
  document.getElementById('ganancias').innerText = pelicula.revenue ? pelicula.revenue.toLocaleString() : 'N/A';

  document.getElementById('detallesPelicula').style.display = 'block'; // Mostrar contenedor de detalles

  // Manejador del botón de información adicional
  const btnInfoAdicional = document.getElementById('btnInfoAdicional');
  const infoAdicional = document.getElementById('infoAdicional');

  btnInfoAdicional.onclick = () => {
    const esVisible = infoAdicional.style.display === 'block';
    infoAdicional.style.display = esVisible ? 'none' : 'block'; // Alternar la visibilidad
  };
}

// Función para manejar el evento de búsqueda
function buscarPeliculas() {
  const busqueda = document.getElementById('inputBuscar').value.toLowerCase();
  const resultados = moviesData.filter(pelicula =>
    pelicula.title.toLowerCase().includes(busqueda) ||
    (pelicula.genres && pelicula.genres.some(genero => genero.toLowerCase().includes(busqueda))) ||
    (pelicula.tagline && pelicula.tagline.toLowerCase().includes(busqueda)) ||
    (pelicula.overview && pelicula.overview.toLowerCase().includes(busqueda))
  );

  mostrarResultados(resultados);
}

// Llamar a la función de carga de datos al cargar la página
window.onload = cargarDatos;

// Agregar evento al botón de búsqueda
document.getElementById('btnBuscar').addEventListener('click', buscarPeliculas);


