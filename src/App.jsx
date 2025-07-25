import React from 'react';
import HostComponent from './components/HostComponent';
import ClientComponent from './components/ClientComponent';
import './App.css'; // Vite crea este archivo, puedes borrar su contenido si quieres

function App() {
    // Revisa si el parámetro 'hostId' existe en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasHostId = urlParams.has('hostId');

    // Si la URL contiene un hostId, muestra el cliente. De lo contrario, muestra el anfitrión.
    return (
        <div className="App">
            {hasHostId ? <ClientComponent /> : <HostComponent />}
        </div>
    );
}

export default App;