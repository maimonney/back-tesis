// Función para obtener y mostrar los vuelos
const mostrarVuelos = async () => {
  try {
    const response = await fetch("http://localhost:3000/arcana/vuelos"); // Cambia esta URL según tu endpoint
    const data = await response.json();

    // Acceder a los vuelos combinados
    const { vuelosMongoDB, vuelosAPI } = data;

    // Seleccionar el contenedor donde mostrar los vuelos
    const contenedorVuelos = document.getElementById("vuelosContainer");
    contenedorVuelos.innerHTML = ""; // Limpiar contenedor

    // Mostrar vuelos de MongoDB
    vuelosMongoDB.forEach((vuelo) => {
      const vueloElemento = document.createElement("div");
      vueloElemento.innerHTML = `
                <h3>Vuelo desde MongoDB</h3>
                <p>Aerolínea: ${vuelo.aerolinea || "No especificada"}</p>
                <p>Número de Vuelo: ${vuelo.numeroVuelo}</p>
                <p>Precio: ${vuelo.value}</p>
                <hr>
            `;
      contenedorVuelos.appendChild(vueloElemento);
    });

    // Mostrar vuelos de la API
    vuelosAPI.forEach((vuelo) => {
        const vueloElemento = document.createElement("div");
        vueloElemento.innerHTML = `
          <h3>Vuelo desde API</h3>
          <p>Aerolínea: ${vuelo.airline || "No especificada"}</p>
          <img src="${vuelo.logo}" alt="${vuelo.airline}" style="width: 70px; height: auto;">
          <p>Origen: ${vuelo.origin || "No especificado"}</p>
          <p>Destino: ${vuelo.destination || "No especificado"}</p>
          <p>Duración del Vuelo: ${
            vuelo.duration ? vuelo.duration + " minutos" : "No especificado"
          }</p>
          <p>Precio: ARS ${vuelo.price || "No especificado"}</p>
          <p>Número de Vuelo: ${vuelo.flight_number || "No especificado"}</p>
          <p>Fecha de Salida: ${
            vuelo.departure_at
              ? new Date(vuelo.departure_at).toLocaleString()
              : "No especificado"
          }</p>
          <hr>
        `;
        contenedorVuelos.appendChild(vueloElemento);
      });
      
  } catch (error) {
    console.error("Error al obtener los vuelos:", error);
  }
};

// Llamar a la función para mostrar los vuelos al cargar la página
window.onload = mostrarVuelos;
