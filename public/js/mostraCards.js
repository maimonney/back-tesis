const mostrarVuelos = async () => {
  try {
    const response = await fetch('https://back-tesis-two.vercel.app/arcana/vuelos/');

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Tipo de contenido:", contentType); 

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      const { vuelosAPI } = data;

      const contenedorVuelos = document.getElementById("vuelosContainer");
      contenedorVuelos.innerHTML = "";

      if (!vuelosAPI || vuelosAPI.length === 0) {
        contenedorVuelos.innerHTML = "<p>No se encontraron vuelos disponibles.</p>";
        return;
      }

      // Mostrar vuelos en formato JSON
      const jsonString = JSON.stringify(vuelosAPI, null, 2);
      contenedorVuelos.innerHTML = `<pre>${jsonString}</pre>`;

    } else {
      console.error("La respuesta no es JSON. Tipo de contenido:", contentType);
      throw new Error("La respuesta no es JSON");
    }

  } catch (error) {
    console.error("Error al obtener los vuelos:", error);
    const contenedorVuelos = document.getElementById("vuelosContainer");
    contenedorVuelos.innerHTML = "<p>Error al cargar los vuelos. Intenta de nuevo más tarde.</p>";
  }
};

window.onload = mostrarVuelos;
