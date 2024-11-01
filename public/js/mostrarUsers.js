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
