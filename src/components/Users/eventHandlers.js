import { Users } from "../../api/endpoints/users";

const validate = (state) => {
  const errors = [];
  if (state.nombre.trim() === '') errors.push('Ingrese un nombre.');
  return errors;
};

export const handleSubmit = async (e, state, dispatch, navigate) => {
  e.preventDefault();

  const errors = validate();
  if (errors.length > 0) {
    dispatch({ type: 'SET_ERRORS', errors });
    return;
  }

  dispatch({ type: 'SUBMIT_START' });

  try {
    const user = {
      nombre: state.nombre,
      nroHabilitacion: state.nroHabilitacion,
      currentPassword: state.password,
      newPassword: state.newPassword,
      passwordConfirmation: state.newPasswordRepeated,
    };

    let result;
    result = await Users.update(user);

    if (result.ok) {
      const mensaje = `Sus datos se actualizaron correctamente.`;
      dispatch({ type: 'SUBMIT_SUCCESS' });
      navigate('/reclamos', { state: { successMsg: mensaje } });
    } else {
      dispatch({ type: 'SUBMIT_FAIL', errors: result.error });
    }
  } catch (err) {
    dispatch({ type: 'SUBMIT_FAIL', errors: [err.message] });
  }
};
