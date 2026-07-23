import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function useTourInicial() {
  const TOUR_TAG = 'tour-v1';
  const driverRef = useRef(null);  

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Atrás',
      doneBtnText: 'Finalizar',
      onDestroyed: () => setTourVisto('true'),
      steps: [
        {
          element: '.main',
          popover: {
            title: '¡Hola! Bienvenido/a a Conciliaciones SDE.',
            description:
              'Este es tu espacio para generar actas de conciliación de forma ágil. Para avanzar, solo necesitas cargar los siguientes datos.',
          },
        },
        {
          element: '#patrocinantes',
          popover: {
            title: 'Patrocinantes',
            description:
              'Cargá o actualizá los datos de los patrocinantes. Ya existe un listado' + 
              ' de los abogados matriculados en Santiago del Estero',
          },
        },
        {
          element: '#partes',
          popover: {
            title: 'Partes',
            description:
              'Cargá las distintas partes y asignales un patrocinante.',
          },
        },
        {
          element: '#reclamos',
          popover: {
            title: 'Reclamos',
            description:
              'Cargá tus reclamos. Los estados de resolución pueden ser, entre otros:' +
              ' con acuerdo, sin acuerdo, fracasado o pendiente (si te faltan datos para finalizar la carga).',
          },
        },
        {
          element: '#username',
          popover: {
            title: 'Datos personales',
            description:
              'Gestioná tu contraseña y conectá tu cuenta de Google para que los reclamos se programen automáticamente' +
              ' en tu calendario principal.',
          },
        },
      ],
    });

    return () => driverRef.current?.destroy();
  }, []);

  function iniciarTour() {
    return driverRef.current?.drive();
  }

  function getTourVisto() {
    return localStorage.getItem(TOUR_TAG);
  }

  function setTourVisto(value) {
    localStorage.setItem(TOUR_TAG, value);
  }

  return { iniciarTour, getTourVisto };
}
