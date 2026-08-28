import { Patrocinantes } from '../../api/endpoints/patrocinantes';

const validate = (state) => {
  const errors = [];
  if (state.nombre.trim() === '') errors.push('Ingrese el nombre del patrocinante');
  return errors;
};

export const handleSubmit = async (e, state, dispatch, navigate) => {
  e.preventDefault();

  const errors = validate(state);
  if (errors.length > 0) {
    dispatch({ type: 'SET_ERRORS', errors });
    return;
  }

  dispatch({ type: 'SUBMIT_START' });

  try {
    const patrocinante = {
      id: state.id,
      nombre: state.nombre,
      nroMatricula: state.nroMatricula,
      domicilio: state.domicilio,
      localidad: state.localidad,
      nroCasillero: state.nroCasillero,
    };

    const isNew = isNaN(state.id);
 
    const result = isNew
      ? await Patrocinantes.create(patrocinante)
      : await Patrocinantes.update(patrocinante);

    if (result.ok) {
      const mensaje = `El patrocinante ${state.nombre} se ${isNew ? 'actualizó' : 'creó'} correctamente.`;
      dispatch({ type: 'SUBMIT_SUCCESS' });
      navigate('/patrocinantes', { state: { successMsg: mensaje } });
    } else {
      dispatch({ type: 'SUBMIT_FAIL', errors: result.error });
    }
  } catch (err) {
    dispatch({ type: 'SUBMIT_FAIL', errors: [err.message] });
  }
};
