async function obtenerUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/arcana/usuarios');

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        const data = await response.json();
        mostrarUsuarios(data.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarUsuarios(usuarios) {
    const listaUsuarios = document.getElementById('lista-usuarios');
    listaUsuarios.innerHTML = ''; 

    usuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.innerText = `Email: ${usuario.email}, Nombre: ${usuario.nombre}`; 
        listaUsuarios.appendChild(li); 
    });
}

window.onload = obtenerUsuarios; 
