import React, { useState } from 'react';

function MyForm() {
    const [sintetico, setSintetico] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false); // Nuevo estado para indicar si la petición está en curso
    const [error, setError] = useState(null); // Nuevo estado para manejar errores


    const handleSubmit = async (event) => {
        // Evita que la página se recargue al enviar el formulario
        event.preventDefault();
        setLoading(true); // Activamos el estado de carga
        setError(null); // Limpiamos cualquier error anterior

        const url = 'http://localhost:3000/tipdocs'; // <<< ¡IMPORTANTE! Reemplaza esto con tu URL real
        const data = {
            sintetico: sintetico,
            descripcion: descripcion,
        };

        try {
            const response = await fetch(url, {
                method: 'POST', // Especificamos el método HTTP
                headers: {
                    'Content-Type': 'application/json', // Indicamos que estamos enviando JSON
                },
                body: JSON.stringify(data), // Convertimos los datos a una cadena JSON
            });

            if (!response.ok) { // Si la respuesta no es exitosa (ej. 400, 500)
                const errorData = await response.json(); // Intentamos leer el error del cuerpo de la respuesta
                throw new Error(errorData.message || 'Algo salió mal al iniciar sesión.');
            }

            //const result = await response.json(); // Parseamos la respuesta JSON del servidor
            const result = await response.text(); // Parseamos la respuesta como texto (puedes cambiar a JSON si el servidor responde con JSON)
            console.log('Inicio de sesión exitoso:', result);
            alert('¡Inicio de sesión exitoso! Revisa la consola para ver la respuesta del servidor.');
            // Aquí podrías redirigir al usuario, guardar un token, etc.
            setSintetico(''); // Opcional: Limpiar el formulario después del envío exitoso
            setDescripcion(''); // Opcional: Limpiar el formulario después del envío exitoso

        } catch (err) {
            console.error('Error al enviar el formulario:', err);
            setError(err.message); // Guardamos el mensaje de error para mostrarlo al usuario
        } finally {
            setLoading(false); // Siempre desactivamos el estado de carga al finalizar
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Mostramos el error si existe */}

            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    value={sintetico} // El valor del input está controlado por el estado 'email'
                    onChange={(e) => setSintetico(e.target.value)} // Cada cambio actualiza el estado
                    required
                    disabled={loading} // Deshabilitamos el input si está cargando
                />
            </div>
            <div>
                <label htmlFor="email">EMail:</label>
                <input
                    type="text"
                    id="nombre"
                    value={descripcion} // El valor del input está controlado por el estado 'password'
                    onChange={(e) => setDescripcion(e.target.value)} // Cada cambio actualiza el estado
                    required
                    disabled={loading} // Deshabilitamos el input si está cargando
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Grabando...' : 'Grabar datos'} {/* Cambiamos el texto del botón */}
            </button>
        </form>
    );
}

export default MyForm;