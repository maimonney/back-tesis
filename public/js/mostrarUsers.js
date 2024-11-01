// mostrarUsers.js

function mostrarUsuarios(usuarios) {
    const listaUsuarios = document.getElementById('lista-usuarios');
    listaUsuarios.innerHTML = ''; // Limpiar la lista antes de mostrar los usuarios

    // Iterar sobre la lista de usuarios y crear elementos de lista
    usuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.innerText = `Email: ${usuario.email}, Nombre: ${usuario.nombre}`; 
        listaUsuarios.appendChild(li); 
    });
}

// Función para obtener los usuarios desde el servidor
async function obtenerUsuarios() {
    try {
        const response = await fetch('https://back-tesis-two.vercel.app/arcana/users'); // URL de tu API
        if (!response.ok) {
            throw new Error('Error al obtener usuarios'); // Manejo de errores
        }
        const data = await response.json();
        mostrarUsuarios(data.data); // Mostrar usuarios en la lista
    } catch (error) {
        console.error('Error:', error); // Mostrar el error en la consola
    }
}

// Llamar a la función al cargar la página
window.onload = obtenerUsuarios;
