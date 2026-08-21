import { Reclamos } from '../../api/endpoints/reclamos';
import { Partes } from '../../api/endpoints/partes';
import { validateReclamo } from './validators';
import { mapFormToApi } from './mappers';

export const handleOnChange = (e, setField) => {
  let v = e.target.value;
  switch (e.target.id) {
    case 'numero':
      v = parseInt(e.target.value.replace(/\D/g, ''));
      break;
    default:
      if (e.target.type === 'checkbox') {
        v = e.target.checked;
      }
      break;
  }
  setField(e.target.id, v);
};

export const handleSubmit = async (e, isCreateOperation, state, setErrors, submitStart, 
	submitSuccess, submitFail, navigate) => {

  e.preventDefault();
  const errors = validateReclamo(state);
  if (errors.length > 0) {
    setErrors(errors);
    return;
  }

  submitStart();

  const reclamo = mapFormToApi(state);
  const result = await (isCreateOperation ? Reclamos.create(reclamo) : Reclamos.update(reclamo));

  if (result.ok) {
    const mensaje =
      'El reclamo Nº ' +
      state.numero +
      ` se ${isCreateOperation ? 'creó' : 'actualizó'} correctamente.`;
    submitSuccess();
    navigate('/reclamos', { state: { successMsg: mensaje } });
  } else {
    submitFail(result.error);
  }
};

const getParte = async (id, field, partes, setField, setErrors) => {
  const fetch = async () => {
    const response = await Partes.get(id);
    if (response.ok) {
      const v = [...partes, response.data];
      setField(field, v);
    } else {
      const error = `Error ${response.status} al obtener los datos de la parte seleccionada: ${response.error}`;
      setErrors([error]);
    }
  };
  fetch();
};

export const onAcceptSearchParte = (e, parte, state, hidePartesDialog, setField, setErrors) => {
  e.preventDefault();
  const partes = state.searchPartes.esReclamante ? state.reclamantes : state.reclamados;
  if (!partes.find((r) => r.id === parte.id)) {
    const f = state.searchPartes.esReclamante ? 'reclamantes' : 'reclamados';
    getParte(parte.id, f, partes, setField, setErrors);
  }
  hidePartesDialog();
};
