import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

function useTourReclamos() {
  const driverRef = useRef(null);

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Atrás',
      doneBtnText: 'Finalizar',
      steps: [
        {
          element: '#patrocinantes',
          popover: {
            title: 'Crear reclamo',
            description: 'Hacé click acá para iniciar un nuevo reclamo.',
          },
        },
        {
          element: '#partes',
          popover: {
            title: 'Filtrar por fecha',
            description: 'Filtrá los reclamos por rango de fechas.',
          },
        },
        {
          element: '#reclamos',
          popover: {
            title: 'Filtrar por estado',
            description: 'También podés filtrar por estado: pendiente, resuelto, etc.',
          },
        },
        {
          element: '#username',
          popover: {
            title: 'Filtrar por estado',
            description: 'También podés filtrar por estado: pendiente, resuelto, etc.',
          },
        },        
      ],
    });

    return () => driverRef.current?.destroy();
  }, []);

  const iniciarTour = () => driverRef.current?.drive();

  return iniciarTour;
}

function ReclamosPage() {
  const iniciarTour = useTourReclamos();

  useEffect(() => {
    if (!localStorage.getItem('tourInicialVisto')) {
      iniciarTour();
      localStorage.setItem('tourInicialVisto', 'true');
    }
  }, []);

  return (
    <div>
      <button onClick={iniciarTour}>¿Cómo funciona esto?</button>
    </div>
  );
}

export default ReclamosPage;