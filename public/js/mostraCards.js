// Función para obtener y mostrar los vuelos
const mostrarVuelos = async () => {
  try {
    const response = await fetch("https://back-tesis-two.vercel.app/arcana/vuelos");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { vuelosAPI } = data;

    const contenedorVuelos = document.getElementById("vuelosContainer");
    contenedorVuelos.innerHTML = "";

    if (!vuelosAPI || vuelosAPI.length === 0) {
      contenedorVuelos.innerHTML = "<p>No se encontraron vuelos disponibles.</p>";
      return;
    }

    // Mostrar vuelos de la API
    vuelosAPI.forEach((vuelo) => {
      const vueloElemento = document.createElement("div");
      vueloElemento.classList.add("vuelo-card"); 
      vueloElemento.innerHTML = `
          <h3>Vuelo desde API</h3>
          <p>Aerolínea: ${vuelo.airline || "No especificada"}</p>
          <img src="${vuelo.logo}" alt="${vuelo.airline}" style="width: 70px; height: auto;">
          <p>Origen: ${vuelo.origin || "No especificado"}</p>
          <p>Destino: ${vuelo.destination || "No especificado"}</p>
          <p>Duración del Vuelo: ${vuelo.duration ? vuelo.duration + " minutos" : "No especificado"}</p>
          <p>Precio: ARS ${vuelo.price || "No especificado"}</p>
          <p>Número de Vuelo: ${vuelo.flight_number || "No especificado"}</p>
          <p>Fecha de Salida: ${vuelo.departure_at ? new Date(vuelo.departure_at).toLocaleString() : "No especificado"}</p>
          <hr>
        `;
      contenedorVuelos.appendChild(vueloElemento);
    });

  } catch (error) {
    console.error("Error al obtener los vuelos:", error);
    const contenedorVuelos = document.getElementById("vuelosContainer");
    contenedorVuelos.innerHTML = "<p>Error al cargar los vuelos. Intenta de nuevo más tarde.</p>";
  }
};

window.onload = mostrarVuelos;
