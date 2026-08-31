import { Partes } from "../../api/endpoints/partes";
import { isNew } from '../Shared/utis.js';

const esEnteroValido = (s) => {
  const nro = Number(s);
  return s?.trim() !== '' && !isNaN(nro) && Number.isInteger(nro);
};

const validate = (state) => {
  const errors = [];
  if (state.nombre.trim() === '') errors.push('Ingrese un nombre.');
  if (!esEnteroValido(state.nroDocumento)) errors.push('Ingrese un número de documento válido.');
  if (state.enableCuil && (!esEnteroValido(state.cuil) || state.cuil == '0'))
    errors.push('Ingrese un cuil válido.');
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
    const parte = {
      id: state.id,
      nombre: state.nombre,
      idTipoDocumento: state.idTipoDocumento,
      nroDocumento: state.nroDocumento,
      cuil: state.cuil,
      domicilio: state.domicilio,
      localidad: state.localidad,
      idPatrocinante: state.patrocinante.id,
      esApoderado: state.esApoderado,
    };    

    const result = isNew(state.id)
			? await Partes.create(parte)
			: await Partes.update(parte);

    if (result.ok) {
      const mensaje = `La parte ${state.nombre} se ${state.isUpdate ? 'actualizó' : 'creó'} correctamente.`;
      dispatch({ type: 'SUBMIT_SUCCESS' });
      navigate('/partes', { state: { successMsg: mensaje } });
    } else {
      dispatch({ type: 'SUBMIT_FAIL', errors: result.error });
    }
  } catch (err) {
    dispatch({ type: 'SUBMIT_FAIL', errors: [err.message] });
  }
};

export const onAcceptSearchPatrocinante = (e, patrocinante, dispatch, toogleSearchPatrocinante) => {
  e.preventDefault();
  dispatch({ type: 'SET_FIELD', field: 'patrocinante', value: patrocinante });
  toogleSearchPatrocinante();
};
